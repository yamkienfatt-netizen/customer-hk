'use client';

import React, { useState, useEffect, useRef, JSX } from 'react';
import {
  Field,
  Image,
  ImageField,
  Image as JssImage,
  RichText,
  Text,
} from '@sitecore-jss/sitecore-jss-nextjs';
import WelcomePage from './WelcomePage';
import CodeInput from './CodeInput';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import {
  MobileAreaCode,
  SalesforceTitles,
  //PrivacyPolicyChecklist,
  InterestChecklist,
  SsoApiPaths,
  Errorlist,
  ConsentList,
  langTxt,
  AzureB2CProfile,
} from '@/utilities/SsoConstant';
import {
  SsoUserProfile,
  SsoErrorMessage,
  OTP,
  SsoUserProfileWithPWD,
  SsoToken,
} from '@/services/SsoApiService';
import { signIn } from 'next-auth/react';
import {
  GetLocaleUrl,
  SitecoreLanguageToAzureB2CLanguageMapping,
  SitecoreLanguageToCaptchaLanguageMapping,
} from '@/utilities/LanguageUtilities';
import Typography from '../Typography/Typography';
import { sendGTMEvent } from '@next/third-parties/google';
import captchaLogoImg from 'src/images/1x1.png';

interface Fields {
  RegistrationTitle: Field<string>;
  RegistrationDescription: Field<string>;
  LoginTitle: Field<string>;
  LoginDescription: Field<string>;
  Image: ImageField;
  DetailTitle: Field<string>;
  DetailDescription: Field<string>;
  List1: Field<string>;
  List2: Field<string>;
  List3: Field<string>;
  List4: Field<string>;
  WelcomeItem: WelcomePageProps;
  Icon1: ImageField;
  Icon2: ImageField;
  Icon3: ImageField;
  Icon4: ImageField;
  AccordionTitle: Field<string>;
  AccordionContent: Field<string>;
  AccordionContentForPhone: Field<string>;
}

interface WelcomePageProps {
  fields: Welcome;
}
interface Welcome {
  Heading: Field<string>;
  Title: Field<string>;
  Subtitle: Field<string>;
  Description: Field<string>;
  Image: ImageField;
  RedirectTime: Field<string>;
}

interface RegistrationPageProps {
  fields: Fields;
}

interface sentSmsOtp {
  Signature: string;
}

const RegistrationPage = (props: RegistrationPageProps): JSX.Element => {
  const [title, setTitle] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [firstnameValid, setFirstnameValid] = useState(true);
  const [lastnameValid, setLastnameValid] = useState(true);
  const [email, setemail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [phoneAreaCode, setPhoneAreaCode] = useState('852');
  const [phoneNum, setphoneNum] = useState('');
  const [maskEmail, setMaskEmail] = useState('');
  const [maskPhoneNum, setMaskPhoneNum] = useState('');
  const [otpcode, setOtpcode] = useState('');
  const [signature, setSignature] = useState('');
  const { t, locale } = useI18n();
  const [step, setStep] = useState('1');
  const [isEmail, setIsEmail] = useState(true);
  const [validate, setValidate] = useState(false);
  const [NotOtpComplete, setOtpComplete] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errOtp, setErrOtp] = useState('');
  const [acceptAllPolicy, setAcceptAllPolicy] = useState(true);
  const [err_step1forEmail, setErrStep1forEmail] = useState('');
  const [err_step1forPhone, setErrStep1forPhone] = useState('');
  const [createProfileErrMsg, setCreateProfileErrMsg] = useState('');
  const [createProfileErr, setCreateProfileErr] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [phoneErr, setPhoneErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [isSelectInterset, setIsSelectInterest] = useState(true);
  const [isSelectMore, setIsSelectMore] = useState(false);
  const [selectAllPolicy, setSelectAllPolicy] = useState(false);
  const [otpCount, setOtpCount] = useState(0);
  const [otpResponse, setOtpResponse] = useState(false);
  const [isOpenPWD, setIsOpenPWD] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [passwordConfirmValue, setPasswordConfirmValue] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState(true);
  const [passwordConditions, setPasswordConditions] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false,
  });
  const [passwordCheck, setPasswordCheck] = useState(true);
  const [membershipId, setMembershipId] = useState('');
  const enableMobileReg = !(process.env.SSO_REG_DISABLE_MOBILE === 'true');
  const [otpToken, SetOtpToken] = useState('');
  const sendOtpRef = useRef<(captchaVerifyParam: string) => Promise<void>>(
    () => new Promise<void>((resolve) => resolve())
  );
  const captchaBtnRef = useRef<HTMLDivElement>(null);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhoneNumValid, setIsPhoneNumValid] = useState(true);
  const [isConfirmEmailValid, setIsConfirmEmailValid] = useState(true);

  const sendOtp = async (captchaVerifyParam: string) => {
    await sendOtpRef.current(captchaVerifyParam);
  };
  const continueToOtp = () => {
    setOtpCount(0);
    setErrOtp('');
    setErrStep1forEmail('');
    setErrStep1forPhone('');
    let eml = (document.querySelector('#EmailInput') as HTMLInputElement).value.trim();
    let mobile = (document.querySelector('#PhoneNumber') as HTMLInputElement).value.trim();
    setValidate(true);
    if (isEmail && !isEmailValid) {
      return;
    } else if (!isEmail && !isPhoneNumValid) {
      return;
    }
    if (isEmail && eml == '') {
      return;
    } else if (!isEmail && mobile == '') {
      return;
    }
    captchaBtnRef.current?.click();
  };

  useEffect(() => {
    sendOtpRef.current = async (captchaVerifyParam: string) => {
      let eml = (document.querySelector('#EmailInput') as HTMLInputElement).value.trim();
      let mobile = (document.querySelector('#PhoneNumber') as HTMLInputElement).value.trim();
      setValidate(false);
      setemail(eml);
      setphoneNum(mobile);
      if (isEmail) {
        let emlArr = eml.split('@');
        let maskEml = '';
        if (emlArr[0].length > 7) {
          for (let i = 0; i < emlArr[0].length - 3; i++) {
            maskEml += '*';
          }
          maskEml = maskEml + emlArr[0].slice(-3) + '@' + emlArr[1];
        } else if (emlArr[0].length > 2) {
          for (let i = 0; i < emlArr[0].length - 1; i++) {
            maskEml += '*';
          }
          maskEml = maskEml + emlArr[0].slice(-1) + '@' + emlArr[1];
        } else {
          for (let i = 0; i < emlArr[0].length; i++) {
            maskEml += '*';
          }
          maskEml = maskEml + '@' + emlArr[1];
        }

        setMaskEmail(maskEml);
      } else if (!isEmail && mobile.length > 4) {
        let maskPhoneNum =
          mobile.substring(0, mobile.length - 4).replace(/[0-9]/g, '*') + mobile.slice(-4);
        setMaskPhoneNum(maskPhoneNum);
      }

      const databody = isEmail
        ? {
            Channel: 'email',
            Email: eml,
            Locale: locale(),
            Token: otpToken,
            captchaVerifyParam,
          }
        : {
            Channel: 'phone',
            MobileCountry: (document.querySelector('#MobileCountry') as HTMLSelectElement).value,
            MobilePhoneNumber: mobile,
            Locale: locale(),
            Token: otpToken,
            captchaVerifyParam,
          };

      const err_msg = t(DICTIONARY_CONSTANT.SSO.Global.INVALID_API);
      try {
        setIsLoading(true);
        const apiPath =
          databody.Channel === 'phone'
            ? '/api/registration/sendMobileOtp'
            : '/api/registration/sendOtp';
        const response = await fetch(apiPath, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(databody),
        });
        setIsLoading(false);
        if (response.status == 200) {
          const data = (await response.json()) as sentSmsOtp & { Token: string };
          //console.debug(data.Signature);
          setSignature(data.Signature);
          if (data.Token) {
            SetOtpToken(data.Token);
          }
        } else {
          if (isEmail) {
            const data = (await response.json()) as SsoErrorMessage & { Token: string };
            if (data.Token) {
              SetOtpToken(data.Token);
            }
            if (data.ErrorCode) {
              if (data.ErrorCode === 'E314') {
                //for captcha error
                data.ErrorCode = 'E000';
              }
              const msg = Errorlist.find((item) => item.code == data.ErrorCode)?.label;
              if (msg != undefined) {
                setErrStep1forEmail(t(msg));
              } else {
                if (data.ErrorMessage) setErrStep1forEmail(data.ErrorMessage);
                else setErrStep1forEmail(err_msg);
              }
            } else {
              if (data.ErrorMessage) setErrStep1forEmail(data.ErrorMessage);
              else setErrStep1forEmail(err_msg);
            }
          } else {
            const data = (await response.json()) as SsoErrorMessage & { Token: string };
            if (data.Token) {
              SetOtpToken(data.Token);
            }
            if (data.ErrorCode) {
              const msg = Errorlist.find((item) => item.code == data.ErrorCode)?.label;
              if (msg != undefined) {
                setErrStep1forPhone(t(msg));
              } else {
                if (data.ErrorMessage) setErrStep1forPhone(data.ErrorMessage);
                else setErrStep1forPhone(err_msg);
              }
            } else {
              if (data.ErrorMessage) setErrStep1forPhone(data.ErrorMessage);
              else setErrStep1forPhone(err_msg);
            }
          }
          return;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        isEmail
          ? setErrStep1forEmail(t('SSO/Errors/GeneralError'))
          : setErrStep1forPhone(t('SSO/Errors/GeneralError'));
        return;
      } finally {
        setIsLoading(false);
      }
      setSeconds(60);
      setIsActive(true);
      setStep('2');
      scrollToTop();
    };
  }, [isEmail, otpToken, isEmailValid, isPhoneNumValid]);

  const sendverifyOtp = async () => {
    setOtpResponse(false);
    if (otpCount >= 5) {
      const msge306 = Errorlist.find((item) => item.code == 'E306')?.label;
      if (msge306 != undefined) {
        setErrOtp(t(msge306));
      } else {
        setErrOtp('(error not match) OTP not match too much times,please resend OTP');
      }
      return;
    }
    setOtpCount(otpCount + 1);
    setErrOtp('');
    var codeList = (document.querySelector('#InputCode') as HTMLDivElement)
      .children as HTMLCollectionOf<HTMLInputElement>;

    let codeValues = '';
    for (let i = 0; i < codeList.length; i++) {
      codeValues += codeList[i].value;
      if (codeList[i].value == '') {
        setOtpComplete(false);
        return;
      }
    }

    setOtpComplete(true);
    const databody = { Signature: signature, UserInputCode: codeValues };

    try {
      setIsLoading(true);
      const response = await fetch('/api/registration/verifyOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(databody),
      });
      setIsLoading(false);

      if (response.status == 200) {
        setOtpCount(0);
        setOtpResponse(true);
        setErrOtp('');
        setOtpcode(codeValues);
        setCreateProfileErr(false);
        setCreateProfileErrMsg('');
        setStep('3');
        scrollToTop();
      } else {
        if (otpCount >= 4) {
          const msge306 = Errorlist.find((item) => item.code == 'E306')?.label;
          if (msge306 != undefined) {
            setErrOtp(t(msge306));
          } else {
            setErrOtp('(error not match) OTP not match too much times');
          }
          return;
        }
        const data = (await response.json()) as SsoErrorMessage;
        if (data.ErrorCode) {
          const msg = Errorlist.find((item) => item.code == data.ErrorCode)?.label;
          if (msg != undefined) {
            setErrOtp(t(msg));
          } else {
            if (data.ErrorMessage) setErrOtp(data.ErrorMessage);
            else setErrOtp(t(DICTIONARY_CONSTANT.SSO.Global.INVALID_API));
          }
        } else {
          if (data.ErrorMessage) setErrOtp(data.ErrorMessage);
          else setErrOtp(t(DICTIONARY_CONSTANT.SSO.Global.INVALID_API));
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrOtp(t('SSO/Errors/GeneralError'));
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = async () => {
    sendGTMEvent({
      event: 'login_signup_interact',
      login_or_signup: 'signup',
      step_number: 1,
      step_name: 'signup-homepage',
      intent: 'continue to signup',
      method: isEmail ? 'email' : 'phone',
    });
    // captchaBtnRef.current?.click();
    // sendOtp();
    continueToOtp();
  };
  const closeModal = () => {
    setStep('1');
    scrollToTop();
    setErrOtp('');
    setIsActive(false);
    setSeconds(60);
  };

  const continueToValidate = async () => {
    const databody = !isEmail
      ? {
          Channel: 'email',
          Email: email,
        }
      : {
          Channel: 'phone',
          MobileCountry: phoneAreaCode,
          MobilePhoneNumber: phoneNum,
        };
    try {
      setIsLoading(true);
      const response = await fetch('/api/registration/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(databody),
      });
      setIsLoading(false);

      //if (response.status == 200) {
      // if (isEmail) {
      //   setPhoneErr(t(DICTIONARY_CONSTANT.SSO.Global.PHONE_USED));
      // } else {
      //   setEmailErr(t(DICTIONARY_CONSTANT.SSO.Global.EMAIL_UESD));
      // }
      //return;
      //} else
      if (response.status == 404) {
        setPhoneErr('');
        setEmailErr('');
        setStep4();
        scrollToTop();
      } else {
        const errdata = (await response.json()) as SsoErrorMessage;
        //console.error('Error fetching data:', errdata);
        if (errdata.ErrorCode) {
          //if (isEmail) {
          //setPhoneErr(errdata.ErrorMessage ?? 'validate error');
          //} else {
          //setEmailErr(errdata.ErrorMessage ?? 'validate error');
          //}
          const msg = Errorlist.find((item) => item.code == errdata.ErrorCode)?.label;
          if (msg != undefined) {
            isEmail ? setPhoneErr(t(msg)) : setEmailErr(t(msg));
            return;
          } else {
            isEmail
              ? setPhoneErr(t('SSO/Errors/GeneralError'))
              : setEmailErr(t('SSO/Errors/GeneralError'));
            return;
          }
        } else {
          isEmail
            ? setPhoneErr(t('SSO/Errors/GeneralError'))
            : setEmailErr(t('SSO/Errors/GeneralError'));
          return;
        }
      }
    } catch (error) {
      //console.error('Error fetching data:', error);
      isEmail
        ? setPhoneErr(t('SSO/Errors/GeneralError'))
        : setEmailErr(t('SSO/Errors/GeneralError'));
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const setStep4 = () => {
    setPhoneErr('');
    setEmailErr('');
    setValidate(true);
    setAcceptAllPolicy(true);
    let chkAllPolicy = true;
    for (const policy of ConsentList) {
      if (policy.required && !selectedPolicies.includes(policy.code)) {
        setAcceptAllPolicy(false);
        chkAllPolicy = false;
        break;
      }
    }
    if (!checkPassword()) {
      setPasswordCheck(false);
    }
    let validateContact = false;
    validateContact =
      (isEmail && phoneNum !== '' && isPhoneNumValid) ||
      (!isEmail && email !== '' && isEmailValid && confirmEmail !== '' && isConfirmEmailValid);
    if (
      title !== '' &&
      firstname !== '' &&
      lastname !== '' &&
      validateContact &&
      chkAllPolicy &&
      checkPassword() &&
      passwordConfirm
    ) {
      setValidate(false);
      setStep('4');
      scrollToTop();
    }
  };

  const createProfileComplete = () => {
    if (selectedInterest.length == 0) {
      setIsSelectInterest(false);
      return;
    } else {
      setStep5();
      scrollToTop();
    }
  };

  const setStep5 = async (isSkip = false) => {
    let i = 0;
    let s: OTP = {
      Signature: signature,
      UserInputCode: otpcode,
    };
    let p: SsoUserProfile | SsoUserProfileWithPWD = {
      Salutation: title,
      FirstName: firstname,
      LastName: lastname,
      Email: email,
      MobileCountry: phoneAreaCode,
      MobilePhoneNumber: phoneNum,
      Interests: isSkip
        ? {
            ArtAndDesign: false,
            Music: false,
            Wellness: false,
            Fashion: false,
            Cars: false,
            Watches: false,
            Jewellery: false,
            Sustainability: false,
            DestinationTravel: false,
            SportsAndFitness: false,
            Beauty: false,
            DiversityAndInclusion: false,
            RestaurantsAndBars: false,
          }
        : {
            ArtAndDesign: selectedInterest.includes(InterestChecklist[i++].code),
            Music: selectedInterest.includes(InterestChecklist[i++].code),
            Wellness: selectedInterest.includes(InterestChecklist[i++].code),
            Fashion: selectedInterest.includes(InterestChecklist[i++].code),
            Cars: selectedInterest.includes(InterestChecklist[i++].code),
            Watches: selectedInterest.includes(InterestChecklist[i++].code),
            Jewellery: selectedInterest.includes(InterestChecklist[i++].code),
            Sustainability: selectedInterest.includes(InterestChecklist[i++].code),
            DestinationTravel: selectedInterest.includes(InterestChecklist[i++].code),
            SportsAndFitness: selectedInterest.includes(InterestChecklist[i++].code),
            Beauty: selectedInterest.includes(InterestChecklist[i++].code),
            DiversityAndInclusion: selectedInterest.includes(InterestChecklist[i++].code),
            RestaurantsAndBars: selectedInterest.includes(InterestChecklist[i++].code),
          },
      MarketingOptIn: marketingOptIn,
      DataManageOutsideResidence: true,
      DataManageWithinResidence: true,
      RegisterSourceSystem: 'East Hotels Website',
      OTPs: [s],
    };
    let apiPath = '/api/registration/createProfile';
    if (passwordValue.length > 0) {
      apiPath = '/api/registration/createProfileWithPWD';
      (p as SsoUserProfileWithPWD).Password = passwordValue;
    }

    let isSignUp = 'fail';
    let memberId = '';
    try {
      setIsLoading(true);
      const response = await fetch(apiPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(p),
      });
      setIsLoading(false);
      if (response.status == 200) {
        isSignUp = 'success';
        const data = (await response.json()) as SsoToken;
        if (data?.Id) {
          memberId = data.Id;
          setMembershipId(data.Id);
        }

        setStep('5');
        scrollToTop();

        const parsedInt = parseInt(props.fields.WelcomeItem.fields.RedirectTime.value, 10);
        const timeOut = isNaN(parsedInt) ? 0 : parsedInt * 1000;

        if (timeOut !== 0) {
          setTimeout(() => {
            if (passwordValue.length > 0) {
              if (
                data.Token?.AccessToken &&
                data.Token?.IdToken &&
                data.Token?.TokenType &&
                data.Token?.ExpireIn
              ) {
                setIsLoading(true);
                const link =
                  SsoApiPaths.LOGIN_TOKEN +
                  `/?access_token=${data.Token?.AccessToken}&token_type=${data.Token?.TokenType}&expires_in=${data.Token?.ExpireIn}&id_token=${data.Token?.IdToken}&ui_locales=${SitecoreLanguageToAzureB2CLanguageMapping[locale()]}&callbackUrl=${GetLocaleUrl(SsoApiPaths.SIGN_IN_CALLBACK, locale())}`;

                location.assign(link);
              }
              //location.assign(GetLocaleUrl(SsoApiPaths.SIGN_IN_CALLBACK, locale()));
            } else {
              setIsLoading(true);
              toLogin();
            }
          }, timeOut);
        }
      } else {
        const errdata = (await response.json()) as SsoErrorMessage;
        if (errdata.ErrorCode) {
          const msg = Errorlist.find((item) => item.code == errdata.ErrorCode)?.label;

          if (msg != undefined) {
            setCreateProfileErrMsg(t(msg));
            setCreateProfileErr(true);
            return;
          }
        }
        //alert(err_msg);
        setCreateProfileErrMsg(t('SSO/Errors/GeneralError'));
        setCreateProfileErr(true);
        //return;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setCreateProfileErrMsg(t('SSO/Errors/GeneralError'));
      //alert(err_msg);
      //return;
    } finally {
      //console.log('leclerc', isSignUp + ' ' + memberId);
      sendGTMEvent({
        event: 'login_signup_status',
        login_or_signup: 'signup',
        status: isSignUp,
        method: isEmail ? 'email' : 'phone',
        member_id: memberId,
        intent: 'successful signup',
      });
      setIsLoading(false);
    }
  };

  const toLogin = () => {
    setIsLoading(true);
    const loginUrl = GetLocaleUrl(SsoApiPaths.SIGN_IN_PAGE, locale());
    if (loginUrl) {
      location.assign(loginUrl);
    } else {
      signIn(
        'azureb2c',
        { callbackUrl: GetLocaleUrl(SsoApiPaths.SIGN_IN_CALLBACK, locale()) },
        { ui_locales: SitecoreLanguageToAzureB2CLanguageMapping[locale()] }
      );
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'instant',
    });
  };
  const changeEmailPhone = () => {
    isEmail ? setIsEmail(false) : setIsEmail(true);
    sendGTMEvent({
      event: 'login_signup_interact',
      login_or_signup: 'signup',
      step_number: 1,
      step_name: 'signup-homepage',
      intent: isEmail ? 'signup by email' : 'signup by phone',
      method: isEmail ? 'email' : 'phone',
    });
  };

  //const changeLoginRegistration = () => {
  //  signIn("azureb2c", { callbackUrl: `/${locale()}${SsoApiPaths.SIGN_IN_CALLBACK}` });
  //};

  const [seconds, setSeconds] = useState(10);
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  //const [email, setEmail] = useState('');
  // const emailRegex =
  //   /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/;
  const emailRegex = new RegExp(AzureB2CProfile.REGEX_EMAIL);
  const nameRegex = new RegExp(AzureB2CProfile.REGEX_ENAME);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setemail(value);
    if (value.length == 0) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(emailRegex.test(value));
    }
  };

  const [confirmEmailFormat, setConfirmEmailFormatValid] = useState(true);
  const handleConfirmEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmEmail(value);
    if (value.length == 0) {
      setConfirmEmailFormatValid(true);
    } else {
      setConfirmEmailFormatValid(emailRegex.test(value));
    }
    var profileEml = (document.querySelector('#profileEmail') as HTMLInputElement).value;
    if (value !== profileEml && value !== '') {
      setIsConfirmEmailValid(false);
    } else {
      setIsConfirmEmailValid(true);
    }
  };

  const phoneNumRegex = /^[0-9]{5,15}$/;
  const handlePhoneNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setphoneNum(value);
    if (value.length == 0) {
      setIsPhoneNumValid(true);
    } else {
      setIsPhoneNumValid(phoneNumRegex.test(value));
    }
  };

  const handlePhoneAreaCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPhoneAreaCode(value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTitle(value);
  };

  const handleFirstnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFirstnameValid(!value || nameRegex.test(value));
    setFirstname(value);
  };

  const handleLastnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLastnameValid(!value || nameRegex.test(value));
    setLastname(value);
  };

  const [selectedPolicies, setSelectedPolicies] = useState<String[]>([]);
  const handlePolicyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checkedId = e.target.value;
    if (e.target.checked) {
      setSelectedPolicies([...selectedPolicies, checkedId]);
      if (e.target.value === 'use-pii') {
        setMarketingOptIn(true);
      }
      if (selectedPolicies.length === ConsentList.length - 1) {
        setSelectAllPolicy(true);
      }
    } else {
      setSelectedPolicies(selectedPolicies.filter((id) => id !== checkedId));
      if (e.target.value === 'use-pii') {
        setMarketingOptIn(false);
      }
      if (selectedPolicies.length === ConsentList.length) {
        setSelectAllPolicy(false);
      }
    }
  };
  const handleSelectAllPolicyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectAllPolicy(true);
      setMarketingOptIn(true);
      let allPolicy: string[] = [];
      ConsentList.forEach((item) => allPolicy.push(item.code));
      setSelectedPolicies(allPolicy);
    } else {
      setSelectAllPolicy(false);
      setMarketingOptIn(false);
      setSelectedPolicies([]);
    }
  };

  const [selectedInterest, setSelectedInterest] = useState<String[]>([]);
  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedInterest.length >= 3 && e.target.checked) {
      setIsSelectMore(true);
      return;
    } else {
      setIsSelectMore(false);
    }
    if (e.target.checked) {
      setIsSelectInterest(true);
    }

    const checkedId = e.target.value;
    if (e.target.checked) {
      setSelectedInterest([...selectedInterest, checkedId]);
    } else {
      setSelectedInterest(selectedInterest.filter((id) => id !== checkedId));
    }
  };

  const setStep3 = () => {
    setCreateProfileErr(false);
    setCreateProfileErrMsg('');
    setStep('3');
    scrollToTop();
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
      if (captchaRespJson && captchaRespJson.Token) {
        SetOtpToken(captchaRespJson.Token);
      }
      return {
        captchaResult: captchaRespJson.captchaVerifyResult,
      };
    } else {
      return {
        captchaResult: false,
      };
    }
  };
  const onBizResultCallback = (resp: Boolean) => {
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
          // mode: 'embed',
          mode: 'popup',
          element: '#developmentform-captcha-element',
          button: '#developmentform-captcha-button',
          // captchaVerifyCallback: captchaVerifyCallback,
          // onBizResultCallback: onBizResultCallback,
          success: async (captchaVerifyParam: string) => {
            await sendOtp(captchaVerifyParam);
            initCaptcha();
            // const result = await captchaVerifyCallback(captchaVerifyParam);
            // if (!result?.captchaResult) {
            //   initCaptcha();
            // }
            // onBizResultCallback(!!result?.captchaResult);
            // return !!result?.captchaResult;
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
        setIsCaptchaSuccess(true);
      };
    }
    return () => {
      document.getElementById('aliyunCaptcha-mask')?.remove();
      document.getElementById('aliyunCaptcha-window-popup')?.remove();
    };
  }, [aliyunCaptchaLoaded]);
  //captcha
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

  const [pwdHidden, setPwdHidden] = useState(true);
  const [cpwdHidden, setcPwdHidden] = useState(true);

  const [openDrop, setOpenDrop] = useState(false);
  const handleDropdown = () => {
    setOpenDrop(!openDrop);
  };

  return (
    <>
      {isLoading ? (
        <div id="loading-state">
          <div id="loading"></div>
        </div>
      ) : null}
      <div className={`${step == '1' ? '' : 'hidden'}  mt-[75px]`}>
        <div className="mx-auto max-w-[1280px] sm:flex ">
          <div className="sm:mx-[30px] sm:w-1/2">
            <JssImage field={props.fields.Image} className="relative mx-auto" />
          </div>
          <div className="mx-[30px] sm:w-1/2">
            <Typography variant="sso_title1" className="pt-10 sm:py-5">
              <Text field={props.fields.RegistrationTitle} />
            </Typography>

            <Typography variant="l2" className="py-5">
              <Text field={props.fields.RegistrationDescription} />
            </Typography>

            <form className="m-auto flex flex-col items-start py-5 sm:ml-0 sm:max-w-[345px]">
              <Typography
                variant="sso_title2"
                fontWeight="bold"
                className={`mb-5  ${!isEmail ? 'hidden' : ''}`}
              >
                {t(DICTIONARY_CONSTANT.SSO.Global.EMAIL)}
              </Typography>
              <div className={`mb-5 sm:mb-[38px] ${isEmail ? 'hidden' : ''}`}>
                <div className="sm:absolute sm:flex">
                  <Typography variant="sso_title2" fontWeight="bold">
                    {t(DICTIONARY_CONSTANT.SSO.Global.PHONE_NUMBER)}&nbsp;
                  </Typography>
                  <Typography variant="l2">
                    {t(DICTIONARY_CONSTANT.SSO.Global.PHONE_REMARK)}
                  </Typography>
                </div>
              </div>
              <input
                id="EmailInput"
                className={`w-full border-b border-b-[#828077] bg-transparent text-[13px] outline-none ${!isEmail ? 'hidden' : ''}`}
                value={email}
                onChange={handleEmailChange}
                placeholder={t(DICTIONARY_CONSTANT.SSO.Global.ENTER_EMAIL)}
              />
              {isEmail && !isEmailValid && (
                <p className="error mt-1 text-[11px] text-[#D99200]">
                  {t(DICTIONARY_CONSTANT.SSO.Global.EMAIL_FORMAT)}
                </p>
              )}
              {isEmail && validate && email == '' && (
                <p className="error mt-1 text-[11px] text-[#D99200]">
                  {t(DICTIONARY_CONSTANT.SSO.Global.REQUIRED_EMAIL)}
                </p>
              )}
              {isEmail && err_step1forEmail !== '' && (
                <p className="error mt-1 text-[11px] text-[#D99200]">{err_step1forEmail}</p>
              )}
              <div className={`grid w-full grid-cols-[20%_77%] gap-2 ${isEmail ? 'hidden' : ''}`}>
                <select
                  id="MobileCountry"
                  className={`w-full border-b border-b-[#828077] bg-transparent text-[13px] outline-none `}
                  onChange={handlePhoneAreaCodeChange}
                  defaultValue={phoneAreaCode}
                >
                  {MobileAreaCode.map((mac) => (
                    <option value={mac.code}>{mac.label}</option>
                  ))}
                </select>
                <input
                  id="PhoneNumber"
                  className={` w-full border-b border-b-[#828077] bg-transparent text-[13px] outline-none `}
                  type="text"
                  placeholder={t(DICTIONARY_CONSTANT.SSO.Global.ENTER_PHONE)}
                  value={phoneNum}
                  onChange={handlePhoneNumChange}
                />
              </div>
              {!isEmail && !isPhoneNumValid && (
                <p className="error mt-1 text-[11px] text-[#D99200]">
                  {t(DICTIONARY_CONSTANT.SSO.Global.PHONE_FORMAT)}
                </p>
              )}
              {!isEmail && validate && phoneNum == '' && (
                <p className="error mt-1 text-[11px] text-[#D99200]">
                  {t(DICTIONARY_CONSTANT.SSO.Global.REQUIRED_PHONE)}
                </p>
              )}
              {!isEmail && err_step1forPhone !== '' && (
                <p className="error mt-1 text-[11px] text-[#D99200]">{err_step1forPhone}</p>
              )}

              <div className="sso-captcha m-auto mt-5">
                <div id="developmentform-captcha-b">
                  <div
                    id="developmentform-captcha-button"
                    className="invisible"
                    ref={captchaBtnRef}
                  ></div>
                  <div id="developmentform-captcha-element"></div>
                </div>
              </div>
              <button
                type="button"
                disabled={!isCaptchaSuccess}
                onClick={openModal}
                className="my-5 h-10 w-full bg-green-primary"
              >
                <Typography
                  variant="sso_btn_text"
                  fontWeight="bold"
                  fontColor={`${isCaptchaSuccess ? 'white' : '#bdbfbe'}`}
                  extraStyles="mt-[5px]"
                >
                  {t(DICTIONARY_CONSTANT.SSO.Global.CONTINUE)}
                </Typography>
              </button>

              {enableMobileReg && (
                <>
                  <div className="mb-5 flex w-full items-center">
                    <hr className="flex flex-1 border-0 border-t border-t-[#4e4c45]" />
                    <span>
                      <Typography variant="sso_track" fontWeight="bold" className="mx-2 ">
                        {t(DICTIONARY_CONSTANT.SSO.Global.OR)}
                      </Typography>
                    </span>
                    <hr className="flex flex-1 border-0 border-t border-t-[#4e4c45]" />
                  </div>

                  <button
                    onClick={changeEmailPhone}
                    type="button"
                    className="mb-5 h-10 w-full border border-[#828077] bg-white"
                  >
                    <Typography
                      variant="sso_btn_text"
                      fontWeight="bold"
                      fontColor={'#828077'}
                      extraStyles="mt-[5px]"
                    >
                      {isEmail
                        ? t(DICTIONARY_CONSTANT.SSO.Global.SIGN_UP_BY_PHONE)
                        : t(DICTIONARY_CONSTANT.SSO.Global.SIGN_UP_BY_EMAIL)}
                    </Typography>
                  </button>
                </>
              )}
            </form>
            <a
              href="#"
              onClick={() => {
                sendGTMEvent({
                  event: 'login_signup_interact',
                  login_or_signup: 'signup',
                  step_number: 1,
                  step_name: 'signup-homepage',
                  intent: 'login now',
                  method: isEmail ? 'email' : 'phone',
                });
                toLogin();
              }}
              className={`mb-5 w-full`}
            >
              <Typography
                variant="sso_track"
                fontWeight="bold"
                underline
                extraStyles="border-b-black-secondary"
              >
                {t(DICTIONARY_CONSTANT.SSO.Global.LOGIN_NOW)}
              </Typography>
            </a>
            <div className="my-5 border-t border-t-[#828077]"></div>

            <Typography variant="sso_title1" extraStyles="py-5">
              <Text field={props.fields.DetailTitle} />
            </Typography>

            <Typography variant="l2" extraStyles="py-5">
              <Text field={props.fields.DetailDescription} />
            </Typography>

            <div className="flex flex-col gap-3 py-5  sm:grid sm:grid-cols-2">
              <div className="flex">
                <Image className="mt-[-3px] h-[20px] w-[20px] pr-1" field={props.fields.Icon1} />
                <Typography variant="l2" fontWeight="semiBold">
                  <Text field={props.fields.List1} />
                </Typography>
              </div>
              <div className="flex">
                <Image className="mt-[-3px] h-[20px] w-[20px] pr-1" field={props.fields.Icon2} />
                <Typography variant="l2" fontWeight="semiBold">
                  <Text field={props.fields.List2} />
                </Typography>
              </div>
              <div className="flex">
                <Image className="mt-[-3px] h-[20px] w-[20px] pr-1" field={props.fields.Icon3} />
                <Typography variant="l2" fontWeight="semiBold">
                  <Text field={props.fields.List3} />
                </Typography>
              </div>
              <div className="flex">
                <Image className="mt-[-3px] h-[20px] w-[20px] pr-1" field={props.fields.Icon4} />
                <Typography variant="l2" fontWeight="semiBold">
                  <Text field={props.fields.List4} />
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${step == '2' ? '' : 'hidden'}   mt-[75px]`}>
        <div className="m-auto flex max-w-[580px] flex-col items-center gap-5 pb-32 pt-16">
          <div className="m-auto ">
            <Typography variant="sso_title1">
              {t(DICTIONARY_CONSTANT.SSO.Global.ENTER_PASSCODE)}
            </Typography>
          </div>
          <div className="m-auto text-center text-[13px]">
            <Typography variant="l2" className={`${isEmail ? 'hidden' : ''}`}>
              {t(DICTIONARY_CONSTANT.SSO.Global.OTP_SENT_PHONE).replace(/{phone}/gi, maskPhoneNum)}
            </Typography>

            <Typography variant="l2" className={`${isEmail ? '' : 'hidden'}`}>
              {t(DICTIONARY_CONSTANT.SSO.Global.OTP_SENT_EMAIL).replace(/{email}/gi, maskEmail)}
            </Typography>
            {/* <p className={`${isEmail ? 'hidden' : ''}`}>
              {t(DICTIONARY_CONSTANT.SSO.Global.CHECK_OTP_PHONE)}
            </p>
            <p className={`${isEmail ? '' : 'hidden'}`}>
              {t(DICTIONARY_CONSTANT.SSO.Global.CHECK_OTP_EMAIL)}
            </p> */}
          </div>
          <div className="w-[345px]">
            <CodeInput />
            {!NotOtpComplete && (
              <p className="error mt-1 text-center text-[11px] text-[#D99200]">
                {t(DICTIONARY_CONSTANT.SSO.Global.OTP_NOT_COMPLETE)}
              </p>
            )}
            {errOtp != '' && (
              <p className="error mt-1 text-center text-[11px] text-[#D99200]">{errOtp}</p>
            )}
            <button
              onClick={() => {
                sendGTMEvent({
                  event: 'login_signup_interact',
                  login_or_signup: 'signup',
                  step_number: 2,
                  step_name: 'signup-otp',
                  intent: 'continue with otp',
                  method: isEmail ? 'email' : 'phone',
                });
                sendverifyOtp();
                sendGTMEvent({
                  event: 'login_signup_interact',
                  login_or_signup: 'signup',
                  step_number: 2,
                  step_name: 'signup-otp',
                  intent: otpResponse ? 'otp success' : 'otp failed',
                  method: isEmail ? 'email' : 'phone',
                });
              }}
              className="mt-5 h-10 w-full bg-green-primary text-white"
            >
              <Typography
                variant="sso_btn_text"
                fontWeight="bold"
                fontColor={'white'}
                extraStyles="mt-[5px]"
                className="font-[500px]"
              >
                {t(DICTIONARY_CONSTANT.SSO.Global.CONTINUE)}
              </Typography>
            </button>

            <div className="mt-10">
              <div className="my-3 w-full border border-t-[#d7d6d5] "></div>
              <div className="mb-1 flex items-center justify-between" onClick={handleDropdown}>
                <Typography variant="sso_track" fontWeight="bold">
                  <Text field={props.fields.AccordionTitle} />
                </Typography>
                <div className={openDrop ? 'uptriangle' : 'downtriangle'}></div>
              </div>
              <div
                className={
                  openDrop ? 'sso-richtext-ul-dot pt-[10px] text-[13px] leading-[18px]' : 'hidden'
                }
              >
                {isEmail ? (
                  <RichText field={props.fields.AccordionContent} />
                ) : (
                  <RichText field={props.fields.AccordionContentForPhone} />
                )}
              </div>
              <div className="mt-3 w-full border border-t-[#d7d6d5] "></div>
            </div>
          </div>

          <div className={`mt-2 ${isActive ? '' : 'hidden'}`}>
            <Typography variant="sso_track" fontColor="green-primary" fontWeight="bold">
              {t(DICTIONARY_CONSTANT.SSO.Global.RESEND_OTP_COUNTDOWN).replace(
                /{seconds}/gi,
                String(seconds)
              )}
            </Typography>
          </div>
          <a
            onClick={() => {
              sendGTMEvent({
                event: 'login_signup_interact',
                login_or_signup: 'signup',
                step_number: 2,
                step_name: 'signup-otp',
                intent: 'resend otp',
                method: isEmail ? 'email' : 'phone',
              });
              captchaBtnRef.current?.click();
              // sendOtp();
            }}
            className={`mt-2 ${isActive ? 'hidden' : ''}`}
          >
            <Typography variant="sso_track" underline fontColor="#1d2021" fontWeight="bold">
              {t(DICTIONARY_CONSTANT.SSO.Global.RESEND_OTP_NOW)}
            </Typography>
          </a>
          <a
            className="mt-2 "
            onClick={() => {
              sendGTMEvent({
                event: 'login_signup_interact',
                login_or_signup: 'signup',
                step_number: 2,
                step_name: 'signup-otp',
                intent: 'go back',
                method: isEmail ? 'email' : 'phone',
              });
              closeModal();
            }}
          >
            <Typography variant="sso_track" underline fontColor="#1d2021" fontWeight="bold">
              {t(DICTIONARY_CONSTANT.SSO.Global.GO_BACK)}
            </Typography>
          </a>
        </div>
      </div>

      <div className={`${step == '3' ? '' : 'hidden'}   mt-[75px]`}>
        <div className="bg-[#f3f2f0]">
          <div className="mx-auto flex max-w-[640px] flex-col items-center px-5 ">
            <div className="pt-20 ">
              <Typography variant="sso_title1">
                {t(DICTIONARY_CONSTANT.SSO.Global.ENTER_PERSONAL_INFO)}
              </Typography>
            </div>
            <div className="w-full gap-3 pt-10 sm:grid sm:grid-cols-[20%_38%_38%]">
              <div className="">
                <div className="flex gap-1 text-[#D99200]">
                  <Typography variant="sso_track" fontWeight="bold" fontColor="black">
                    {t(DICTIONARY_CONSTANT.SSO.Global.TITLE)}
                  </Typography>
                  *
                </div>
                <select
                  required
                  className="w-full border-b  border-b-[#828077] bg-transparent text-[13px] outline-none"
                  defaultValue={title}
                  onChange={handleTitleChange}
                >
                  <option value="" disabled selected>
                    {/* {t(DICTIONARY_CONSTANT.SSO.Global.ENTER_TITLE)} */}
                  </option>
                  {SalesforceTitles.map((sft) => (
                    <option value={sft.code}>{t(sft.label)}</option>
                  ))}
                </select>
              </div>
              {validate && title == '' && (
                <p className="error errmobile mt-1 pt-2 text-[11px] text-[#D99200]">
                  {t(DICTIONARY_CONSTANT.SSO.Global.REQUIRED_TITLE)}
                </p>
              )}
              <div className="pt-10 sm:pt-0">
                <div className="flex gap-1 text-[#D99200]">
                  <Typography variant="sso_track" fontWeight="bold" fontColor="black">
                    {t(DICTIONARY_CONSTANT.SSO.Global.FIRST_NAME)}
                  </Typography>
                  *
                </div>
                <input
                  className="w-full border-b border-b-[#828077] bg-transparent text-[13px] outline-none"
                  value={firstname}
                  onChange={handleFirstnameChange}
                ></input>
              </div>
              <p className="w-full pt-2 text-start text-[11px] text-[#4b4b4b] sm:hidden">
                {t(DICTIONARY_CONSTANT.SSO.Global.CONSISTENT_NAME)}
              </p>
              {validate && firstname == '' && (
                <p className="error errmobile mt-1 pt-2 text-[11px] text-[#D99200]">
                  {t(DICTIONARY_CONSTANT.SSO.Global.REQUIRED_FIRSTNAME)}
                </p>
              )}
              <div className="pt-10 sm:pt-0">
                <div className="flex gap-1 text-[#D99200]">
                  <Typography variant="sso_track" fontWeight="bold" fontColor="black">
                    {t(DICTIONARY_CONSTANT.SSO.Global.LAST_NAME)}
                  </Typography>
                  *
                </div>
                <input
                  className="w-full border-b border-b-[#828077] bg-transparent text-[13px] outline-none"
                  value={lastname}
                  onChange={handleLastnameChange}
                ></input>
              </div>
            </div>
            <p className="w-full pt-2 text-start text-[11px] text-[#4b4b4b]">
              {t(DICTIONARY_CONSTANT.SSO.Global.CONSISTENT_NAME)}
            </p>
            {(validate || !(firstnameValid && lastnameValid)) && (
              <div className="w-full pt-2">
                {validate && title == '' && (
                  <p className="error errnormal mt-1 text-[11px] text-[#D99200]">
                    {t(DICTIONARY_CONSTANT.SSO.Global.REQUIRED_TITLE)}
                  </p>
                )}
                {validate && firstname == '' && (
                  <p className="error errnormal mt-1 text-[11px] text-[#D99200]">
                    {t(DICTIONARY_CONSTANT.SSO.Global.REQUIRED_FIRSTNAME)}
                  </p>
                )}
                {validate && lastname == '' && (
                  <p className="error mt-1 text-[11px] text-[#D99200]">
                    {t(DICTIONARY_CONSTANT.SSO.Global.REQUIRED_LASTNAME)}
                  </p>
                )}
                {!(firstnameValid && lastnameValid) && (
                  <p className="error mt-1 text-[11px] text-[#D99200]">
                    {t(DICTIONARY_CONSTANT.SSO.Global.REQUIRED_ENGLISHNAME)}
                  </p>
                )}
              </div>
            )}
            {isEmail && (
              <>
                <div className="w-full pt-10">
                  <div className="">
                    <Typography variant="sso_track" fontWeight="bold" fontColor="black">
                      {t(DICTIONARY_CONSTANT.SSO.Global.VERIFIED_EMAIL)}
                    </Typography>
                  </div>
                  <input
                    type="email"
                    className="w-full border-b border-b-[#828077] bg-transparent text-[13px] outline-none"
                    value={email}
                    readOnly
                  ></input>
                </div>
                <div className="w-full pt-5">
                  <Typography
                    // onClick={() => {
                    //   setIsOpenPWD(!isOpenPWD);
                    // }}
                    variant="sso_track"
                    fontWeight="bold"
                    fontColor="black"
                    // className={`${isOpenPWD ? 'triangle-up' : 'triangle-down'} `} //inline-block border-b-2
                  >
                    {t(DICTIONARY_CONSTANT.SSO.Password.SET_UP_PASSWORD_OPTIONAL)}
                  </Typography>
                  <p className="w-full pt-2 text-start text-[11px] text-[#4b4b4b]">
                    {t(DICTIONARY_CONSTANT.SSO.Password.SET_UP_TIP)}
                  </p>
                  {!passwordCheck && (
                    //todo
                    <p className="error mt-1 pt-2 text-[11px] text-[#D99200]">
                      {t(DICTIONARY_CONSTANT.SSO.Password.PWD_WRONG)}
                    </p>
                  )}
                  {/* {isOpenPWD && ( */}
                  <>
                    <div className="w-full pt-5">
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
                    <div className="w-full pt-3 text-[11px]">
                      <div>{t(DICTIONARY_CONSTANT.SSO.Password.LENGTH_REQUIRE)}</div>

                      <div className="sm:grid sm:grid-cols-2">
                        <div
                          className={passwordConditions.hasUpperCase ? 'flex text-[#D99200]' : ''}
                        >
                          <div
                            className={passwordConditions.hasUpperCase ? 'with-checkmark ' : ''}
                          ></div>
                          <div className={passwordConditions.hasUpperCase ? '' : 'ml-5'}>
                            {t(DICTIONARY_CONSTANT.SSO.Password.UPPERCASE_REQUIRE)}
                          </div>
                        </div>
                        <div
                          className={passwordConditions.hasLowerCase ? 'flex text-[#D99200]' : ''}
                        >
                          <div
                            className={passwordConditions.hasLowerCase ? 'with-checkmark ' : ''}
                          ></div>
                          <div className={passwordConditions.hasLowerCase ? ' ' : 'ml-5'}>
                            {t(DICTIONARY_CONSTANT.SSO.Password.LOWERCASE_REQUIRE)}
                          </div>
                        </div>
                        <div className={passwordConditions.hasNumber ? 'flex text-[#D99200]' : ''}>
                          <div
                            className={passwordConditions.hasNumber ? 'with-checkmark ' : ''}
                          ></div>
                          <div className={passwordConditions.hasNumber ? ' ' : 'ml-5'}>
                            {t(DICTIONARY_CONSTANT.SSO.Password.NUMBER_REQUIRE)}
                          </div>
                        </div>
                        <div
                          className={passwordConditions.hasSpecialChar ? 'flex text-[#D99200]' : ''}
                        >
                          <div
                            className={passwordConditions.hasSpecialChar ? 'with-checkmark ' : ''}
                          ></div>
                          <div className={passwordConditions.hasSpecialChar ? ' ' : 'ml-5'}>
                            {t(DICTIONARY_CONSTANT.SSO.Password.SPECIAL_CHARACTER_REQUIRE)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full pt-5">
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
                  </>
                  {/* )} */}
                </div>
                <div className="w-full pt-10">
                  <div className="flex gap-1 text-[#D99200]">
                    <Typography variant="sso_track" fontWeight="bold" fontColor="black">
                      {t(DICTIONARY_CONSTANT.SSO.Global.PHONE_NUMBER)}
                    </Typography>
                    *
                  </div>
                  <p className="w-full pb-[10px] text-start text-[11px] text-[#4b4b4b]">
                    {t(DICTIONARY_CONSTANT.SSO.Global.CONSISTENT_PHONE)}
                  </p>
                  <div className="grid grid-cols-[20%_78%] gap-3 text-[13px]">
                    <select
                      className="border-b  border-b-[#828077] bg-transparent  outline-none"
                      onChange={handlePhoneAreaCodeChange}
                      defaultValue={phoneAreaCode}
                    >
                      {MobileAreaCode.map((mac) => (
                        <option value={mac.code}>{mac.label}</option>
                      ))}
                    </select>
                    <input
                      className="border-b border-b-[#828077] bg-transparent outline-none"
                      value={phoneNum}
                      onChange={handlePhoneNumChange}
                    ></input>
                  </div>
                  {!isPhoneNumValid && (
                    <p className="error mt-1 pt-2 text-[11px] text-[#D99200]">
                      {t(DICTIONARY_CONSTANT.SSO.Global.PHONE_FORMAT)}
                    </p>
                  )}
                  {validate && phoneNum == '' && (
                    <p className="error mt-1 pt-2 text-[11px] text-[#D99200]">
                      {t(DICTIONARY_CONSTANT.SSO.Global.REQUIRED_PHONE)}
                    </p>
                  )}
                  {phoneErr != '' && (
                    <p className="error mt-1 pt-2 text-[11px] text-[#D99200]">{phoneErr}</p>
                  )}
                </div>
              </>
            )}
            {!isEmail && (
              <>
                <div className="w-full pt-10">
                  <div className="">
                    <Typography variant="sso_track" fontWeight="bold" fontColor="black">
                      {t(DICTIONARY_CONSTANT.SSO.Global.VERIFIED_PHONE)}
                    </Typography>
                  </div>
                  <div className="grid grid-cols-[20%_78%] gap-3 text-[13px]">
                    <input
                      className="border-b border-b-[#828077] bg-transparent outline-none"
                      value={MobileAreaCode.filter((m) => m.code == phoneAreaCode).map(
                        (m) => m.label
                      )}
                      readOnly
                    ></input>
                    <input
                      className="border-b border-b-[#828077] bg-transparent outline-none"
                      value={phoneNum}
                      readOnly
                    ></input>
                  </div>
                </div>
                <div className="w-full pt-10">
                  <div className="flex gap-1 text-[#D99200]">
                    <Typography variant="sso_track" fontWeight="bold" fontColor="black">
                      {t(DICTIONARY_CONSTANT.SSO.Global.EMAIL)}
                    </Typography>
                    *
                  </div>
                  <input
                    id="profileEmail"
                    type="email"
                    className="w-full border-b border-b-[#828077] bg-transparent text-[13px] outline-none"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  {!isEmailValid && (
                    <p className="error 3 mt-1 pt-2 text-[11px] text-[#D99200]">
                      {t(DICTIONARY_CONSTANT.SSO.Global.EMAIL_FORMAT)}
                    </p>
                  )}
                  {validate && email == '' && (
                    <p className="error 2 mt-1 pt-2 text-[11px] text-[#D99200]">
                      {t(DICTIONARY_CONSTANT.SSO.Global.REQUIRED_EMAIL)}
                    </p>
                  )}
                  {emailErr != '' && (
                    <p className="error 1 mt-1 pt-2 text-[11px] text-[#D99200]">{emailErr}</p>
                  )}
                </div>
                <div className="w-full pt-10">
                  <div className="text-[11px] font-bold">
                    {t(DICTIONARY_CONSTANT.SSO.Global.CONFIRM_EMAIL)} *
                  </div>
                  <input
                    id="profileConfirmEmail"
                    type="email"
                    className="w-full border-b-2 border-b-[#828077] bg-transparent text-[13px] outline-none"
                    onChange={handleConfirmEmailChange}
                    value={confirmEmail}
                  />
                  {!confirmEmailFormat && (
                    <p className="error mt-1 pt-2 text-[11px] text-[#D99200]">
                      {t(DICTIONARY_CONSTANT.SSO.Global.EMAIL_FORMAT)}
                    </p>
                  )}

                  {!isConfirmEmailValid && (
                    <p className="error mt-1 pt-2 text-[11px] text-[#D99200]">
                      {t(DICTIONARY_CONSTANT.SSO.Global.CONFIRM_EMAIL_INVALID)}
                    </p>
                  )}
                  {validate && confirmEmail == '' && (
                    <p className="error mt-1 pt-2 text-[11px] text-[#D99200]">
                      {t(DICTIONARY_CONSTANT.SSO.Global.REQUIRED_CONFIRM_EMAIL)}
                    </p>
                  )}
                </div>
              </>
            )}
            <div className="w-full pt-10">
              <div className="flex items-start pb-2 text-[13px]">
                <input
                  className="ssoinput mr-1.5 mt-0.5"
                  type="checkbox"
                  checked={selectAllPolicy}
                  onChange={handleSelectAllPolicyChange}
                />
                <Typography variant="l2">{t(DICTIONARY_CONSTANT.SSO.Global.SELECT_ALL)}</Typography>
              </div>

              {ConsentList.map((policy) => (
                <>
                  <div className="flex items-start pb-2 pl-4 text-[13px]" key={policy.code}>
                    <input
                      className="ssoinput mr-3 mt-0.5"
                      type="checkbox"
                      value={policy.code}
                      checked={selectedPolicies.includes(policy.code)}
                      onChange={handlePolicyChange}
                    />
                    <Typography variant="l2">
                      <label
                        dangerouslySetInnerHTML={{
                          __html: t(policy.label, { name: '', escapeInterpolation: false }),
                        }}
                      ></label>
                    </Typography>
                  </div>
                  {policy.required && (
                    <p
                      className={`${!acceptAllPolicy && !selectedPolicies.includes(policy.code) ? 'error error-margin mt-1 text-[11px] text-[#D99200]' : 'hidden'}`}
                    >
                      {t(DICTIONARY_CONSTANT.SSO.Global.CONSENT_REQUIRED)}
                    </p>
                  )}
                </>
              ))}
            </div>
            <div className="w-full border-t border-black"></div>
            <div className="w-full pt-3 text-[13px]">{t(DICTIONARY_CONSTANT.SSO.Consent.NOTE)}</div>
            <button
              onClick={() => {
                sendGTMEvent({
                  event: 'login_signup_interact',
                  login_or_signup: 'signup',
                  step_number: 3,
                  step_name: 'signup-personal-info',
                  intent: 'continue with personal info',
                  method: isEmail ? 'email' : 'phone',
                });
                continueToValidate();
              }}
              className="mb-32 mt-10 h-[47px] w-full bg-[#828077] px-10 py-2 text-white"
            >
              <Typography variant="sso_btn_text" fontWeight="bold">
                {t(DICTIONARY_CONSTANT.SSO.Global.CONTINUE)}
              </Typography>
            </button>
          </div>
        </div>
      </div>

      <div className={`${step == '4' ? '' : 'hidden'}   mt-[75px]`}>
        <div className="bg-[#f3f2f0]">
          <div className="mx-auto flex max-w-[640px] flex-col items-center px-5 ">
            <div className="pb-3 pt-16 ">
              <Typography variant="sso_title1">
                {t(DICTIONARY_CONSTANT.SSO.Global.PREFERENCE_SURVEY)}
              </Typography>
            </div>
            {!isSelectInterset && (
              <p className="error mt-1 self-start text-[11px] text-[#D99200]">
                {t(DICTIONARY_CONSTANT.SSO.Global.PLEASE_SELECT)}
              </p>
            )}
            {isSelectMore && (
              <p className="error mt-1 self-start text-[11px] text-[#D99200]">
                {t(DICTIONARY_CONSTANT.SSO.Global.MAXIMUM_SELECT)}
              </p>
            )}
            <div className=" self-start pt-3 text-[11px] font-bold leading-[55px]">
              {t(DICTIONARY_CONSTANT.SSO.Global.INTEREST)}
            </div>

            <div className="grid w-full grid-cols-3 gap-2 text-[13px]">
              {InterestChecklist.map((interest) => (
                <div
                  className="flex items-start pb-2 text-[13px] leading-[18px]"
                  key={interest.code}
                >
                  <input
                    className="ssoinput mr-1.5 mt-[2px]"
                    type="checkbox"
                    value={interest.code}
                    checked={selectedInterest.includes(interest.code)}
                    onChange={handleInterestChange}
                  />
                  <label>{t(interest.label)}</label>
                </div>
              ))}
            </div>
            {createProfileErr && createProfileErrMsg !== '' && (
              <p className="error mt-1 text-center text-[11px] text-[#D99200] ">
                {createProfileErrMsg}
              </p>
            )}
            <button
              onClick={() => {
                sendGTMEvent({
                  event: 'login_signup_interact',
                  login_or_signup: 'signup',
                  step_number: 4,
                  step_name: 'signup-preference-survey',
                  intent: 'complete survey',
                  method: isEmail ? 'email' : 'phone',
                });
                createProfileComplete();
              }}
              className="mt-8 h-[47px] w-full bg-[#828077] px-10 py-2 text-white"
            >
              <Typography variant="sso_btn_text">
                {t(DICTIONARY_CONSTANT.SSO.Global.COMPLETE)}
              </Typography>
            </button>
            <div className="mb-32 mt-10 flex w-full justify-around  ">
              <a
                onClick={() => {
                  sendGTMEvent({
                    event: 'login_signup_interact',
                    login_or_signup: 'signup',
                    step_number: 4,
                    step_name: 'signup-preference-survey',
                    intent: 'go back',
                    method: isEmail ? 'email' : 'phone',
                  });
                  setStep3();
                }}
              >
                <Typography variant="sso_track" fontWeight="bold" fontColor="#1d2021" underline>
                  {t(DICTIONARY_CONSTANT.SSO.Global.GO_BACK)}
                </Typography>
              </a>
              <a
                onClick={() => {
                  sendGTMEvent({
                    event: 'login_signup_interact',
                    login_or_signup: 'signup',
                    step_number: 4,
                    step_name: 'signup-preference-survey',
                    intent: 'skip survey',
                    method: isEmail ? 'email' : 'phone',
                  });
                  setStep5(true);
                }}
              >
                <Typography variant="sso_track" fontWeight="bold" fontColor="#1d2021" underline>
                  {t(DICTIONARY_CONSTANT.SSO.Global.SKIP)}
                </Typography>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={`${step == '5' ? '' : 'hidden'}   mt-[75px]`}>
        <WelcomePage
          toLogin={() => {
            sendGTMEvent({
              event: 'login_signup_interact',
              login_or_signup: 'signup',
              step_number: 5,
              step_name: 'signup-thankyou',
              intent: 'explore benefits',
              method: isEmail ? 'email' : 'phone',
            });
            toLogin();
          }}
          fields={props.fields.WelcomeItem.fields}
          membershipId={membershipId}
        ></WelcomePage>
      </div>
    </>
  );
};

export default RegistrationPage;
