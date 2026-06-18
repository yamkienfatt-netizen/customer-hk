import { logSsoApiRequest } from '@/services/logging-service';
import { getClientIp, ssoApiService, SsoUserProfile } from '@/services/SsoApiService';
import { AzureB2CProfile } from '@/utilities/SsoConstant';
import type { NextApiRequest, NextApiResponse } from 'next';

interface CreateProfileRequest extends NextApiRequest {
  body: SsoUserProfile;
}

const regex = new RegExp(AzureB2CProfile.REGEX_ENAME);
const createProfileApi = async (
  req: CreateProfileRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }
  try {
    logSsoApiRequest(req, res);
    if (!regex.test(req.body.FirstName) || !regex.test(req.body.LastName)) {
      return res.status(400).send({});
    }
    const resp = await ssoApiService.createProfile(req.body, getClientIp(req));
    console.log(`createProfile`, resp);
    return res.status(200).send(resp);
  } catch (e: any) {
    console.log(`createProfile ERROR`, e);
    if (e?.response?.data) {
      return res.status(e.response.status).send(e.response.data);
    }
  }
  return res.status(400).send({});
};

export default createProfileApi;
