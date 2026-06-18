import { getClientIp, ssoApiService } from '@/services/SsoApiService';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions, ExtendedSession } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { logSsoApiRequest } from '@/services/logging-service';

const getUpcomingBookingApi = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  if (req.method !== 'GET') {
    return res.status(405).end(); // Method Not Allowed
  }
  try {
    logSsoApiRequest(req, res);
    const session = (await getServerSession(req, res, authOptions)) as ExtendedSession;
    let token = session?.user?.access_token ?? null;
    if (token == null) {
      return res.status(401).end();
    }
    const resp = await ssoApiService.getUpcomingBookings(token, getClientIp(req));
    //console.log(`getUpcomingBookingApi`, resp);
    return res.status(200).send(resp);
  } catch (e: any) {
    console.log(`getUpcomingBookingApi ERROR`, e);
    if (e?.response?.data) {
      return res.status(e.response.status).send(e.response.data);
    }
  }
  return res.status(400).send({});
};

export default getUpcomingBookingApi;
