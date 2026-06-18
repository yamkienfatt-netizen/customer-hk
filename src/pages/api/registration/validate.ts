import { logSsoApiRequest } from '@/services/logging-service';
import { getClientIp, ssoApiService } from '@/services/SsoApiService';
import type { NextApiRequest, NextApiResponse } from 'next';

interface ValidateRequest extends NextApiRequest {
  body: {
    Channel: string;
    MobileCountry: string;
    MobilePhoneNumber: string;
    Email: string;
  };
}

const validateApi = async (
  req: ValidateRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }
  try {
    logSsoApiRequest(req, res);
    //const session = (await getServerSession(req, res, authOptions)) as ExtendedSession;
    //const token = session?.user?.access_token ?? undefined;
    if (req.body?.Channel == 'email') {
      const resp = await ssoApiService.validateEmail(req.body.Email, getClientIp(req));
      console.log(`validateEmail`, resp);
      return res.status(200).send(resp);
    } else if (req.body?.Channel == 'phone') {
      const resp = await ssoApiService.validatePhoneNumber(
        req.body.MobileCountry,
        req.body.MobilePhoneNumber,
        getClientIp(req)
      );
      console.log(`validatePhoneNumber`, resp);
      return res.status(200).send(resp);
    }
  } catch (e: any) {
    console.log(`validateApi ERROR`, e);
    if (e?.response?.data) {
      return res.status(e.response.status).send(e.response.data);
    }
  }
  return res.status(400).send({});
};

export default validateApi;
