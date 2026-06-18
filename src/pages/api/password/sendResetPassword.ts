import { logSsoApiRequest } from '@/services/logging-service';
import { getClientIp, ssoApiService } from '@/services/SsoApiService';
import { NextApiRequest, NextApiResponse } from 'next';

// interface SendResetPWDRequest extends NextApiRequest {
//   Email: string;
// }
const sendResetPasswordAPI = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  try {
    logSsoApiRequest(req, res);
    const resp = await ssoApiService.sendResetPassword(req.body, getClientIp(req));
    console.log(`sendResetPassword`, resp);
    return res.status(200).send(resp);
  } catch (e: any) {
    console.log(`sendResetPassword ERROR`, e);
    if (e?.response?.data) {
      return res.status(e.response.status).send(e.response.data);
    }
  }
};

export default sendResetPasswordAPI;
