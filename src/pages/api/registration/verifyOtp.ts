import { logSsoApiRequest } from '@/services/logging-service';
import { getClientIp, ssoApiService } from '@/services/SsoApiService';
import type { NextApiRequest, NextApiResponse } from 'next';

interface VerifyOtpRequest extends NextApiRequest {
  body: {
    Signature: string;
    UserInputCode: string;
  };
}

const verifyOTPApi = async (
  req: VerifyOtpRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }
  try {
    logSsoApiRequest(req, res);
    const resp = await ssoApiService.verifyOTP(
      req.body.Signature,
      req.body.UserInputCode,
      getClientIp(req)
    );
    console.log(`verifyOTP`, resp);
    return res.status(200).send(resp);
  } catch (e: any) {
    console.log(`verifyOTP ERROR`, e);
    if (e?.response?.data) {
      return res.status(e.response.status).send(e.response.data);
    }
  }
};

export default verifyOTPApi;
