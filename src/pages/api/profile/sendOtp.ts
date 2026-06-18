import { getClientIp, ssoApiService } from '@/services/SsoApiService';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions, ExtendedSession } from '@/pages/api/auth/[...nextauth]';
import { logSsoApiRequest } from '@/services/logging-service';

interface SendOrpRequest extends NextApiRequest {
  body: {
    Channel: string;
    MobileCountry: string;
    MobilePhoneNumber: string;
    Email: string;
    Locale: string;
  };
}

const sendOTPApi = async (
  req: SendOrpRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }
  try {
    logSsoApiRequest(req, res);
    const session = (await getServerSession(req, res, authOptions)) as ExtendedSession;
    const token = session?.user?.access_token ?? undefined;
    if (token == null) {
      return res.status(401).end();
    }
    if (req.body?.Channel == 'email') {
      const resp = await ssoApiService.sendEmailOtp(
        req.body.Email,
        req.body.Locale,
        token,
        getClientIp(req)
      );
      console.log(`sendEmailOtp`, resp);
      return res.status(200).send(resp);
    } else if (req.body?.Channel == 'phone') {
      const resp = await ssoApiService.sendSmsOtp(
        req.body.MobileCountry,
        req.body.MobilePhoneNumber,
        req.body.Locale,
        token,
        getClientIp(req)
      );
      console.log(`sendSmsOtp`, resp);
      return res.status(200).send(resp);
    }
  } catch (e: any) {
    console.log(`sendSmsOtp ERROR`, e);
    if (e?.response?.data) {
      return res.status(e.response.status).send(e.response.data);
    }
  }
  return res.status(400).send({});
};

export default sendOTPApi;
