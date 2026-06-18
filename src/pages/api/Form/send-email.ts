import { GetFormToEmailService } from '@/graphql/FormToEmailQueryReq.service';
import { formService } from '@/services/form-service';
import { loggers } from '@/services/logging-service';
import { form } from '@sitecore-cloudsdk/events/browser';
import { NextApiRequest, NextApiResponse } from 'next';
import { date } from 'zod';

interface InquriesFormRequest extends NextApiRequest {
  body: {
    // ContextID: string;
    language: string;
    [key: string]: string;
  };
}

const HandleFormProcessApi = async (
  req: InquriesFormRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  try {
    const keyMatch = req.headers?.apimatch as string;
    const contextId = !!req.body.InquiryCategory? req.body.InquiryCategory : req.query?.ContextID as string;
    const language = (req.query?.Language as string) || 'en';
    console.log({ "Parameter(Website):": req.query?.ContextID });
    console.log({ "Parameter(Form):": req.body.InquiryCategory });
    // console.log({ keyMatch });
    if (!keyMatch || !formService.checkValidKey(keyMatch)) {
        loggers.sso().info('MeetingEventInquriesForm: Unauthorized access attempt with key:', { keyMatch });
      throw new Error('Unauthorized');
    }
    const formToEmailConfiguration = await GetFormToEmailService(contextId, language);
    // console.log(req);
    const body = formToEmailConfiguration?.EmailBody?.value || '';
    const emailContent = formService.mapTokens(body, req.body);
    const subject = formToEmailConfiguration?.Subject?.value || '';
    const from = formToEmailConfiguration?.FromEmail?.value || '';
    const to = req?.body?.Email || '';
    const result = await formService.sendEmailToRecivers(emailContent, subject, from, to);
    loggers.sso().info('MeetingEventInquriesForm: Email sent with details:', {body, emailContent, subject, from, to});
    const InternalBody = formToEmailConfiguration?.InternalEmailBody.value || '';
    const InternalemailContent = formService.mapTokens(InternalBody, req.body);
    const Internalsubject = formToEmailConfiguration?.InternalSubject?.value || '';
    const Internalfrom = formToEmailConfiguration?.InternalFromEmail?.value || '';
    const Internalto = formToEmailConfiguration?.InternalRecipientEmail?.value || '';
    loggers.sso().info('MeetingEventInquriesForm: Internal email details:', {InternalBody, InternalemailContent, Internalsubject, Internalfrom, Internalto});
    let Internalresult: any = '';
    if (!!InternalemailContent && !!Internalsubject && !!Internalfrom && !!Internalto)
      Internalresult = await formService.sendEmailToRecivers(
        InternalemailContent,
        Internalsubject,
        Internalfrom,
        Internalto
      );
    if ((!!result && result == 'Success') || (!!Internalresult && Internalresult == 'Success'))
      return res.status(200).send([{ Message: 'Success' }]);
    return res.status(400).send([{ Message: 'Failed to send email' }]);
  } catch (e: any) {
    loggers.sso().error('MeetingEventInquriesForm: Error occurred:', e);
    return res.status(400).send({ e });
  }
};

export default HandleFormProcessApi;
