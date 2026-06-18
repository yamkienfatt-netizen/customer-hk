import nextConfig from 'next.config';

const config = nextConfig();

export const GetApiLink = (apiPath: string): string => {
  if (config.trailingSlash) {
    if (apiPath.indexOf('?') !== -1) {
      const [path, query] = apiPath.split('?', 2);
      apiPath = path;
      if (!apiPath.endsWith('/')) {
        apiPath += '/';
      }
      apiPath += `?${query}`;
    } else if (!apiPath.endsWith('/')) {
      apiPath += '/';
    }
  }
  return apiPath;
};

export const SiteApiPaths: Record<string, string> = {
  CAPTCHA: GetApiLink('/api/captcha'),
  BOOKING_SABRE_LOGIN: GetApiLink('/api/booking/sabreLogin'),
  BOOKING_GET_UPCOMING_BOOKING: GetApiLink('/api/booking/getUpcomingBooking'),
  PASSWORD_RESET_PASSWORD: GetApiLink('/api/password/resetPassword'),
  PASSWORD_SEND_RESET_PASSWORD: GetApiLink('/api/password/sendResetPassword'),
  PASSWORD_SET_PASSWORD: GetApiLink('/api/password/setPassword'),
  PASSWORD_VERIFY_RESET_PASSWORD: GetApiLink('/api/password/verifyResetPassword'),
  PROFILE_GET_PROFILE: GetApiLink('/api/profile/getProfile'),
  PROFILE_LOGGED: GetApiLink('/api/profile/logged'),
  PROFILE_SEND_OTP: GetApiLink('/api/profile/sendOtp'),
  PROFILE_UPDATE_PROFILE: GetApiLink('/api/profile/updateProfile'),
  PROFILE_VERIFY_AND_BIND: GetApiLink('/api/profile/verifyAndBind'),
  REGISTRATION_CREATE_RPOFILE: GetApiLink('/api/registration/createProfile'),
  REGISTRATION_CREATE_RPOFILE_WITH_PWD: GetApiLink('/api/registration/createProfileWithPWD'),
  REGISTRATION_SEND_OTP: GetApiLink('/api/registration/sendOtp'),
  REGISTRATION_VALIDATE: GetApiLink('/api/registration/validate'),
  REGISTRATION_VERIFY_OTP: GetApiLink('/api/registration/verifyOtp'),
  SEND_EMAIL: GetApiLink('/api/sendEmail'),
};
