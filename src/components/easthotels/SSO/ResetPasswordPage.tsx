import { Field, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Typography from '../Typography/Typography';
import { useEffect, useState, JSX } from 'react';
import { useSearchParams } from 'next/navigation';
import { SsoErrorMessage } from '@/services/SsoApiService';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import {
  GetLocaleUrl,
  SitecoreLanguageToAzureB2CLanguageMapping,
} from '@/utilities/LanguageUtilities';
import { Errorlist, SsoApiPaths } from '@/utilities/SsoConstant';

interface ResetPasswordPageProps {
  fields: Fields;
}
interface Fields {
  Title: Field<string>;
  Detail: Field<string>;
  InvalidPageTitle: Field<string>;
}
interface Token {
  AccessToken: string;
  ExpireIn: string;
  IdToken: string;
  TokenType: string;
}
const ResetPasswordPage = (props: ResetPasswordPageProps): JSX.Element => {
  const { t, locale } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [errmsg, setErrmsg] = useState('');
  const [errmsgReset, setErrmsgReset] = useState('');
  const searchParams = useSearchParams();
  const requestId = searchParams.get('request');

  useEffect(() => {
    if (!requestId) {
      //setIsVerified(true);
      //to errorpage
    } else {
      const verifyResetPassword = async () => {
        try {
          setIsLoading(true);
          //
          const response = await fetch('/api/password/verifyResetPassword', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              RequestId: requestId,
            }),
          });
          setIsLoading(false);
          if (response.status == 200) {
            setErrmsg('');
            setIsVerified(true);
          } else {
            const data = (await response.json()) as SsoErrorMessage;

            if (data.ErrorCode) {
              const msg = Errorlist.find((item) => item.code == data.ErrorCode)?.label;
              setErrmsg(msg ? t(msg) : 'Invalid');
            } else {
              setErrmsg('Invalid');
            }
            setIsVerified(false);
          }
        } catch (error) {
          setIsLoading(false);
          console.log('verify-error', error);
          setIsVerified(false);
          setErrmsg('Invalid');
        }
      };
      verifyResetPassword();
    }
  }, [requestId]);

  const [passwordValue, setPasswordValue] = useState('');
  const [passwordConfirmValue, setPasswordConfirmValue] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState(true);
  const [passwordCheck, setPasswordCheck] = useState(true);
  const [passwordConditions, setPasswordConditions] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false,
  });
  const handlePWDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPasswordValue(value);
    const hasMinLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]/.test(value);
    setPasswordConditions({
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
    });
    setPasswordCheck(true);
    if (value.length == 0 || value === passwordConfirmValue) {
      setPasswordConfirm(true);
    } else {
      setPasswordConfirm(false);
    }
  };
  const handlePWDConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPasswordConfirmValue(value);
    if (value.length == 0 || value === passwordValue) {
      setPasswordConfirm(true);
    } else {
      setPasswordConfirm(false);
    }
  };

  const checkPassword = () => {
    if (passwordValue.length == 0) {
      return true;
    } else {
      const conditions = [
        passwordConditions.hasUpperCase,
        passwordConditions.hasLowerCase,
        passwordConditions.hasNumber,
        passwordConditions.hasSpecialChar,
      ];
      const otherConditionsMet = conditions.filter((condition) => condition).length >= 3;
      if (passwordConditions.hasMinLength && otherConditionsMet) {
        return true;
      } else {
        return false;
      }
    }
  };

  const ResetPasswordPageUpdate = async () => {
    setErrmsgReset('');
    if (!checkPassword()) {
      setPasswordCheck(false);
      return;
    }
    if (!passwordConfirm) {
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch('/api/password/resetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Password: passwordValue,
          RequestId: requestId,
        }),
      });
      //setIsLoading(false);
      if (response.status == 200) {
        const data = (await response.json()) as Token;
        if (data.AccessToken && data.IdToken && data.TokenType && data.ExpireIn) {
          setIsLoading(true);
          const link =
            SsoApiPaths.LOGIN_TOKEN +
            `/?access_token=${encodeURIComponent(data.AccessToken)}&token_type=${encodeURIComponent(data.TokenType)}&expires_in=${encodeURIComponent(data.ExpireIn)}&id_token=${encodeURIComponent(data.IdToken)}&ui_locales=${SitecoreLanguageToAzureB2CLanguageMapping[locale()]}&callbackUrl=${GetLocaleUrl(SsoApiPaths.SIGN_IN_CALLBACK, locale())}`;

          location.assign(link);
        }
      } else {
        const data = (await response.json()) as SsoErrorMessage;
        if (data.ErrorCode) {
          const msg = Errorlist.find((item) => item.code == data.ErrorCode)?.label;
          setErrmsgReset(msg ? t(msg) : 'Reset Error');
        } else {
          setErrmsgReset('Reset Error');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    } finally {
    }
  };
  const [pwdHidden, setPwdHidden] = useState(true);
  const [cpwdHidden, setcPwdHidden] = useState(true);

  return (
    <>
      {isLoading ? (
        <div id="loading-state">
          <div id="loading"></div>
        </div>
      ) : null}
      <div className="min-h-[50vh]">
        {isVerified ? (
          <div className="mt-[75px]">
            <div className="mx-4 flex max-w-[480px] flex-col items-center gap-5 pb-32 pt-16 sm:m-auto">
              <Typography variant="sso_title1">
                <Text field={props.fields.Title} />
              </Typography>
              <Typography variant="l2">
                <Text field={props.fields.Detail} />
              </Typography>

              <div className="w-full pt-10">
                <Typography variant="sso_track" fontWeight="bold" fontColor="black">
                  {t(DICTIONARY_CONSTANT.SSO.Password.PASSWORD)}
                </Typography>
                <div className="relative">
                  <input
                    type={pwdHidden ? 'password' : 'text'}
                    className="w-full border-b border-b-[#828077] bg-transparent text-[13px] outline-none"
                    onChange={handlePWDChange}
                    value={passwordValue}
                  />
                  <div
                    onClick={() => setPwdHidden(!pwdHidden)}
                    className={`absolute right-0 top-1 ${pwdHidden ? 'with-eye-crossed' : 'with-eye'}`}
                  ></div>
                </div>
              </div>
              <div className="w-full  text-[11px]">
                <div>{t(DICTIONARY_CONSTANT.SSO.Password.LENGTH_REQUIRE)}</div>

                <div className="mt-1 flex flex-col gap-1">
                  <div className={passwordConditions.hasUpperCase ? 'flex text-[#D99200]' : ''}>
                    <div className={passwordConditions.hasUpperCase ? 'with-checkmark ' : ''}></div>
                    <div className={passwordConditions.hasUpperCase ? ' ' : 'ml-5'}>
                      {t(DICTIONARY_CONSTANT.SSO.Password.UPPERCASE_REQUIRE)}
                    </div>
                  </div>
                  <div className={passwordConditions.hasLowerCase ? 'flex text-[#D99200]' : ''}>
                    <div className={passwordConditions.hasLowerCase ? 'with-checkmark ' : ''}></div>
                    <div className={passwordConditions.hasLowerCase ? '' : 'ml-5'}>
                      {t(DICTIONARY_CONSTANT.SSO.Password.LOWERCASE_REQUIRE)}
                    </div>
                  </div>
                  <div className={passwordConditions.hasNumber ? 'flex text-[#D99200]' : ''}>
                    <div className={passwordConditions.hasNumber ? 'with-checkmark ' : ''}></div>
                    <div className={passwordConditions.hasNumber ? '' : 'ml-5'}>
                      {t(DICTIONARY_CONSTANT.SSO.Password.NUMBER_REQUIRE)}
                    </div>
                  </div>
                  <div className={passwordConditions.hasSpecialChar ? 'flex text-[#D99200]' : ''}>
                    <div
                      className={passwordConditions.hasSpecialChar ? 'with-checkmark ' : ''}
                    ></div>
                    <div className={passwordConditions.hasSpecialChar ? '' : 'ml-5'}>
                      {' '}
                      {t(DICTIONARY_CONSTANT.SSO.Password.SPECIAL_CHARACTER_REQUIRE)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full ">
                <Typography variant="sso_track" fontWeight="bold" fontColor="black">
                  {t(DICTIONARY_CONSTANT.SSO.Password.CONFIRM_PASSWORD)}
                </Typography>
                <div className="relative">
                  <input
                    type={cpwdHidden ? 'password' : 'text'}
                    className="w-full border-b border-b-[#828077] bg-transparent text-[13px] outline-none"
                    onChange={handlePWDConfirmChange}
                    value={passwordConfirmValue}
                  />
                  <div
                    onClick={() => setcPwdHidden(!cpwdHidden)}
                    className={`absolute right-0 top-0 ${cpwdHidden ? 'with-eye-crossed' : 'with-eye'}`}
                  ></div>
                </div>
                {!passwordConfirm && (
                  <p className="error mt-1 pt-2 text-[11px] text-[#D99200]">
                    {t(DICTIONARY_CONSTANT.SSO.Password.PASSWORD_NOT_CORRECT)}
                  </p>
                )}
              </div>
              <button
                onClick={ResetPasswordPageUpdate}
                className="mt-8 h-[47px] w-full bg-[#828077] px-10 py-2 text-white"
              >
                <Typography variant="sso_btn_text">
                  {t(DICTIONARY_CONSTANT.SSO.Password.RESET)}
                </Typography>
              </button>
              {errmsgReset != '' && (
                <p className="error mt-1 pt-2 text-[11px] text-[#D99200]">{errmsgReset}</p>
              )}
              {!passwordCheck && (
                <p className="error mt-1 pt-2 text-[11px] text-[#D99200]">
                  {t(DICTIONARY_CONSTANT.SSO.Password.PWD_WRONG)}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-[75px]">
            <div className="mx-4 flex max-w-[480px] flex-col items-center gap-5 pb-32 pt-16 sm:m-auto">
              <Typography variant="sso_title1">
                <Text field={props.fields.InvalidPageTitle} />
              </Typography>
              <Typography variant="l2">
                <p>{errmsg}</p>
              </Typography>
              <a
                className="mt-5"
                onClick={() => location.assign(GetLocaleUrl(SsoApiPaths.SIGN_IN_PAGE, locale()))}
              >
                <Typography variant="sso_track" underline fontColor="#1d2021" fontWeight="bold">
                  {t(DICTIONARY_CONSTANT.SSO.Password.BACK_TO_LOGIN)}
                </Typography>
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default ResetPasswordPage;
