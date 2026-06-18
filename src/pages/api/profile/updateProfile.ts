import { getClientIp, ssoApiService, SsoUpdateProfile } from '@/services/SsoApiService';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions, ExtendedSession } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { profileCache } from '@/utilities/CacheUtilities';
import { getToken } from 'next-auth/jwt';
import { logSsoApiRequest } from '@/services/logging-service';
import { AzureB2CProfile } from '@/utilities/SsoConstant';

interface UpdateProfileRequest extends NextApiRequest {
  body: SsoUpdateProfile;
}

const regex = new RegExp(AzureB2CProfile.REGEX_ENAME);
const updateProfileApi = async (
  req: UpdateProfileRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }
  try {
    logSsoApiRequest(req, res);
    const session = (await getServerSession(req, res, authOptions)) as ExtendedSession;
    let token = session?.user?.access_token ?? null;
    if (token == null) {
      //if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      return res.status(401).end();
    }
    if (!regex.test(req.body.FirstName) || !regex.test(req.body.LastName)) {
      return res.status(400).send({});
    }
    //console.log('param', req.body)
    const resp = await ssoApiService.updateProfile(req.body, token, getClientIp(req));
    const jwt = await getToken({ req });
    if (jwt?.sub) {
      console.log(`Delete cache for ${jwt?.sub}`);
      await profileCache.del(jwt.sub);
    }
    console.log(`updateProfileApi`, resp);
    return res.status(200).send(resp);
  } catch (e: any) {
    console.log(`updateProfileApi ERROR`, e);
    if (e?.response?.data) {
      return res.status(e.response.status).send(e.response.data);
    }
  }
  return res.status(400).send({});
};

export default updateProfileApi;
