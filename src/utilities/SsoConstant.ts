import { randomUUID } from 'crypto';
import { DICTIONARY_CONSTANT } from './DictionaryConstant';
import { otpTokenEncryptionService } from '@/services/SsoEncryptionService';
import { getMemoryCache } from './CacheUtilities';
import PasswordValidator from 'password-validator';

export const SsoApiPaths = {
  OTP_SEND_SMS: `/api/v1/OTP/SendSMS/en/EastHotelsWebsite`,
  OTP_SEND_EMAIL: `/api/v1/OTP/SendEmail/en/EastHotelsWebsite`,
  OTP_VERIFY_CODE: '/api/v1/OTP/VerifyOTP',
  PROFILE: '/api/v1/Profile',
  PROFILE_WITH_PWD: '/api/v2/Profile',
  PROFILE_ERIFY_AND_BIND_EMAIL: '/api/v1/Profile/VerifyAndBindEmail',
  PROFILE_VERIFY_AND_BIND_PHONE: '/api/v1/Profile/VerifyAndBindPhone',
  PROFILE_GET_UPCOMING_BOOKINGS: '/api/v1/Bookings/Upcoming',
  LOGIN_SABRE: '/api/v1/Login/Sabre',
  LOGIN_SABRE_REFRESH: '/api/v1/Login/Sabre/Refresh',
  VALIDATE_PHONE_NUMBER: '/api/v1/Validation/ValidatePhoneNumber',
  VALIDATE_EMAIL: '/api/v1/Validation/ValidateEmail',
  SEND_RESET_PWD: '/api/v2/login/reset/request/en/EastHotelsWebsite',
  VERIFY_RESET_PWD: '/api/v2/login/reset/verify',
  RESET_PWD: '/api/v2/login/reset/adb2c',
  SET_PWD: '/api/v2/Profile/password',
  SIGN_IN_CALLBACK: '/member/member-offers',
  SIGN_UP_CALLBACK: '/registration',
  SIGN_IN_PAGE: '/login',
  SIGN_IN_ERROR_PAGE: '/login/error',
  LOGIN_TOKEN: '/api/auth/callback/azureb2c-pwd',
};

export const MobileAreaCode = [
  { code: '000', label: '+000' },
  { code: '86', label: '+86' },
  { code: '852', label: '+852' },
  { code: '853', label: '+853' },
  { code: '1', label: '+1' },
  { code: '1242', label: '+1242' },
  { code: '1246', label: '+1246' },
  { code: '1264', label: '+1264' },
  { code: '1268', label: '+1268' },
  { code: '1284', label: '+1284' },
  { code: '1340', label: '+1340' },
  { code: '1345', label: '+1345' },
  { code: '1441', label: '+1441' },
  { code: '1473', label: '+1473' },
  { code: '1599', label: '+1599' },
  { code: '1649', label: '+1649' },
  { code: '1664', label: '+1664' },
  { code: '1670', label: '+1670' },
  { code: '1671', label: '+1671' },
  { code: '1684', label: '+1684' },
  { code: '1758', label: '+1758' },
  { code: '1767', label: '+1767' },
  { code: '1784', label: '+1784' },
  { code: '1809', label: '+1809' },
  { code: '1868', label: '+1868' },
  { code: '1869', label: '+1869' },
  { code: '1876', label: '+1876' },
  { code: '20', label: '+20' },
  { code: '212', label: '+212' },
  { code: '213', label: '+213' },
  { code: '216', label: '+216' },
  { code: '218', label: '+218' },
  { code: '220', label: '+220' },
  { code: '221', label: '+221' },
  { code: '222', label: '+222' },
  { code: '223', label: '+223' },
  { code: '224', label: '+224' },
  { code: '225', label: '+225' },
  { code: '226', label: '+226' },
  { code: '227', label: '+227' },
  { code: '228', label: '+228' },
  { code: '229', label: '+229' },
  { code: '230', label: '+230' },
  { code: '231', label: '+231' },
  { code: '232', label: '+232' },
  { code: '233', label: '+233' },
  { code: '234', label: '+234' },
  { code: '235', label: '+235' },
  { code: '236', label: '+236' },
  { code: '237', label: '+237' },
  { code: '238', label: '+238' },
  { code: '239', label: '+239' },
  { code: '240', label: '+240' },
  { code: '241', label: '+241' },
  { code: '242', label: '+242' },
  { code: '243', label: '+243' },
  { code: '244', label: '+244' },
  { code: '245', label: '+245' },
  { code: '248', label: '+248' },
  { code: '249', label: '+249' },
  { code: '250', label: '+250' },
  { code: '251', label: '+251' },
  { code: '252', label: '+252' },
  { code: '253', label: '+253' },
  { code: '254', label: '+254' },
  { code: '255', label: '+255' },
  { code: '256', label: '+256' },
  { code: '257', label: '+257' },
  { code: '258', label: '+258' },
  { code: '260', label: '+260' },
  { code: '261', label: '+261' },
  { code: '262', label: '+262' },
  { code: '263', label: '+263' },
  { code: '264', label: '+264' },
  { code: '265', label: '+265' },
  { code: '266', label: '+266' },
  { code: '267', label: '+267' },
  { code: '268', label: '+268' },
  { code: '269', label: '+269' },
  { code: '27', label: '+27' },
  { code: '290', label: '+290' },
  { code: '291', label: '+291' },
  { code: '297', label: '+297' },
  { code: '298', label: '+298' },
  { code: '299', label: '+299' },
  { code: '30', label: '+30' },
  { code: '31', label: '+31' },
  { code: '32', label: '+32' },
  { code: '33', label: '+33' },
  { code: '34', label: '+34' },
  { code: '350', label: '+350' },
  { code: '351', label: '+351' },
  { code: '352', label: '+352' },
  { code: '353', label: '+353' },
  { code: '354', label: '+354' },
  { code: '355', label: '+355' },
  { code: '356', label: '+356' },
  { code: '357', label: '+357' },
  { code: '358', label: '+358' },
  { code: '359', label: '+359' },
  { code: '36', label: '+36' },
  { code: '370', label: '+370' },
  { code: '371', label: '+371' },
  { code: '372', label: '+372' },
  { code: '373', label: '+373' },
  { code: '374', label: '+374' },
  { code: '375', label: '+375' },
  { code: '376', label: '+376' },
  { code: '377', label: '+377' },
  { code: '378', label: '+378' },
  { code: '380', label: '+380' },
  { code: '381', label: '+381' },
  { code: '382', label: '+382' },
  { code: '385', label: '+385' },
  { code: '386', label: '+386' },
  { code: '387', label: '+387' },
  { code: '389', label: '+389' },
  { code: '39', label: '+39' },
  { code: '40', label: '+40' },
  { code: '41', label: '+41' },
  { code: '420', label: '+420' },
  { code: '421', label: '+421' },
  { code: '423', label: '+423' },
  { code: '43', label: '+43' },
  { code: '44', label: '+44' },
  { code: '45', label: '+45' },
  { code: '46', label: '+46' },
  { code: '47', label: '+47' },
  { code: '48', label: '+48' },
  { code: '49', label: '+49' },
  { code: '500', label: '+500' },
  { code: '501', label: '+501' },
  { code: '502', label: '+502' },
  { code: '503', label: '+503' },
  { code: '504', label: '+504' },
  { code: '505', label: '+505' },
  { code: '506', label: '+506' },
  { code: '507', label: '+507' },
  { code: '508', label: '+508' },
  { code: '509', label: '+509' },
  { code: '51', label: '+51' },
  { code: '52', label: '+52' },
  { code: '53', label: '+53' },
  { code: '54', label: '+54' },
  { code: '55', label: '+55' },
  { code: '56', label: '+56' },
  { code: '57', label: '+57' },
  { code: '58', label: '+58' },
  { code: '590', label: '+590' },
  { code: '591', label: '+591' },
  { code: '592', label: '+592' },
  { code: '593', label: '+593' },
  { code: '595', label: '+595' },
  { code: '597', label: '+597' },
  { code: '598', label: '+598' },
  { code: '599', label: '+599' },
  { code: '60', label: '+60' },
  { code: '61', label: '+61' },
  { code: '62', label: '+62' },
  { code: '63', label: '+63' },
  { code: '64', label: '+64' },
  { code: '65', label: '+65' },
  { code: '66', label: '+66' },
  { code: '670', label: '+670' },
  { code: '672', label: '+672' },
  { code: '673', label: '+673' },
  { code: '674', label: '+674' },
  { code: '675', label: '+675' },
  { code: '676', label: '+676' },
  { code: '677', label: '+677' },
  { code: '678', label: '+678' },
  { code: '679', label: '+679' },
  { code: '680', label: '+680' },
  { code: '681', label: '+681' },
  { code: '682', label: '+682' },
  { code: '683', label: '+683' },
  { code: '685', label: '+685' },
  { code: '686', label: '+686' },
  { code: '687', label: '+687' },
  { code: '688', label: '+688' },
  { code: '689', label: '+689' },
  { code: '690', label: '+690' },
  { code: '691', label: '+691' },
  { code: '692', label: '+692' },
  { code: '7', label: '+7' },
  { code: '81', label: '+81' },
  { code: '82', label: '+82' },
  { code: '84', label: '+84' },
  { code: '850', label: '+850' },
  { code: '855', label: '+855' },
  { code: '856', label: '+856' },
  { code: '870', label: '+870' },
  { code: '880', label: '+880' },
  { code: '886', label: '+886' },
  { code: '90', label: '+90' },
  { code: '91', label: '+91' },
  { code: '92', label: '+92' },
  { code: '93', label: '+93' },
  { code: '94', label: '+94' },
  { code: '95', label: '+95' },
  { code: '960', label: '+960' },
  { code: '961', label: '+961' },
  { code: '962', label: '+962' },
  { code: '963', label: '+963' },
  { code: '964', label: '+964' },
  { code: '965', label: '+965' },
  { code: '966', label: '+966' },
  { code: '967', label: '+967' },
  { code: '968', label: '+968' },
  { code: '970', label: '+970' },
  { code: '971', label: '+971' },
  { code: '972', label: '+972' },
  { code: '973', label: '+973' },
  { code: '974', label: '+974' },
  { code: '975', label: '+975' },
  { code: '976', label: '+976' },
  { code: '977', label: '+977' },
  { code: '98', label: '+98' },
  { code: '992', label: '+992' },
  { code: '993', label: '+993' },
  { code: '994', label: '+994' },
  { code: '995', label: '+995' },
  { code: '996', label: '+996' },
  { code: '998', label: '+998' },
];

export const SalesforceTitles = [
  { code: 'AAMR', label: '/SSO/Titles/AAMR' },
  { code: 'AAMS', label: '/SSO/Titles/AAMS' },
  { code: 'AAMRS', label: '/SSO/Titles/AAMRS' },
  // { code: 'AMBASS', label: '/SSO/Titles/AMBASS' },
  // { code: 'BISHOP', label: '/SSO/Titles/BISHOP' },
  // { code: 'DAME', label: '/SSO/Titles/DAME' },
  // { code: 'DATO', label: '/SSO/Titles/DATO' },
  { code: 'DR', label: '/SSO/Titles/DR' },
  // { code: 'DRMR', label: '/SSO/Titles/DRMR' },
  // { code: 'DRMRS', label: '/SSO/Titles/DRMRS' },
  // { code: 'GOVERN', label: '/SSO/Titles/GOVERN' },
  // { code: 'HONOUR', label: '/SSO/Titles/HONOUR' },
  // { code: 'LADY', label: '/SSO/Titles/LADY' },
  // { code: 'LORD', label: '/SSO/Titles/LORD' },
  // { code: 'MADAME', label: '/SSO/Titles/MADAME' },
  // { code: 'MAYOR', label: '/SSO/Titles/MAYOR' },
  // { code: 'MONSIE', label: '/SSO/Titles/MONSIE' },
  // { code: 'MRMR', label: '/SSO/Titles/MRMR' },
  // { code: 'MRMRS', label: '/SSO/Titles/MRMRS' },
];

export const PrivacyPolicyChecklist = [
  {
    code: 'privacy-policy',
    label: DICTIONARY_CONSTANT.SSO.Global.CONSENT_PRIVACY_POLICY,
    required: true,
  },
  {
    code: 'manage-pii',
    label: DICTIONARY_CONSTANT.SSO.Global.CONSENT_MANAGEMENT_PII,
    required: true,
  },
  {
    code: 'provision-pii',
    label: DICTIONARY_CONSTANT.SSO.Global.CONSENT_PROVISION_PII,
    required: true,
  },
  { code: 'use-pii', label: DICTIONARY_CONSTANT.SSO.Global.CONSENT_USE_PII, required: false },
];

export const ConsentList = [
  { code: 'use-pii', label: DICTIONARY_CONSTANT.SSO.Consent.CONSENT_USE_PII, required: false },
  {
    code: 'privacy-policy',
    label: DICTIONARY_CONSTANT.SSO.Consent.CONSENT_PRIVACY_POLICY,
    required: true,
  },
  {
    code: 'provision-pii',
    label: DICTIONARY_CONSTANT.SSO.Consent.CONSENT_PROVISION_PII,
    required: true,
  },
];

export const InterestChecklist = [
  { code: 'art-and-design', label: DICTIONARY_CONSTANT.SSO.Interest.ART },
  { code: 'music', label: DICTIONARY_CONSTANT.SSO.Interest.MUSIC },
  { code: 'wellness', label: DICTIONARY_CONSTANT.SSO.Interest.DESIGN },
  { code: 'fashion', label: DICTIONARY_CONSTANT.SSO.Interest.FASHION },
  { code: 'cars', label: DICTIONARY_CONSTANT.SSO.Interest.CARS },
  { code: 'watches', label: DICTIONARY_CONSTANT.SSO.Interest.WATCHES },
  { code: 'jewellery', label: DICTIONARY_CONSTANT.SSO.Interest.JEWELLERY },
  { code: 'sustainability', label: DICTIONARY_CONSTANT.SSO.Interest.SUSTAINABILITY },
  { code: 'destination-travel', label: DICTIONARY_CONSTANT.SSO.Interest.DESTINATION_TRAVEL },
  { code: 'sports-fitness', label: DICTIONARY_CONSTANT.SSO.Interest.SPORT_FITNESS },
  { code: 'beauty', label: DICTIONARY_CONSTANT.SSO.Interest.BEAUTY },
  { code: 'diversity-inclusion', label: DICTIONARY_CONSTANT.SSO.Interest.DIVERSITY_INCLUSION },
  { code: 'restaurants-bars', label: DICTIONARY_CONSTANT.SSO.Interest.RESTAURANTS_BARS },
];

export const AzureB2CProfile = {
  AZURE_AD_B2C_TENANT_NAME: process.env.AZURE_AD_B2C_TENANT_NAME || 'swirehotelsssouat2',
  AZURE_AD_B2C_CLIENT_ID:
    process.env.AZURE_AD_B2C_CLIENT_ID || 'a1933318-ab01-4417-9bd5-b7c5a48ec3de',
  AZURE_AD_B2C_CLIENT_SECRET:
    process.env.AZURE_AD_B2C_CLIENT_SECRET || '',
  AZURE_AD_B2C_PRIMARY_USER_FLOW: 'B2C_1A_EH_EMAIL_SI',
  AZURE_AD_B2C_PHONE_USER_FLOW: 'B2C_1A_EH_PH_SI',
  REGEX_EMAIL: process.env.SSO_EMAIL_REGEX
    ? Buffer.from(process.env.SSO_EMAIL_REGEX, 'base64').toString('utf8')
    : "^[\\w!#$%&'*+/=?^_`{|}~-]+(?:.[w!#$%&'*+/=?^_`{|}~-]+)*@(?:[w](?:[w-]*[w])?.)+[w](?:[w-]*[w])?$",
  REGEX_ENAME: process.env.NEXT_PUBLIC_ENAME_REGEX
    ? Buffer.from(process.env.NEXT_PUBLIC_ENAME_REGEX, 'base64').toString('utf8')
    : "^[A-Za-záéíóúñçÁÉÍÓÚÑÇ '-]+$",
};

export const SabreForm = {
  URL: process.env.SABRE_FORM_URL || 'https://be-i1.synxis.com/',
  SHG_CHAIN_ID: process.env.SABRE_SHG_CHAIN_ID || '28804',
  TEST_HOTEL_ID: process.env.SABRE_TEST_HOTEL_ID || '26885',
};
export const StatusList = [
  { code: 'Reserved', label: 'SSO/Global/Reserved' },
  { code: 'Cancel', label: 'SSO/Global/Cancel-lowercase' },
];

export const Errorlist = [
  { code: 'E000', label: 'SSO/Errors/GeneralError' },
  { code: 'E001', label: 'SSO/Errors/MandatoryFieldError' },
  { code: 'E002', label: 'SSO/Errors/EncryptionError' },
  { code: 'E003', label: 'SSO/Errors/ApiAttributeError' },
  { code: 'E004', label: 'SSO/Errors/UnauthorizedAccess' },
  { code: 'E101', label: 'SSO/Errors/PhoneNumberError' },
  { code: 'E102', label: 'SSO/Errors/EmailError' },
  { code: 'E103', label: 'SSO/Errors/PhoneNumberOtpVerifiedError' },
  { code: 'E104', label: 'SSO/Errors/EmailOtpVerifiedError' },
  { code: 'E200', label: 'SSO/Errors/UserProfileNotFoundError' },
  { code: 'E201', label: 'SSO/Errors/CreateProfileError' },
  { code: 'E202', label: 'SSO/Errors/UpdateProfileError' },
  { code: 'E203', label: 'SSO/Errors/BindEmailExistsError' },
  { code: 'E204', label: 'SSO/Errors/BindPhoneExistsError' },
  { code: 'E205', label: 'SSO/Errors/MismatchOtpChannelError' },
  { code: 'E301', label: 'SSO/Errors/SmsProviderError' },
  { code: 'E302', label: 'SSO/Errors/EmailProviderError' },
  { code: 'E303', label: 'SSO/Errors/Adb2cProviderError' },
  { code: 'E304', label: 'SSO/Errors/SendSmsOtpError' },
  { code: 'E305', label: 'SSO/Errors/SendEmailOtpError' },
  { code: 'E306', label: 'SSO/Errors/OtpRateLimitExceed' },
  { code: 'E307', label: 'SSO/Errors/OtpNotMatch' },
  { code: 'E308', label: 'SSO/Errors/OtpSignatureNotFound' },
  { code: 'E309', label: 'SSO/Errors/MismatchOtpEmailAndRegistrationEmail' },
  { code: 'E310', label: 'SSO/Errors/MismatchOtpPhoneAndRegistrationPhone' },
  { code: 'E311', label: 'SSO/Errors/CreateAdb2cAccountError' },
  { code: 'E313', label: 'SSO/Errors/OTPCodeExpired' },
  { code: 'E401', label: 'SSO/Errors/SabreProfileSyncError' },
  { code: 'E402', label: 'SSO/Errors/SabreLoginTokenError' },
  { code: 'E107', label: 'SSO/Errors/107IdNotFound' }, //Password reset request id not found
  { code: 'E108', label: 'SSO/Errors/108Completed' }, //Password reset request id has been completed
  { code: 'E109', label: 'SSO/Errors/109InvalidLink' }, //Password reset request id is expired
  { code: 'E110', label: 'SSO/Errors/110NonOptedEmail' }, //Unable to set password to non opted email
  { code: 'E316', label: 'SSO/Errors/E316' },
  { code: 'E317', label: 'SSO/Errors/E317' },
];

export const langTxt = {
  en: {
    SLIDE_TIP: 'Please slide to verify',
  },
  cn: {
    SLIDE_TIP: '请向右滑动完成验证',
  },
  tw: {
    SLIDE_TIP: '請向右滑動完成驗證',
  },
};

export interface OtpToken {
  code: string;
  expired: number;
  count?: number;
}

export const generateOtpToken = (oldToken?: string): string => {
  const ttl = process.env.OTP_TOKEN_TTL ? Number(process.env.OTP_TOKEN_TTL) : 5;
  let decryptToken = undefined;
  try {
    if (oldToken) {
      const temp = otpTokenEncryptionService.decrypt(oldToken);
      decryptToken = JSON.parse(temp);
    }
  } catch {}
  const count = decryptToken?.count ?? 1;
  const token: OtpToken = {
    code: randomUUID().toString(),
    expired: Date.now() + ttl * 60 * 1000,
    count: count + 1,
  };
  return otpTokenEncryptionService.encrypt(JSON.stringify(token));
};

export const verifyOtpToken = async (token: string, max = 99): Promise<string> => {
  try {
    const decrypt = otpTokenEncryptionService.decrypt(token);
    if (decrypt) {
      const decryptToken: OtpToken = JSON.parse(decrypt);
      if (decryptToken.code && decryptToken.expired) {
        if (Date.now() > decryptToken.expired) {
          return 'expired';
        }
        const cache = getMemoryCache('otp-token');
        const used = await cache.get(decryptToken.code);
        if (used) {
          return 'used';
        }
        const count = decryptToken?.count ?? 1;
        if (count >= max) {
          return 'exceed';
        }
        return 'ok';
      }
    }
  } catch {}
  return 'fail';
};

export const markOtpTokenUsed = (token: string) => {
  try {
    const decrypt = otpTokenEncryptionService.decrypt(token);
    if (decrypt) {
      const decryptToken: OtpToken = JSON.parse(decrypt);
      if (decryptToken.code && decryptToken.expired) {
        const cache = getMemoryCache('otp-token');
        cache.set(decryptToken.code, '1');
      }
    }
  } catch {}
};

export const getB2CResponseMode = (): string => {
  if (process.env.NEXT_PUBLIC_SSO_RESPONSE_MODE) {
    if (['query', 'form_post', 'fragment'].includes(process.env.NEXT_PUBLIC_SSO_RESPONSE_MODE)) {
      return process.env.NEXT_PUBLIC_SSO_RESPONSE_MODE;
    }
  }
  return 'query';
};

const passwordLenSchema = new PasswordValidator();
passwordLenSchema.is().min(8);
const passwordSchema = new PasswordValidator();
passwordSchema.has().uppercase().has().lowercase().has().digits().has().symbols();

export const verifyPassword = (pwd: string): { lengthMatch: boolean; errors: any[] } => {
  const errors: any[] = [];
  const lengthMatch = !!passwordLenSchema.validate(pwd);

  if (passwordLenSchema.validate(pwd)) {
    errors.push(...(passwordSchema.validate(pwd, { list: true }) as any[]));
  }

  return { lengthMatch, errors };
};
