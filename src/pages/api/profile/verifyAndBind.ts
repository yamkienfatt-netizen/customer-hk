import { getClientIp, ssoApiService } from '@/services/SsoApiService';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions, ExtendedSession } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { getToken } from 'next-auth/jwt';
import { profileCache } from '@/utilities/CacheUtilities';
import { logSsoApiRequest } from '@/services/logging-service';

interface VerifyAndBindOtpRequest extends NextApiRequest {
  body: {
    Channel: string;
    Signature: string;
    UserInputCode: string;
  };
}

const verifyAndBindApi = async (
  req: VerifyAndBindOtpRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }
  try {
    logSsoApiRequest(req, res);
    const session = (await getServerSession(req, res, authOptions)) as ExtendedSession;
    let token = session?.user?.access_token ?? null;
    //if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    if (token == null) {
      return res.status(401).end();
    }
    const jwt = await getToken({ req });
    if (jwt?.sub) {
      console.log(`Delete cache for ${jwt?.sub}`);
      await profileCache.del(jwt.sub);
    }
    if (req.body?.Channel === 'email') {
      const resp = await ssoApiService.verifyAndBindEmail(
        req.body.Signature,
        req.body.UserInputCode,
        token,
        getClientIp(req)
      );
      console.log(`verifyAndBindEmail`, resp);
      return res.status(200).send(resp);
    } else if (req.body?.Channel === 'phone') {
      const resp = await ssoApiService.verifyAndBindPhone(
        req.body.Signature,
        req.body.UserInputCode,
        token,
        getClientIp(req)
      );
      console.log(`verifyAndBindPhone`, resp);
      return res.status(200).send(resp);
    }
  } catch (e: any) {
    console.log(`verifyAndBind ERROR`, e);
    if (e?.response?.data) {
      return res.status(e.response.status).send(e.response.data);
    }
  }
};

export default verifyAndBindApi;
