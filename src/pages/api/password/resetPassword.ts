import { logSsoApiRequest } from '@/services/logging-service';
import { getClientIp, ssoApiService } from '@/services/SsoApiService';
import { verifyPassword } from '@/utilities/SsoConstant';
import { NextApiRequest, NextApiResponse } from 'next';

const resetPasswordAPI = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  try {
    logSsoApiRequest(req, res);
    const password = req.body?.Password ?? '';
    const { lengthMatch, errors } = verifyPassword(password);
    if (!lengthMatch || errors?.length > 1) {
      return res.status(400).send({ errors });
    }
    const resp = await ssoApiService.resetPassword(req.body, getClientIp(req));
    //console.log(`resetPassword:`, resp);
    return res.status(200).send(resp);
  } catch (e: any) {
    console.log(`resetPassword ERROR`, e);
    if (e?.response?.data) {
      return res.status(e.response.status).send(e.response.data);
    }
  }
};
export default resetPasswordAPI;
