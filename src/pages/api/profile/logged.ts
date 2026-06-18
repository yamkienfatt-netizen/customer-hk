import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions, ExtendedSession } from '../auth/[...nextauth]';

const checkLoggerApi = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  if (req.method !== 'GET') {
    return res.status(405).end(); // Method Not Allowed
  }
  let logged = false;
  let memberId = '';
  try {
    const session = (await getServerSession(req, res, authOptions)) as ExtendedSession;
    if (session?.user?.profile) {
      logged = true;
      memberId = session.user.profile.Id || '';
    }
  } catch (e) {
    console.log(`checkLoggerApi ERROR`, e);
  }
  return res.status(200).send({ logged, memberId });
};

export default checkLoggerApi;
