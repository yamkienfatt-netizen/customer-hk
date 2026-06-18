import { Field, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { useEffect, useState, JSX } from 'react';
import Typography from '../Typography/Typography';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { useI18n } from 'next-localization';
import { SitecoreLanguageToCaptchaLanguageMapping } from '@/utilities/LanguageUtilities';
import { SsoErrorMessage } from '@/services/SsoApiService';
import { AzureB2CProfile, Errorlist, langTxt } from '@/utilities/SsoConstant';
import captchaLogoImg from 'src/images/1x1.png';

interface ForgetPasswordPageProps {
  fields: Fields;
}
interface Fields {
  Title: Field<string>;
  Detail: Field<string>;
  DetailAfterSend: Field<string>;
  ReSend: Field<string>;
}
const ForgetPasswordPage = (props: ForgetPasswordPageProps): JSX.Element => {
  const { t, locale } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setemail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [sendEmailError, setSendEmailError] = useState('');
  // const emailRegex =
  //   /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/;
  const emailRegex = new RegExp(AzureB2CProfile.REGEX_EMAIL);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (sendEmailError !== '') {
      setSendEmailError('');
    }
    setemail(value);
    if (value.length == 0) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(emailRegex.test(value));
    }
  };

  const sendForgetPassword = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/password/sendResetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: email,
          locale: locale(),
        }),
      });
      setIsLoading(false);
      if (response.status == 200) {
        setEmailSent(true);
      } else {
        const data = (await response.json()) as SsoErrorMessage;
        if (data.ErrorCode) {
          const msg = Errorlist.find((item) => item.code == data.ErrorCode)?.label;
          setSendEmailError(msg ? t(msg) : 'Send Email Failed');
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Error send email:', error);
    }
  };

  //captcha
  const [isCaptchaSuccess, setIsCaptchaSuccess] = useState(false);

  let captcha;

  const getInstance = (instance) => {
    captcha = instance;
  };
  const sceneId = process.env.CAPTCHA_SCENE_ID;
  const prefixId = process.env.CAPTCHA_PREFIX_ID;
  const captchaVerifyCallback = async (captchaVerifyParam: any) => {
    var payload = {
      captchaVerifyParam: captchaVerifyParam,
    };

    const captchaResp = await fetch('/api/captcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (captchaResp.status.toString() === '200') {
      const captchaRespJson = await captchaResp.json();
      return {
        captchaResult: captchaRespJson.captchaVerifyResult,
      };
    } else {
      return {
        captchaResult: false,
      };
    }
  };
  const onBizResultCallback = (resp: boolean) => {
    // Resp either true or false
    if (resp) {
      //Hide captcha and submit directly
      document.getElementById('developmentform-captcha-b')?.remove();
      setIsCaptchaSuccess(true);
    } else {
      //Show error message
      console.log(`Invalid captcha. Please retry`);
    }
  };
  const [aliyunCaptchaLoaded, setAliyunCaptchaLoaded] = useState(false);
  useEffect(() => {
    if (aliyunCaptchaLoaded) {
      const initCaptcha = () => {
        window.initAliyunCaptcha({
          SceneId: sceneId,
          prefix: prefixId,
          mode: 'embed',
          element: '#developmentform-captcha-element',
          button: '#developmentform-captcha-button',
          // captchaVerifyCallback: captchaVerifyCallback,
          // onBizResultCallback: onBizResultCallback,
          success: async (captchaVerifyParam: string) => {
            const result = await captchaVerifyCallback(captchaVerifyParam);
            if (!result?.captchaResult) {
              initCaptcha();
            }
            onBizResultCallback(!!result?.captchaResult);
            return !!result?.captchaResult;
          },
          fail: (error: any) => {
            console.log(error);
          },
          getInstance: getInstance,
          slideStyle: {
            width: 320,
            height: 40,
          },
          language: SitecoreLanguageToCaptchaLanguageMapping[locale()],
          upLang: langTxt,
          immediate: true,
          captchaLogoImg: captchaLogoImg.src,
        });
      };
      initCaptcha();
      return;
    } else {
      const script = document.createElement('script');
      script.id = 'aliyun-captcha';
      script.src = 'https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js';
      document.body.appendChild(script);
      script.onload = () => {
        setAliyunCaptchaLoaded(true);
      };
    }
    return () => {
      document.getElementById('aliyunCaptcha-mask')?.remove();
      document.getElementById('aliyunCaptcha-window-popup')?.remove();
    };
  }, [aliyunCaptchaLoaded]);
  //captcha

  return (
    <>
      {isLoading ? (
        <div id="loading-state">
          <div id="loading"></div>
        </div>
      ) : null}
      <div className="min-h-[50vh]">
        {!emailSent ? (
          <div className="mt-[75px]">
            <div className="mx-4 flex max-w-[420px] flex-col items-center gap-5 pb-32 pt-16 sm:m-auto">
              <Typography variant="sso_title1">
                <Text field={props.fields.Title} />
              </Typography>
              <Typography variant="l2" className="text-center">
                <Text field={props.fields.Detail} />
              </Typography>
              <div className="w-full max-w-[320px] pt-10">
                <Typography variant="sso_track" fontWeight="bold" fontColor="black">
                  {t(DICTIONARY_CONSTANT.SSO.Global.EMAIL)}
                </Typography>
                <input
                  className="mt-5 w-full border-b border-b-[#828077] bg-transparent text-[13px] outline-none"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder={t(DICTIONARY_CONSTANT.SSO.Global.ENTER_EMAIL)}
                />
                {!isEmailValid && (
                  <p className="error mt-1 text-[11px] text-[#D99200]">
                    {t(DICTIONARY_CONSTANT.SSO.Global.EMAIL_FORMAT)}
                  </p>
                )}
                {sendEmailError !== '' && (
                  <p className="error mt-1 text-[11px] text-[#D99200]">{sendEmailError}</p>
                )}
                <div className="sso-captcha mt-5 flex justify-center">
                  <div id="developmentform-captcha-b">
                    <div id="developmentform-captcha-button" className="invisible"></div>
                    <div id="developmentform-captcha-element"></div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={sendForgetPassword}
                  disabled={!isCaptchaSuccess}
                  className="my-5 h-10 w-full bg-green-primary"
                >
                  <Typography
                    variant="sso_btn_text"
                    fontWeight="bold"
                    fontColor={`${isCaptchaSuccess ? 'white' : '#bdbfbe'}`}
                    extraStyles="mt-[5px]"
                  >
                    {t(DICTIONARY_CONSTANT.SSO.Password.SEND)}
                  </Typography>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-[75px]">
            <div className="mx-4 flex max-w-[480px] flex-col items-center gap-5 pb-32 pt-16 sm:m-auto">
              <Typography variant="sso_title1">
                <Text field={props.fields.Title} />
              </Typography>
              <Typography variant="l2" className="text-center">
                <Text field={props.fields.DetailAfterSend} />
              </Typography>
              <a onClick={sendForgetPassword}>
                <Typography variant="sso_track" fontWeight="bold" fontColor="#1d2021" underline>
                  <Text field={props.fields.ReSend} />
                </Typography>
              </a>
              {sendEmailError !== '' && (
                <p className="error mt-1 text-[11px] text-[#D99200]">{sendEmailError}</p>
              )}
              <a onClick={() => setEmailSent(false)}>
                <Typography variant="sso_track" fontWeight="bold" fontColor="#1d2021" underline>
                  {t(DICTIONARY_CONSTANT.SSO.Global.GO_BACK)}
                </Typography>
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default ForgetPasswordPage;
