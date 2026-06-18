import { logSsoApiRequest } from '@/services/logging-service';
import { getClientIp, ssoApiService } from '@/services/SsoApiService';
import { NextApiRequest, NextApiResponse } from 'next';

const verifyResetPasswordAPI = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  try {
    logSsoApiRequest(req, res);
    const resp = await ssoApiService.verifyResetPassword(req.body.RequestId, getClientIp(req));
    console.log(`verifyResetPassword:`, resp);
    return res.status(200).send(resp);
  } catch (e: any) {
    console.log(`verifyResetPassword ERROR`, e);
    if (e?.response?.data) {
      return res.status(e.response.status).send(e.response.data);
    }
  }
};
export default verifyResetPasswordAPI;
