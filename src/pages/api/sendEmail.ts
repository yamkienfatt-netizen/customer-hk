import { NextApiRequest, NextApiResponse } from 'next';
import { SMTPClient } from 'emailjs';
import { GetFormToEmailService } from '@/graphql/FormToEmailQuery.service';
import { boolean } from 'zod';

interface SendEmailRequest extends NextApiRequest {
  body: {
    language: string;
    emailConfigurationId: string;
    [key: string]: string | string[];
  };
}

const sendEmailApi = async (
  req: SendEmailRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  var formToEmailConfiguration = await GetFormToEmailService(req.body.emailConfigurationId, req.body.language);
  var emailContent = mapTokens(formToEmailConfiguration.item.messageTemplate.value as string, req.body);

  const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 25;
  const smtpSSL = process.env.SMTP_SSL ? process.env.SMTP_SSL?.toLowerCase?.() === 'true' : false;
  var smtpOptions = {
    host: process.env.SMTP_HOST,
    port: smtpPort,
    ssl: smtpSSL,
    user: process.env.SMTP_USERNAME,
	  password: process.env.SMTP_PASSWORD,
  };

  const smtpClient = new SMTPClient(smtpOptions);

  smtpClient.send(
    {
      text: emailContent,
      from: formToEmailConfiguration.item.fromEmail.value as string,
      to: formToEmailConfiguration.item.recipientEmail.value as string,
      subject: formToEmailConfiguration.item.subject.value as string,
    },
    (err, message) => {
      console.log(err || message);
    }
  );

  return res.status(200).send({});
};

function getAllPropertyTokens(obj: any): string[] {
  return Object.keys(obj);
}

function mapTokens(text: string, data: any): string {
  var result = text;
  var keys = getAllPropertyTokens(data);
  keys.forEach((x: string) => {
    result = result.replace('{{' + x + '}}', data[x]);
  });

  return result;
}

export default sendEmailApi;
