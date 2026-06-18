import { getClientIp, ssoApiService } from '@/services/SsoApiService';
import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions, ExtendedSession } from '../auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { logSsoApiRequest } from '@/services/logging-service';
import { verifyPassword } from '@/utilities/SsoConstant';

const setPasswordApi = async (
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
    const session = (await getServerSession(req, res, authOptions)) as ExtendedSession;
    let token = session?.user?.access_token ?? null;
    if (token == null) {
      return res.status(401).end();
    }
    const resp = await ssoApiService.setPassword(req.body, token, getClientIp(req));
    return res.status(200).send(resp);
  } catch (e: any) {
    console.log(`setPassword ERROR`, e);
    if (e?.response?.data) {
      return res.status(e.response.status).send(e.response.data);
    }
  }
};
export default setPasswordApi;
