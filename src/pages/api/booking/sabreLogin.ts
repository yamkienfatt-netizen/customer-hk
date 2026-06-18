import { getClientIp, ssoApiService } from '@/services/SsoApiService';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions, ExtendedUser, userProfile } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"
import { createCache, memoryStore } from 'cache-manager';
import { logSsoApiRequest } from '@/services/logging-service';

const tokenTTL = 30 * 1000 * 60;
const sabreTokenCache = createCache(memoryStore(), {
  max: 100,
  ttl: tokenTTL,
});

const sabreLoginApi = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  if (req.method !== 'GET') {
    return res.status(405).end(); // Method Not Allowed
  }
  try {
    logSsoApiRequest(req, res);
    const session = await getServerSession(req, res, authOptions)
    let token = session?.user?.access_token ?? null;
    if (!token) {
      return res.status(400).send({});
    }
    const userProfile = (session?.user as ExtendedUser)?.profile as userProfile;
    const key = `sabre_token_${userProfile?.AADB2CId ?? new Date()}`;
    const cachedTokenData = await sabreTokenCache.get(key);
    if (cachedTokenData) {
      console.log(`sabreLoginApi token not expire for ${key}, use refresh`);
      const respRefresh = await ssoApiService.sabreLoginRefresh(token, getClientIp(req));
      return res.status(200).send(respRefresh);
    } else {
      const resp = await ssoApiService.sabreLogin(token, getClientIp(req));
      if (resp && !resp.ErrorCode) {
        sabreTokenCache.set(key, true);
      }
      return res.status(200).send(resp);
    }
  } catch (e: any) {
    console.log(`sabreLoginApi ERROR`, e);
    if (e?.response?.data) {
      return res.status(e.response.status).send(e.response.data);
    }
  }
  return res.status(400).send({});
};

export default sabreLoginApi;
