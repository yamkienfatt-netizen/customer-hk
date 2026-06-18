import type { NextApiRequest, NextApiResponse } from 'next';

class IsCreateProfileDto {
  title: string = '';
  lastname: string = '';
  firstname: string = '';
  emailAddress: string = '';
  stayedInThePast: string = '';
  residenceLocation: string = '';
  stayedInProperty: string = '';
  createdLocation: string = '';
  marketingOptinLastModifiedSource: string = 'Website';
  marketingOptIn: boolean = true;
  privacyPolicyConsent: boolean = true;
  dataManageWithinResidence: boolean = true;
  dataManageOutsideResidence: boolean = true;
  sensitiveInfoOptIn: boolean = true;
}

interface SubscriptionRequest extends NextApiRequest {
  body: {
    title: string;
    residenceLocation: string;
    lastName: string;
    firstName: string;
    email: string;
    confirmEmail: string;
    stayedHotels: string[]; //One or more value from SalesforceAPIKey_Hotel enum
    stayedInThePast: string;
    propertyCode: string; //One of the value from SalesforceAPIKey_PropertyCode enum
  };
}

const subscriptionApi = async (
  req: SubscriptionRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  console.log(req.body);
  var isCreateProfileDto = new IsCreateProfileDto();
  isCreateProfileDto.title = req.body.title;
  isCreateProfileDto.residenceLocation = req.body.residenceLocation;
  isCreateProfileDto.firstname = req.body.firstName;
  isCreateProfileDto.lastname = req.body.lastName;
  isCreateProfileDto.emailAddress = req.body.email;
  isCreateProfileDto.createdLocation = req.body.propertyCode;
  isCreateProfileDto.stayedInThePast = req.body.stayedInThePast;
  isCreateProfileDto.stayedInProperty =
    req.body.stayedHotels.length > 0 ? req.body.stayedHotels.join(';') : '';

  var isSuccess = await CallSalesforceAPI(isCreateProfileDto);
  if (isSuccess) {
    return res.status(200).send({});
  } else {
    return res.status(500).send({});
  }
};

async function CallSalesforceAPI(data: IsCreateProfileDto) {
  const res = await fetch(process.env.SALESFORCE_IS_HOST!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (res.status.toString() === '200') {
    return true;
  } else {
    const sfISResponse = await res.json();
    console.log(sfISResponse);
    return false;
  }
}

export default subscriptionApi;
