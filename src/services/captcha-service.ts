import Captcha20230305, * as $Captcha20230305 from '@alicloud/captcha20230305';
import * as $OpenApi from '@alicloud/openapi-client';

export class CaptchaService {
  private client: Captcha20230305;

  constructor(accessKeyId?: string, accessKeySecret?: string, endpoint?: string) {
    const config = new $OpenApi.Config({
      accessKeyId: accessKeyId,
      accessKeySecret: accessKeySecret,
      endpoint: endpoint,
      connectTimeout: 5000,
      readTimeout: 5000,
    });
    this.client = new Captcha20230305(config);
  }

  async verifyResult(captchaVerifyParam: string): Promise<boolean> {
    let captchaVerifyResult;
    try {
      console.log('captchaVerifyParam', captchaVerifyParam);
      const request = new $Captcha20230305.VerifyCaptchaRequest({
        captchaVerifyParam: captchaVerifyParam,
      });
      const captchaResp = await this.client.verifyCaptcha(request);
      console.log('captchaResp', captchaResp);
      captchaVerifyResult = captchaResp?.body?.result?.verifyResult ?? false;
    } catch (error) {
      console.error(error);
      captchaVerifyResult = false;
    }

    return captchaVerifyResult;
  }
}
export const captchaService = new CaptchaService(
  process.env.ALICLOUD_SVC_ACCESS_KEY_ID,
  process.env.ALICLOUD_SVC_ACCESS_KEY_SECRET,
  process.env.CAPTCHA_ENDPOINT
);
