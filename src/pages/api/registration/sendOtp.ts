import { captchaService } from '@/services/captcha-service';
import { hashMD5, loggers } from '@/services/logging-service';
import { getClientIp, ssoApiService } from '@/services/SsoApiService';
import { generateOtpToken, markOtpTokenUsed, verifyOtpToken } from '@/utilities/SsoConstant';
import { randomUUID } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';

interface SendOtpRequest extends NextApiRequest {
  body: {
    Channel: string;
    MobileCountry: string;
    MobilePhoneNumber: string;
    Email: string;
    Locale: string;
    Token: string;
    captchaVerifyParam: string;
  };
}

const sendOTPApi = async (
  req: SendOtpRequest,
  res: NextApiResponse
): Promise<NextApiResponse | void> => {
  const requestId = randomUUID();
  loggers.sso().info(`sendOtp|${requestId}|START`, {
    requestId,
    requset_url: req.url,
    requset_method: req.method,
    requset_body: {
      ...req.body,
      MobilePhoneNumber: hashMD5(req.body?.MobilePhoneNumber),
      Email: hashMD5(req.body?.Email),
    },
  });
  if (req.method !== 'POST') {
    loggers.sso().warn(`sendOtp|${requestId}|405|Method Not Allowed`, {
      requestId,
      response_code: 405,
    });
    return res.status(405).end(); // Method Not Allowed
  }
  const startTime = process.hrtime();
  let otpToken: string | undefined = req.body?.Token;
  try {
    //const session = (await getServerSession(req, res, authOptions)) as ExtendedSession;
    //const token = session?.user?.access_token ?? undefined;
    const captchaResp = await captchaService.verifyResult(req.body?.captchaVerifyParam);
    loggers.sso().info(`sendOtp|${requestId}|Captcha Verification Result`, {
      requestId,
      captcha_response: captchaResp,
    });
    if (captchaResp) {
      // Issue a new OTP Token if captcha verification passed
      otpToken = generateOtpToken();
    } else {
      otpToken = undefined;
    }

    const maxRetry = process.env.OTP_MAX_RETRY ? Number(process.env.OTP_MAX_RETRY) : 99;
    if (!otpToken) {
      loggers.sso().warn(`sendOtp|${requestId}|400|Missing Token`, {
        requestId,
        response_code: 400,
        response_data: { error: 'missing-token' },
      });
      return res.status(400).send({ error: 'missing-token' });
    }
    const verifyResp = await verifyOtpToken(otpToken, maxRetry);
    if (verifyResp !== 'ok') {
      if (verifyResp == 'exceed') {
        loggers.sso().warn(`sendOtp|${requestId}|400|OtpRateLimitExceed`, { requestId });
        return res.status(400).send({ ErrorCode: 'E306' });
      }
      loggers.sso().info(`sendOtp|${requestId}|400|${verifyResp}-token`, {
        requestId,
        response_code: 400,
        response_data: { error: `${verifyResp}-token` },
      });
      return res.status(400).send({ error: `${verifyResp}-token` });
    }
    markOtpTokenUsed(otpToken);

    if (req.body?.Channel == 'email') {
      const resp = await ssoApiService.sendEmailOtp(
        req.body.Email,
        req.body.Locale,
        undefined,
        getClientIp(req)
      );
      const totalTime = process.hrtime(startTime);
      const totalTimeInMs = totalTime[0] * 1000 + totalTime[1] / 1e6;

      console.log(`sendEmailOtp`, resp);
      markOtpTokenUsed(otpToken);
      loggers.sso().info(`sendOtp|${requestId}|200|Response`, {
        requestId,
        api_request_time_msec: totalTimeInMs,
        response_code: 200,
        response_data: resp,
      });
      return res
        .status(200)
        .send(Object.assign({}, resp, { Token: generateOtpToken(otpToken) }));
    } else if (0 && req.body?.Channel == 'phone' && !(process.env.SSO_REG_DISABLE_MOBILE === 'true')) {
      const resp = await ssoApiService.sendSmsOtp(
        req.body.MobileCountry,
        req.body.MobilePhoneNumber,
        req.body.Locale,
        undefined,
        getClientIp(req)
      );
      const totalTime = process.hrtime(startTime);
      const totalTimeInMs = totalTime[0] * 1000 + totalTime[1] / 1e6;

      console.log(`sendSmsOtp`, resp);
      markOtpTokenUsed(otpToken);
      loggers.sso().info(`sendOtp|${requestId}|200|Response`, {
        requestId,
        api_request_time_msec: totalTimeInMs,
        response_code: 200,
        response_data: resp,
      });
      return res
        .status(200)
        .send(Object.assign({}, resp, { Token: generateOtpToken(otpToken) }));
    }
  } catch (e: any) {
    console.log(`sendSmsOtp ERROR`, e);
    const totalTime = process.hrtime(startTime);
    const totalTimeInMs = totalTime[0] * 1000 + totalTime[1] / 1e6;
    if (e?.response?.data) {
      if (
        //hide the error about email and phone number has been used or verified
        e.response.data.ErrorCode == 'E101' ||
        e.response.data.ErrorCode == 'E102' ||
        e.response.data.ErrorCode == 'E103' ||
        e.response.data.ErrorCode == 'E104'
      ) {
        markOtpTokenUsed(otpToken);
        loggers.sso().error(`sendOtp|${requestId}|200|Response`, {
          requestId,
          api_request_time_msec: totalTimeInMs,
          api_response_data: e.response.data,
        });
        return res.status(200).send(Object.assign({ Token: generateOtpToken(otpToken) }));
      }
      loggers.sso().error(`sendOtp|${requestId}|${e.response.status}|Response`, {
        requestId,
        api_request_time_msec: totalTimeInMs,
        api_response_data: e.response.data,
      });
      return res
        .status(e.response.status)
        .send(Object.assign({}, e.response.data, { Token: generateOtpToken(otpToken) }));
    }
  }
  loggers.sso().warn(`sendOtp|${requestId}|400|Unhandled Request`, { requestId });
  return res.status(400).send({});
};

export default sendOTPApi;
