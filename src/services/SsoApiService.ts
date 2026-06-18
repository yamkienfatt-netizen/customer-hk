import { NativeDataFetcher } from '@sitecore-jss/sitecore-jss-nextjs';
import { ssoEncryptionService, SsoEncryptionService } from './SsoEncryptionService';
import { SsoApiPaths } from '@/utilities/SsoConstant';
import { NextApiRequest } from 'next';
import { loggers, maskProperties } from './logging-service';

export const propertiesToMask = [
  'FirstName',
  'LastName',
  'Email',
  'MobilePhoneNumber',
  'Password',
  'EmailAddress',
];

export const getClientIp = (req: NextApiRequest): string | undefined => {
  const clientIps = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  let ipString = '';
  if (clientIps) {
    if (Array.isArray(clientIps)) {
      ipString = clientIps[0];
    } else {
      ipString = clientIps;
    }
    if (ipString) {
      return ipString.split(',')[0].trim();
    }
  }
  return undefined;
};

export interface SsoApiServiceConfig {
  ApiHost: string;
  ApiKey: string;
}

export interface SsoErrorMessage {
  ErrorCode?: string;
  ErrorMessage?: string;
  ErrorDescription?: string;
}
export interface SsoToken extends SsoUserProfile {
  Id?: string;
  Token?: {
    AccessToken?: string;
    ExpireIn?: number;
    IdToken?: string;
    TokenType?: string;
  };
}

export interface ResetPWD {
  //Email: string;
  Password: string;
  RequestId: string;
}
export interface SsoMemberId {
  Id?: string;
}

export interface ResetPWD {
  Password: string;
  RequestId: string;
}

export interface OTP {
  Signature: string;
  UserInputCode: string;
}

export interface SsoUserProfile {
  Salutation: string;
  FirstName: string;
  LastName: string;
  Email: string;
  MobileCountry: string;
  MobilePhoneNumber: string;
  Interests: {
    ArtAndDesign: boolean;
    Music: boolean;
    Wellness: boolean;
    Fashion: boolean;
    Cars: boolean;
    Watches: boolean;
    Jewellery: boolean;
    Sustainability: boolean;
    DestinationTravel: boolean;
    SportsAndFitness: boolean;
    Beauty: boolean;
    DiversityAndInclusion: boolean;
    RestaurantsAndBars: boolean;
  };
  MarketingOptIn: boolean;
  DataManageOutsideResidence: boolean;
  DataManageWithinResidence: boolean;
  RegisterSourceSystem: string;
  OTPs: OTP[];
}
export interface SsoUserProfileWithPWD extends SsoUserProfile {
  Password: string;
}

export interface SsoUpdateProfile {
  Salutation: string;
  FirstName: string;
  LastName: string;
  Interests: {
    ArtAndDesign: boolean;
    Music: boolean;
    Wellness: boolean;
    Fashion: boolean;
    Cars: boolean;
    Watches: boolean;
    Jewellery: boolean;
    Sustainability: boolean;
    DestinationTravel: boolean;
    SportsAndFitness: boolean;
    Beauty: boolean;
    DiversityAndInclusion: boolean;
    RestaurantsAndBars: boolean;
  };
  MarketingOptIn: boolean;
  //DataManageOutsideResidence: boolean;
  //DataManageWithinResidence: boolean;
}

export interface SsoPayloadMessage {
  Payload?: string;
}

export interface SsoSendOtpResponse {
  Signature: string;
}

export type SsoApiRequest = SsoPayloadMessage;

export type SsoApiResponse = SsoPayloadMessage & SsoErrorMessage;

export class SsoApiService {
  encryptionService: SsoEncryptionService;
  serviceConfig: SsoApiServiceConfig;
  dataFetcher: NativeDataFetcher;

  constructor(encryptionService: SsoEncryptionService, serviceConfig: SsoApiServiceConfig) {
    this.encryptionService = encryptionService;
    this.serviceConfig = serviceConfig;
    this.dataFetcher = new NativeDataFetcher();
  }

  getProfile(token: string, clientIp?: string): Promise<SsoApiResponse> {
    return this.sendGet(SsoApiPaths.PROFILE, token, clientIp).then((response) => {
      const obj: SsoApiResponse = response.data;
      if (obj?.Payload) {
        return this.parseResponsePayload(obj.Payload);
      }
      return obj;
    });
  }
  getProfileV2(token: string, clientIp?: string): Promise<SsoApiResponse> {
    return this.sendGet(SsoApiPaths.PROFILE_WITH_PWD, token, clientIp).then((response) => {
      const obj: SsoApiResponse = response.data;
      if (obj?.Payload) {
        return this.parseResponsePayload(obj.Payload);
      }
      return obj;
    });
  }

  updateProfile(
    userProfile: SsoUpdateProfile,
    token: string,
    clientIp?: string
  ): Promise<SsoApiResponse> {
    return this.sendPost(SsoApiPaths.PROFILE, userProfile, token, clientIp).then((response) => {
      const obj: SsoApiResponse = response.data;
      if (obj?.Payload) {
        return this.parseResponsePayload(obj.Payload);
      }
      return obj;
    });
  }

  sabreLogin(token: string, clientIp?: string): Promise<SsoApiResponse> {
    return this.sendGet(SsoApiPaths.LOGIN_SABRE, token, clientIp).then((response) => {
      const obj: SsoApiResponse = response.data;
      if (obj?.Payload) {
        return this.parseResponsePayload(obj.Payload);
      }
      return obj;
    });
  }

  sabreLoginRefresh(token: string, clientIp?: string): Promise<SsoApiResponse> {
    return this.sendGet(SsoApiPaths.LOGIN_SABRE_REFRESH, token, clientIp).then((response) => {
      const obj: SsoApiResponse = response.data;
      if (obj?.Payload) {
        return this.parseResponsePayload(obj.Payload);
      }
      return obj;
    });
  }

  refreshSabreToken(token: string, clientIp?: string): Promise<SsoApiResponse> {
    return this.sendGet(SsoApiPaths.REFRESH_SABRE_TOKEN, token, clientIp).then((response) => {
      const obj: SsoApiResponse = response.data;
      if (obj?.Payload) {
        return this.parseResponsePayload(obj.Payload);
      }
      return obj;
    });
  }

  getUpcomingBookings(token: string, clientIp?: string): Promise<SsoApiResponse> {
    return this.sendGet(SsoApiPaths.PROFILE_GET_UPCOMING_BOOKINGS, token, clientIp).then(
      (response) => {
        const obj: SsoApiResponse = response.data;
        if (obj?.Payload) {
          return this.parseResponsePayload(obj.Payload);
        }
        return obj;
      }
    );
  }

  verifyAndBindPhone(
    signature: string,
    userInputCode: string,
    token: string,
    clientIp?: string
  ): Promise<SsoApiResponse> {
    const data = {
      Signature: signature,
      UserInputCode: userInputCode,
    };
    return this.sendPost(SsoApiPaths.PROFILE_VERIFY_AND_BIND_PHONE, data, token, clientIp).then(
      (response) => {
        const obj: SsoApiResponse = response.data;
        if (obj?.Payload) {
          return this.parseResponsePayload(obj.Payload);
        }
        return obj;
      }
    );
  }

  verifyAndBindEmail(
    signature: string,
    userInputCode: string,
    token: string,
    clientIp?: string
  ): Promise<SsoApiResponse> {
    const data = {
      Signature: signature,
      UserInputCode: userInputCode,
    };
    return this.sendPost(SsoApiPaths.PROFILE_ERIFY_AND_BIND_EMAIL, data, token, clientIp).then(
      (response) => {
        const obj: SsoApiResponse = response.data;
        if (obj?.Payload) {
          return this.parseResponsePayload(obj.Payload);
        }
        return obj;
      }
    );
  }

  createProfile(userProfile: SsoUserProfile, clientIp?: string): Promise<SsoApiResponse> {
    return this.sendPut(SsoApiPaths.PROFILE, userProfile, undefined, clientIp).then((response) => {
      const obj: SsoApiResponse = response.data;
      if (obj?.Payload) {
        return this.parseResponsePayload(obj.Payload);
      }
      return obj;
    });
  }
  createProfileWithPWD(
    userProfile: SsoUserProfileWithPWD,
    clientIp?: string
  ): Promise<SsoApiResponse> {
    return this.sendPut(SsoApiPaths.PROFILE_WITH_PWD, userProfile, undefined, clientIp).then(
      (response) => {
        const obj: SsoApiResponse = response.data;
        if (obj?.Payload) {
          return this.parseResponsePayload(obj.Payload);
        }
        return obj;
      }
    );
  }

  sendResetPassword(
    email: { Email: string; locale: string },
    clientIp?: string
  ): Promise<SsoApiResponse> {
    if (email.locale.toLocaleLowerCase() == 'zh-hk') {
      email.locale = 'tc';
    } else if (email.locale.toLocaleLowerCase() == 'zh-cn') {
      email.locale = 'sc';
    }
    return this.sendPost(
      SsoApiPaths.SEND_RESET_PWD.replace('/en/', `/${email.locale}/`),
      email,
      undefined,
      clientIp
    ).then((response) => {
      const obj: SsoApiResponse = response.data;
      if (obj?.Payload) {
        return this.parseResponsePayload(obj.Payload);
      }
      return obj;
    });
  }

  verifyResetPassword(id: string, clientIp?: string): Promise<SsoApiResponse> {
    return this.sendGet(SsoApiPaths.VERIFY_RESET_PWD + '/' + id, undefined, clientIp).then(
      (response) => {
        const obj: SsoApiResponse = response.data;
        if (obj?.Payload) {
          return this.parseResponsePayload(obj.Payload);
        }
        return obj;
      }
    );
  }

  resetPassword(data: ResetPWD, clientIp?: string): Promise<SsoApiResponse> {
    return this.sendPost(SsoApiPaths.RESET_PWD, data, undefined, clientIp).then((response) => {
      const obj: SsoApiResponse = response.data;
      if (obj?.Payload) {
        return this.parseResponsePayload(obj.Payload);
      }
      return obj;
    });
  }

  setPassword(
    password: { Password: string },
    token: string,
    clientIp?: string
  ): Promise<SsoApiResponse> {
    return this.sendPost(SsoApiPaths.SET_PWD, password, token, clientIp).then((response) => {
      const obj: SsoApiResponse = response.data;
      if (obj?.Payload) {
        return this.parseResponsePayload(obj.Payload);
      }
      return obj;
    });
  }

  verifyOTP(
    signature: string,
    userInputCode: string,
    clientIp?: string
  ): Promise<SsoApiResponse | SsoSendOtpResponse> {
    const data = {
      Signature: signature,
      UserInputCode: userInputCode,
    };
    return this.sendPost(SsoApiPaths.OTP_VERIFY_CODE, data, undefined, clientIp).then(
      (response) => {
        const obj: SsoApiResponse = response.data;
        if (obj?.Payload) {
          return this.parseResponsePayload<SsoSendOtpResponse>(obj.Payload);
        }
        return obj;
      }
    );
  }

  sendEmailOtp(
    email: string,
    locale: string,
    token?: string,
    clientIp?: string
  ): Promise<SsoApiResponse | SsoSendOtpResponse> {
    const data = {
      EmailAddress: email,
    };
    if (locale.toLocaleLowerCase() == 'zh-hk') {
      locale = 'tc';
    } else if (locale.toLocaleLowerCase() == 'zh-cn') {
      locale = 'sc';
    }
    return this.sendPost(
      SsoApiPaths.OTP_SEND_EMAIL.replace('/en/', `/${locale}/`),
      data,
      token,
      clientIp
    ).then((response) => {
      const obj: SsoApiResponse = response.data;
      if (obj?.Payload) {
        return this.parseResponsePayload<SsoSendOtpResponse>(obj.Payload);
      }
      return obj;
    });
  }

  sendSmsOtp(
    mobileCountry: string,
    mobilePhoneNumber: string,
    locale: string,
    token?: string,
    clientIp?: string
  ): Promise<SsoApiResponse | unknown> {
    const data = {
      MobileCountry: mobileCountry,
      MobilePhoneNumber: mobilePhoneNumber,
    };
    if (locale.toLocaleLowerCase() == 'zh-hk') {
      locale = 'tc';
    } else if (locale.toLocaleLowerCase() == 'zh-cn') {
      locale = 'sc';
    }
    return this.sendPost(
      SsoApiPaths.OTP_SEND_SMS.replace('/en/', `/${locale}/`),
      data,
      token,
      clientIp
    ).then((response) => {
      const obj: SsoApiResponse = response.data;
      if (obj?.Payload) {
        return this.parseResponsePayload(obj.Payload);
      }
      return obj;
    });
  }

  validatePhoneNumber(mobileCountry: string, mobilePhoneNumber: string, clientIp?: string) {
    const data = {
      MobileCountry: mobileCountry,
      MobilePhoneNumber: mobilePhoneNumber,
    };

    return this.sendPost(SsoApiPaths.VALIDATE_PHONE_NUMBER, data, undefined, clientIp).then(
      (response) => {
        const obj: SsoApiResponse = response.data;
        if (obj?.Payload) {
          return this.parseResponsePayload(obj.Payload);
        }
        return obj;
      }
    );
  }
  validateEmail(email: string, clientIp?: string) {
    const data = {
      Email: email,
    };

    return this.sendPost(SsoApiPaths.VALIDATE_EMAIL, data, undefined, clientIp).then((response) => {
      const obj: SsoApiResponse = response.data;
      if (obj?.Payload) {
        return this.parseResponsePayload(obj.Payload);
      }
      return obj;
    });
  }
  sendGet(urlPath: string, token?: string, clientIp?: string) {
    let response_data = {};
    let api_response_status: number | null;
    const startTime = process.hrtime();
    return this.dataFetcher
      .get<SsoApiResponse>(this._prepareApiUrl(urlPath), this._prepareAuthConfig(token, clientIp))
      .then((data) => {
        api_response_status = data.status;
        response_data = data.data || {};
        return data;
      })
      .catch((e) => {
        if (e.response?.data) {
          e.response.data = this._parseResponse(e.response.data);
        }
        api_response_status = e.response?.status;
        response_data = e.response?.data || {};
        throw e;
      })
      .finally(() => {
        const totalTime = process.hrtime(startTime);
        const totalTimeInMs = totalTime[0] * 1000 + totalTime[1] / 1e6;
        loggers.sso().info('sendGet', {
          api_response_status,
          api_request_method: 'GET',
          api_request_url: urlPath,
          clientIp,
          api_response_data: response_data,
          api_request_time_msec: totalTimeInMs,
        });
      });
  }

  sendPost(urlPath: string, data: object, token?: string, clientIp?: string) {
    let response_data = {};
    let api_response_status: number | null;
    const startTime = process.hrtime();
    const payload = this.prepareRequestPayload(data);
    return this.dataFetcher
      .post(this._prepareApiUrl(urlPath), payload, this._prepareAuthConfig(token, clientIp))
      .then((data) => {
        api_response_status = data.status;
        response_data = data.data || {};
        return data;
      })
      .catch((e) => {
        if (e.response?.data) {
          e.response.data = this._parseResponse(e.response.data);
        }
        api_response_status = e.response?.status;
        response_data = e.response?.data || {};
        throw e;
      })
      .finally(() => {
        const totalTime = process.hrtime(startTime);
        const totalTimeInMs = totalTime[0] * 1000 + totalTime[1] / 1e6;
        loggers.sso().info('sendPost', {
          api_request_body: maskProperties(Object.assign({}, data || {}), propertiesToMask),
          api_response_status,
          api_request_method: 'POST',
          api_request_url: urlPath,
          api_request_payload: payload,
          clientIp,
          api_response_data: response_data,
          api_request_time_msec: totalTimeInMs,
        });
      });
  }

  sendPut(urlPath: string, data: object, token?: string, clientIp?: string) {
    let response_data = {};
    let api_response_status: number | null;
    const startTime = process.hrtime();
    const payload = this.prepareRequestPayload(data);
    return this.dataFetcher
      .put(this._prepareApiUrl(urlPath), payload, this._prepareAuthConfig(token, clientIp))
      .then((data) => {
        api_response_status = data.status;
        response_data = data.data || {};
        return data;
      })
      .catch((e) => {
        if (e.response?.data) {
          e.response.data = this._parseResponse(e.response.data);
        }
        api_response_status = e.response?.status;
        response_data = e.response?.data || {};
        throw e;
      })
      .finally(() => {
        const totalTime = process.hrtime(startTime);
        const totalTimeInMs = totalTime[0] * 1000 + totalTime[1] / 1e6;
        loggers.sso().info('sendPut', {
          api_request_body: maskProperties(Object.assign({}, data || {}), propertiesToMask),
          api_response_status,
          api_request_method: 'PUT',
          api_request_url: urlPath,
          api_request_payload: payload,
          clientIp,
          api_response_data: response_data,
          api_request_time_msec: totalTimeInMs,
        });
      });
  }

  prepareRequestPayload(data: object): SsoApiRequest {
    const payload = JSON.stringify(data);
    const req: SsoApiRequest = { Payload: this.encryptionService.encrypt(payload) };
    return req;
  }

  parseResponsePayload<T>(encrypted: string): T {
    const data = this.encryptionService.decrypt(encrypted);
    const obj: T = JSON.parse(data);
    return obj;
  }

  _prepareAuthConfig(token?: string, clientIp?: string) {
    let hasHeaders = false;
    const headers: Record<string, string> = { 'api-key': this.serviceConfig.ApiKey };

    if (token) {
      hasHeaders = true;
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (clientIp) {
      hasHeaders = true;
      headers['x-forwarded-ip'] = clientIp;
    }
    return hasHeaders ? { headers: headers } : undefined;
  }

  _prepareApiUrl(urlPath: string) {
    return `${this.serviceConfig.ApiHost}${urlPath.startsWith('/') ? '' : '/'}${urlPath}`;
  }

  _parseResponse(data: string | undefined | object) {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {}
    }
    return data;
  }
}

export const ssoApiService = new SsoApiService(ssoEncryptionService, {
  ApiKey: process.env.SHG_SSO_API_KEY ?? '',
  ApiHost: process.env.SHG_SSO_API_HOST ?? '',
});
