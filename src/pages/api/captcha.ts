import { NextApiRequest, NextApiResponse } from 'next';
import Captcha20230305, * as $Captcha20230305 from '@alicloud/captcha20230305';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import { generateOtpToken } from '@/utilities/SsoConstant';

const dummyEmailText = 'Hello world {{title}}';

const validateCaptcha = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  let captchaVerifyResult = false;

  let config = new $OpenApi.Config({});
  // 设置您的AccessKey ID 和 AccessKey Secret。
  // getEnvProperty只是个示例方法，需要您自己实现AccessKey ID 和 AccessKey Secret安全的获取方式。
  config.accessKeyId = process.env.ALICLOUD_SVC_ACCESS_KEY_ID;
  config.accessKeySecret = process.env.ALICLOUD_SVC_ACCESS_KEY_SECRET;
  //设置请求地址
  config.endpoint = process.env.CAPTCHA_ENDPOINT;
  // 设置连接超时为5000毫秒
  config.connectTimeout = 5000;
  // 设置读超时为5000毫秒
  config.readTimeout = 5000;
  // ====================== 2. 初始化客户端（实际生产代码中建议复用client） ======================
  let client = new Captcha20230305(config);
  // 创建APi请求
  let request = new $Captcha20230305.VerifyCaptchaRequest({});
  // 前端传来的验证参数 CaptchaVerifyParam
  request.captchaVerifyParam = req.body.captchaVerifyParam;
  // ====================== 3. 发起请求） ======================
  try {
    let captchaResp = await client.verifyCaptcha(request);
    // 建议使用您系统中的日志组件，打印返回
    // 获取验证码验证结果（请注意判空），将结果返回给前端。出现异常建议认为验证通过，优先保证业务可用，然后尽快排查异常原因。
    captchaVerifyResult = captchaResp?.body?.result?.verifyResult!;
  } catch (error) {
    // 建议使用您系统中的日志组件，打印异常
    // 出现异常建议认为验证通过，优先保证业务可用，然后尽快排查异常原因。
    captchaVerifyResult = false;
  }

  return res
    .status(200)
    .send({
      captchaVerifyResult: captchaVerifyResult,
      Token: captchaVerifyResult ? generateOtpToken() : null,
    });
};

export default validateCaptcha;
