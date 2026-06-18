import { getClientIp, ssoApiService } from '@/services/SsoApiService';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions, ExtendedSession } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { logSsoApiRequest } from '@/services/logging-service';

const getProfileApi = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  if (req.method !== 'GET') {
    return res.status(405).end(); // Method Not Allowed
  }
  try {
    logSsoApiRequest(req, res);
    const session = (await getServerSession(req, res, authOptions)) as ExtendedSession;
    // if (session?.user?.profile) {
    //   //minimize API call by set to session
    //   console.log(`getProfileApi`, session.user.profile);
    //   return res.status(200).send(session.user.profile);
    // }
    let token = session?.user?.access_token ?? null;
    if (token == null) {
      //if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      return res.status(401).end();
      token =
        'eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3MjA0MjQ4MjAsIm5iZiI6MTcyMDQyMTIyMCwidmVyIjoiMS4wIiwiaXNzIjoiaHR0cHM6Ly9zaGdhZGIyY2RlbW8uYjJjbG9naW4uY29tLzJjYzc4YzQ5LTgzNTctNDQ2OS1iNGFiLTk5ZDBkNjMyOGJmZC92Mi4wLyIsInN1YiI6IjdiZDUyM2Q5LTQ0ZGQtNDI1ZS04YmY5LTEwMTcyNTg5NTY4ZSIsImF1ZCI6IjhkMjQzYmFlLTNjNDktNGNiMi1hYTU4LTQxMmE3OWYxZGVkYiIsIm5vbmNlIjoiZGVmYXVsdE5vbmNlIiwiaWF0IjoxNzIwNDIxMjIwLCJhdXRoX3RpbWUiOjE3MjA0MjEyMjAsIm9pZCI6IjdiZDUyM2Q5LTQ0ZGQtNDI1ZS04YmY5LTEwMTcyNTg5NTY4ZSIsIm5hbWUiOiJEdW1teSwgRHVtbXkiLCJlbWFpbHMiOlsiZHVtbXkwMi5tdWlAZ21haWwuY29tIl0sInRmcCI6IkIyQ18xX1NTT19TVVNJIn0.iL8ZCXyjDCIqdlA1oyVBHnEtDVBq5qEtRDzFa7tObmftsMnKvAfBIvTm5ch8T9sIZP-IGWX8HLs-xLvLmT6KvlirIk2EvBr59pPWp0IC693M6Kg5sKEttAWmyNlUwL8P2h9HVwNJfixBZm-ai9-poIpnJxL4pX8o1v9BkGVtwWJ6YMC3UgA5sk85lK4LTlJVwCO_-8xKI_TVJXy8ZieZPQhIBcjcb6-45s8YFBrIbwHYhOHQUlGVXYOgoZtgi-5So4XM3BTY_8ua2xVdF91t6jQpaXWROAlKuwjtYyQ5H3d8B8lNf4cCKVxmCk4Kj-x9kr68cwJLTRrDPQ3ZvkC4dw';
    }
    const resp = await ssoApiService.getProfileV2(token, getClientIp(req));
    //console.log(`getProfileApi`, resp);
    return res.status(200).send(resp);
  } catch (e: any) {
    console.log(`getProfileApi ERROR`, e);
    if (e?.response?.data) {
      return res.status(e.response.status).send(e.response.data);
    }
  }
  return res.status(400).send({});
};

export default getProfileApi;
