import React, { useState, useEffect } from 'react';
import MiniModal from './MiniModal';
import CodeInput from './CodeInput';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import {
  MobileAreaCode,
  SalesforceTitles,
  //PrivacyPolicyChecklist,
  InterestChecklist,
  Errorlist,
  SsoApiPaths,
  ConsentList,
  AzureB2CProfile,
} from '@/utilities/SsoConstant';
import { SsoErrorMessage, SsoUpdateProfile } from '@/services/SsoApiService';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { signIn } from 'next-auth/react';
import {
  GetLocaleUrl,
  SitecoreLanguageToAzureB2CLanguageMapping,
} from '@/utilities/LanguageUtilities';
import Typography from '../Typography/Typography';

interface sentSmsOtp {
  Signature: string;
}

interface userProfile {
  Id: string;
  Salutation: string;
  FirstName: string;
  LastName: string;
  AADB2CId: string;
  Email: string;
  MobileCountry: string;
  MobilePhoneNumber: string;
  EmailOTPVerified: boolean;
  PhoneOTPVerified: boolean;
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
  WechatId: string;
  MarketingOptIn: boolean;
  DataManageOutsideResidence: boolean;
  DataManageWithinResidence: boolean;
  RegisterSourceSystem: string;
  CreatedDateTime: string;
  LastModifiedDateTime: string;
  //Password: string;
  HasPassword: boolean;
}

const publicUrl = getPublicUrl();

const MyProfile = () => {
  const { t, locale } = useI18n();
  const [email, setemail] = useState('');
  const [phoneNum, setphoneNum] = useState('');
  const [_email, _setemail] = useState('');
  //const [_phoneNum, _setphoneNum] = useState('');
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [errSendPhone, setErrSendPhone] = useState('');
  const [errPhoneBind, setErrPhoneBind] = useState('');
  const [errSendEmail, setErrSendEmail] = useState('');
  const [errEmailBind, setErrEmailBind] = useState('');
  const [errUpdate, setErrUpdate] = useState('');
  const [signature, setSignature] = useState('');
  const [phoneOTPVerified, setPhoneOTPVerified] = useState(false);
  const [emailOTPVerified, setEmailOTPVerified] = useState(false);
  const [NotOtpComplete, setOtpComplete] = useState(true);
  const [otpCountPhone, setOtpCountPhone] = useState(0);
  const [otpCountEmail, setOtpCountEmail] = useState(0);
  const [maskEmail, setMaskEmail] = useState('');
  const [hasPassword, setHasPassword] = useState(false);
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

  const verifyBindPhone = async () => {
    if (otpCountPhone >= 5) {
      const msge306 = Errorlist.find((item) => item.code == 'E306')?.label;
      if (msge306 != undefined) {
        setErrPhoneBind(t(msge306));
      } else {
        setErrPhoneBind('(error not match) OTP not match too much times,please resend OTP');
      }
      return;
    }
    setOtpCountPhone(otpCountPhone + 1);
    setErrPhoneBind('');
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
    const databody = { Channel: 'phone', Signature: signature, UserInputCode: codeValues };
    setErrPhoneBind('');
    try {
      setIsLoading(true);
      const response = await fetch('/api/profile/verifyAndBind', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(databody),
      });
      setIsLoading(false);
      if (response.status == 200) {
        //setphoneNum(_phoneNum);
        //setAreaCode(_AreaCode);
        setOtpCountPhone(0);
        getProfileData();
        closeModal();
      } else if (response.status == 401) {
        toLogin();
      } else {
        if (otpCountPhone >= 4) {
          const msge306 = Errorlist.find((item) => item.code == 'E306')?.label;
          if (msge306 != undefined) {
            setErrPhoneBind(t(msge306));
          } else {
            setErrPhoneBind('(error not match) OTP not match too much times');
          }
          return;
        }
        const data = (await response.json()) as SsoErrorMessage;
        if (data.ErrorCode) {
          const msg = Errorlist.find((item) => item.code == data.ErrorCode)?.label;
          setErrPhoneBind(
            msg != undefined ? t(msg) : data.ErrorMessage ? data.ErrorMessage : err_msg
          );
        } else setErrPhoneBind(err_msg);
        return;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrPhoneBind(t('SSO/Errors/GeneralError'));
    } finally {
      setIsLoading(false);
    }
  };
  const sentPhoneOTP = async () => {
    setOtpCountPhone(0);
    setErrPhoneBind('');
    const databody = {
      Channel: 'phone',
      MobileCountry: _AreaCode,
      MobilePhoneNumber: phoneNum,
      Locale: locale(),
    };
    try {
      setErrSendPhone('');
      setIsLoading(true);
      const response = await fetch('/api/profile/sendOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(databody),
      });
      setIsLoading(false);
      if (response.status == 200) {
        const data = (await response.json()) as sentSmsOtp;
        setSignature(data.Signature);
        openModal();
      } else if (response.status == 401) {
        toLogin();
      } else {
        const data = (await response.json()) as SsoErrorMessage;
        if (data.ErrorCode) {
          const msg = Errorlist.find((item) => item.code == data.ErrorCode)?.label;
          setErrSendPhone(
            msg != undefined ? t(msg) : data.ErrorMessage ? data.ErrorMessage : err_msg
          );
        }
        //if (data.ErrorMessage) setErrSendPhone(data.ErrorMessage);
        else setErrSendPhone(err_msg);
        return;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrSendPhone(t('SSO/Errors/GeneralError'));
      return;
    }
  };
  const verifyBindEmail = async () => {
    if (otpCountEmail >= 5) {
      const msge306 = Errorlist.find((item) => item.code == 'E306')?.label;
      if (msge306 != undefined) {
        setErrEmailBind(t(msge306));
      } else {
        setErrEmailBind('(error not match) OTP not match too much times,please resend OTP');
      }
      return;
    }
    setOtpCountEmail(otpCountEmail + 1);
    setErrEmailBind('');
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
    const databody = { Channel: 'email', Signature: signature, UserInputCode: codeValues };
    setErrEmailBind('');
    try {
      setIsLoading(true);
      const response = await fetch('/api/profile/verifyAndBind', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(databody),
      });
      setIsLoading(false);
      if (response.status == 200) {
        //setemail(_email);
        setOtpCountEmail(0);
        getProfileData();
        closeModal2();
      } else if (response.status == 401) {
        toLogin();
      } else {
        if (otpCountEmail >= 4) {
          const msge306 = Errorlist.find((item) => item.code == 'E306')?.label;
          if (msge306 != undefined) {
            setErrEmailBind(t(msge306));
          } else {
            setErrEmailBind('(error not match) OTP not match too much times');
          }
          return;
        }
        const data = (await response.json()) as SsoErrorMessage;
        if (data.ErrorCode) {
          const msg = Errorlist.find((item) => item.code == data.ErrorCode)?.label;
          setErrEmailBind(msg != undefined ? t(msg) : err_msg);
        } else setErrEmailBind(err_msg);
        return;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrEmailBind(err_msg);
    } finally {
      setIsLoading(false);
    }
  };
  const sentEmailOTP = async () => {
    setOtpCountEmail(0);
    setErrEmailBind('');
    const databody = {
      Channel: 'email',
      Email: isEmailEdit ? _email : email,
      Locale: locale(),
    };

    let emailArr = isEmailEdit ? _email.split('@') : email.split('@');
    let maskEmail = '';
    if (emailArr[0].length > 7) {
      for (let i = 0; i < emailArr[0].length - 3; i++) {
        maskEmail += '*';
      }
      maskEmail = maskEmail + emailArr[0].slice(-3) + '@' + emailArr[1];
    } else if (emailArr[0].length > 2) {
      for (let i = 0; i < emailArr[0].length - 1; i++) {
        maskEmail += '*';
      }
      maskEmail = maskEmail + emailArr[0].slice(-1) + '@' + emailArr[1];
    } else {
      for (let i = 0; i < emailArr[0].length; i++) {
        maskEmail += '*';
      }
      maskEmail = maskEmail + '@' + emailArr[1];
    }
    setMaskEmail(maskEmail);

    try {
      setErrSendEmail('');
      setIsLoading(true);
      const response = await fetch('/api/profile/sendOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(databody),
      });
      setIsLoading(false);
      if (response.status == 200) {
        const data = (await response.json()) as sentSmsOtp;
        //console.log(data);
        setSignature(data.Signature);
        openModal2();
      } else if (response.status == 401) {
        toLogin();
      } else {
        const data = (await response.json()) as SsoErrorMessage;
        if (data.ErrorCode) {
          const msg = Errorlist.find((item) => item.code == data.ErrorCode)?.label;
          setErrSendEmail(msg != undefined ? t(msg) : err_msg);
        } else setErrSendEmail(err_msg);
        return;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrSendEmail(err_msg);
      return;
    } finally {
      setIsLoading(false);
    }
  };
  const openModal = () => {
    if (!isModalOpen) {
      setIsModalOpen(true);
      setIsActive(true);
      setSeconds(60);
      setErrSendPhone('');
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setIsActive(true);
  };
  const openModal2 = () => {
    if (!isModalOpen2) {
      setIsModalOpen2(true);
      setIsActive(true);
      setSeconds(60);
      setErrEmailBind('');
    }
  };
  const closeModal2 = () => {
    setIsModalOpen2(false);
    setIsActive(true);
  };

  const [isNameEdit, setisNameEdit] = useState<boolean>(false);
  const editNameClick = () => {
    setisNameEdit(isNameEdit ? false : true);
    setisPhoneEdit(false);
    setisEmailEdit(false);
    setisInterestEdit(false);
    setisConsentEdit(false);
    setisPasswordEdit(false);
    setErrUpdate('');
    setPassName(true);
  };
  const [isPhoneEdit, setisPhoneEdit] = useState<boolean>(false);
  // const editPhoneClick = () => {
  //   setisPhoneEdit(isPhoneEdit ? false : true);
  //   setisNameEdit(false);
  //   setisEmailEdit(false);
  //   setisInterestEdit(false);
  //   setisConsentEdit(false);
  //   setPassName(true);
  // };
  const [isEmailEdit, setisEmailEdit] = useState<boolean>(false);
  const [isPasswordEdit, setisPasswordEdit] = useState<boolean>(false);
  const editEmailClick = () => {
    setisEmailEdit(isEmailEdit ? false : true);
    setisPhoneEdit(false);
    setisNameEdit(false);
    setisInterestEdit(false);
    setisPasswordEdit(false);
    setisConsentEdit(false);
    setPassName(true);
  };
  const editPasswordClick = () => {
    setisEmailEdit(false);
    setisPhoneEdit(false);
    setisPasswordEdit(isPasswordEdit ? false : true);
    setisNameEdit(false);
    setisInterestEdit(false);
    setisConsentEdit(false);
    setPassName(true);
  };
  const [isInterestEdit, setisInterestEdit] = useState<boolean>(false);
  const editInterestClick = () => {
    //showCheck();
    setisInterestEdit(isInterestEdit ? false : true);
    setisNameEdit(false);
    setisPasswordEdit(false);
    setisPhoneEdit(false);
    setisEmailEdit(false);
    setisConsentEdit(false);
    setErrUpdate('');
    setPassName(true);
  };
  const [isConsentEdit, setisConsentEdit] = useState<boolean>(false);
  const editConsentClick = () => {
    setisConsentEdit(isConsentEdit ? false : true);
    setisNameEdit(false);
    setisPasswordEdit(false);
    setisPhoneEdit(false);
    setisEmailEdit(false);
    setisInterestEdit(false);
    setErrUpdate('');
    setPassName(true);
  };

  const [checkboxTxt, setCheckboxTxt] = useState('');

  const [hasProfile, setGetUserProfile] = useState(false);
  const [passName, setPassName] = useState(true);
  const [title, setTitle] = useState('');
  const [titlecode, setTitleCode] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  //To prevent cancel after edit, update the cancelled fields when updating other fields,so new a new object to edit
  const [_title, _setTitle] = useState('');
  const [_titlecode, _setTitleCode] = useState('');
  const [_firstname, _setFirstname] = useState('');
  const [_lastname, _setLastname] = useState('');
  const [AreaCode, setAreaCode] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState<string[]>([]);
  const [selectedInterest, setSelectedInterest] = useState<string[]>([]);
  const [_selectedInterest, _setSelectedInterest] = useState<string[]>([]);
  const [_AreaCode, _setAreaCode] = useState('852');
  const [_privacyConsent, _setPrivacyConsent] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const err_msg = t('SSO/Errors/GeneralError');

  const getProfileData = async () => {
    try {
      const origin = publicUrl; //'http://localhost:3000'; //window.location.origin;
      setIsLoading(true);
      const response = await fetch(`${origin}/api/profile/getProfile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setIsLoading(false);
      if (response.status == 200) {
        const data = (await response.json()) as userProfile;
        if (data) {
          setHasPassword(data.HasPassword);
          const salutation = SalesforceTitles.filter(
            (salutation) => salutation.code == data.Salutation
          );
          if (salutation.length > 0) {
            setTitle(t(salutation[0].label));
            setTitleCode(salutation[0].code);
            _setTitle(t(salutation[0].label));
            _setTitleCode(salutation[0].code);
          }

          setPhoneOTPVerified(data.PhoneOTPVerified);
          setEmailOTPVerified(data.EmailOTPVerified);
          setFirstname(data.FirstName);
          setLastname(data.LastName);
          _setFirstname(data.FirstName);
          _setLastname(data.LastName);

          const areaCode = MobileAreaCode.filter((z) => z.code == data.MobileCountry).map(
            (z) => z.label
          );
          if (areaCode.length > 0) {
            setAreaCode(areaCode[0]);
            _setAreaCode(data.MobileCountry);
          }
          setphoneNum(data.MobilePhoneNumber);
          setemail(data.Email);
          //_setphoneNum(data.MobilePhoneNumber);
          _setemail(data.Email);
          let i = 0;
          let interest = '';
          let interestList = [
            data.ArtAndDesign,
            data.Music,
            data.Wellness,
            data.Fashion,
            data.Cars,
            data.Watches,
            data.Jewellery,
            data.Sustainability,
            data.DestinationTravel,
            data.SportsAndFitness,
            data.Beauty,
            data.DiversityAndInclusion,
            data.RestaurantsAndBars,
          ];
          let interestChecked: string[] = [];
          for (const interested of interestList) {
            if (interested) {
              if (interest !== '') {
                interest += ', ';
              }
              interest += t(InterestChecklist[i].label);
              interestChecked = interestChecked.concat(InterestChecklist[i].code);
            }
            i++;
          }
          setSelectedInterest(interestChecked);
          _setSelectedInterest(interestChecked);
          setCheckboxTxt(interest);
          //not finish check since already deleted profile
          let policyChecked = [ConsentList[1].code];
          // if (data.DataManageOutsideResidence)
          //   policyChecked = policyChecked.concat(PrivacyPolicyChecklist[1].code);
          if (data.DataManageWithinResidence)
            policyChecked = policyChecked.concat(ConsentList[2].code);
          if (data.MarketingOptIn) policyChecked = policyChecked.concat(ConsentList[0].code);
          setPrivacyConsent(policyChecked);
          _setPrivacyConsent(policyChecked);
          setGetUserProfile(true);
        }
      } else if (response.status == 401) {
        toLogin();
      } else {
        //signOut({callbackUrl: `/${locale()}`, redirect:true});
        //sign out or print any message since error on profile, to be continue
        return;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      //alert(err_msg);
      return;
    }
  };

  (async () => {
    if (!hasProfile) {
      getProfileData();
      setGetUserProfile(true);
    }
  })();

  const [isSelectMore, setIsSelectMore] = useState(false);

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (_selectedInterest.length >= 3 && e.target.checked) {
      setIsSelectMore(true);
      return;
    } else {
      setIsSelectMore(false);
    }

    const checkedId = e.target.value;
    if (e.target.checked) {
      _setSelectedInterest([..._selectedInterest, checkedId]);
    } else {
      _setSelectedInterest(_selectedInterest.filter((id) => id !== checkedId));
    }
  };

  const handlePolicyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //policy only show edit marketing opt in, to be confirm and update, #1 may need to set required also
    if (isConsentEdit) {
      const checkedId = e.target.value;
      if (e.target.checked) {
        _setPrivacyConsent([..._privacyConsent, checkedId]);
      } else {
        _setPrivacyConsent(_privacyConsent.filter((id) => id !== checkedId));
      }
    }
  };

  function resetEdit() {
    setisNameEdit(false);
    setisPhoneEdit(false);
    setisEmailEdit(false);
    setisInterestEdit(false);
    setisConsentEdit(false);
    setisPasswordEdit(false);
  }

  const updateName = () => {
    //to be complete, for validation checking, also make sure the edit of title is drop down
    if (_titlecode == '' || _firstname == '' || _lastname == '') {
      setPassName(false);
      return;
    }
    setPassName(true);
    // setTitleCode(title);
    // setTitle(t(title));
    // setFirstname(firstname);
    // setLastname(lastname);
    updateUserProfile('name');
  };
  const updateInterests = () => {
    // setSelectedInterest([]);
    // let tempInterest: string[] = [];
    // _selectedInterest.map((interest) => {
    //   tempInterest = tempInterest.concat(interest);
    // });
    // setSelectedInterest(tempInterest);
    updateUserProfile('interests');
  };
  const toLogin = () => {
    setIsLoading(true);
    signIn(
      'azureb2c',
      { callbackUrl: GetLocaleUrl(SsoApiPaths.SIGN_IN_CALLBACK, locale()) },
      { ui_locales: SitecoreLanguageToAzureB2CLanguageMapping[locale()] }
    );
  };
  const updateUserProfile = async (updateType: string) => {
    let i = 0;
    let p: SsoUpdateProfile = {
      Salutation: updateType == 'name' ? _titlecode : titlecode,
      FirstName: updateType == 'name' ? _firstname : firstname,
      LastName: updateType == 'name' ? _lastname : lastname,
      Interests: {
        ArtAndDesign:
          updateType == 'interests'
            ? _selectedInterest.includes(InterestChecklist[i++].code)
            : selectedInterest.includes(InterestChecklist[i++].code),
        Music:
          updateType == 'interests'
            ? _selectedInterest.includes(InterestChecklist[i++].code)
            : selectedInterest.includes(InterestChecklist[i++].code),
        Wellness:
          updateType == 'interests'
            ? _selectedInterest.includes(InterestChecklist[i++].code)
            : selectedInterest.includes(InterestChecklist[i++].code),
        Fashion:
          updateType == 'interests'
            ? _selectedInterest.includes(InterestChecklist[i++].code)
            : selectedInterest.includes(InterestChecklist[i++].code),
        Cars:
          updateType == 'interests'
            ? _selectedInterest.includes(InterestChecklist[i++].code)
            : selectedInterest.includes(InterestChecklist[i++].code),
        Watches:
          updateType == 'interests'
            ? _selectedInterest.includes(InterestChecklist[i++].code)
            : selectedInterest.includes(InterestChecklist[i++].code),
        Jewellery:
          updateType == 'interests'
            ? _selectedInterest.includes(InterestChecklist[i++].code)
            : selectedInterest.includes(InterestChecklist[i++].code),
        Sustainability:
          updateType == 'interests'
            ? _selectedInterest.includes(InterestChecklist[i++].code)
            : selectedInterest.includes(InterestChecklist[i++].code),
        DestinationTravel:
          updateType == 'interests'
            ? _selectedInterest.includes(InterestChecklist[i++].code)
            : selectedInterest.includes(InterestChecklist[i++].code),
        SportsAndFitness:
          updateType == 'interests'
            ? _selectedInterest.includes(InterestChecklist[i++].code)
            : selectedInterest.includes(InterestChecklist[i++].code),
        Beauty:
          updateType == 'interests'
            ? _selectedInterest.includes(InterestChecklist[i++].code)
            : selectedInterest.includes(InterestChecklist[i++].code),
        DiversityAndInclusion:
          updateType == 'interests'
            ? _selectedInterest.includes(InterestChecklist[i++].code)
            : selectedInterest.includes(InterestChecklist[i++].code),
        RestaurantsAndBars:
          updateType == 'interests'
            ? _selectedInterest.includes(InterestChecklist[i++].code)
            : selectedInterest.includes(InterestChecklist[i++].code),
      },
      MarketingOptIn:
        updateType == 'privacy'
          ? _privacyConsent.includes(ConsentList[0].code)
          : privacyConsent.includes(ConsentList[0].code), //doc only show this, to be confirm
      //DataManageOutsideResidence: true,
      //DataManageWithinResidence: true,
    };

    const err_msg = t('SSO/Errors/GeneralError');
    try {
      setIsLoading(true);
      const response = await fetch('/api/profile/updateProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(p),
      });
      setIsLoading(false);
      if (response.status == 200) {
        getProfileData();

        resetEdit();
      } else if (response.status == 401) {
        toLogin();
      } else {
        const data = (await response.json()) as SsoErrorMessage;
        if (data.ErrorCode) {
          const msg = Errorlist.find((item) => item.code == data.ErrorCode)?.label;
          setErrUpdate(msg != undefined ? t(msg) : err_msg);
        } else setErrUpdate(err_msg);
        return;
        //alert(err_msg);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrUpdate(err_msg);
      //alert(err_msg);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const updateConsent = () => {
    // setPrivacyConsent([]);
    // let policyChecked: string[] = [];
    // _privacyConsent.map((policy) => {
    //   policyChecked = policyChecked.concat(policy);
    // });
    // setPrivacyConsent(policyChecked);
    updateUserProfile('privacy');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    _setTitleCode(value);
    _setTitle(value);
  };
  const handleFirstnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    _setFirstname(value);
  };

  const handleLastnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    _setLastname(value);
  };

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
    const conditions = [
      passwordConditions.hasUpperCase,
      passwordConditions.hasLowerCase,
      passwordConditions.hasNumber,
      passwordConditions.hasSpecialChar,
    ];
    const otherConditionsMet = conditions.filter((condition) => condition).length >= 3;
    if (
      passwordValue &&
      passwordConditions.hasMinLength &&
      otherConditionsMet &&
      passwordValue === passwordConfirmValue
    ) {
      return true;
    } else {
      return false;
    }
  };
  const setPasswordUpdate = async () => {
    if (!checkPassword()) {
      setPasswordCheck(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch('/api/password/setPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Password: passwordValue,
        }),
      });
      setIsLoading(false);
      if (response.status == 200) {
        getProfileData();
        resetEdit();
      } else {
        //const data = (await response.json()) as SsoErrorMessage;
        setPasswordCheck(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // const phoneNumRegex = /^[0-9]{5,15}$/;
  // const [isPhoneNumValid, setIsPhoneNumValid] = useState(true);
  // const handlePhoneNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   _setphoneNum(value);
  //   if (value.length == 0) {
  //     setIsPhoneNumValid(true);
  //   } else {
  //     setIsPhoneNumValid(phoneNumRegex.test(value));
  //   }
  // };

  // const handlePhoneAreaCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const value = e.target.value;
  //   _setAreaCode(value);
  // // };
  // const emailRegex =
  //   /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/;
  const emailRegex = new RegExp(AzureB2CProfile.REGEX_EMAIL);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    _setemail(value);
    if (value.length == 0) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(emailRegex.test(value));
    }
  };

  return (
    <>
      {isLoading ? (
        <div id="loading-state">
          <div id="loading"></div>
        </div>
      ) : null}
      <div className="sm:max-w-[720px]">
        <div className="font-[Bellefair] text-[40px] leading-[40px] sm:py-10 sm:text-[50px] sm:leading-[50px] ">
          {t(DICTIONARY_CONSTANT.SSO.Global.MY_PROFILE)}
        </div>
        <div className="border border-t-[#d7d6d5] "></div>
        <div className="my-5 flex gap-5">
          <div className="min-w-[50px]">
            <div className="mb-4 ">
              <Typography variant="sso_track" fontWeight="bold">
                {t(DICTIONARY_CONSTANT.SSO.Global.TITLE)}
              </Typography>
            </div>
            <Typography variant="l2" className={` ${isNameEdit ? 'hidden' : ''}`}>
              {title}
            </Typography>
            <select
              required
              className={`${isNameEdit ? '' : 'hidden'} w-full border-b-2  border-b-[#828077] bg-transparent text-[13px] outline-none`}
              value={_titlecode}
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
          <div className="max-w-[100px]">
            <div className="mb-4 ">
              <Typography variant="sso_track" fontWeight="bold">
                {t(DICTIONARY_CONSTANT.SSO.Global.FIRST_NAME)}
              </Typography>
            </div>
            <Typography variant="l2" className={` ${isNameEdit ? 'hidden' : ''}`}>
              {firstname}
            </Typography>
            <input
              value={_firstname}
              onChange={handleFirstnameChange}
              className={`w-full border-b-2 border-b-[#828077] bg-transparent text-[13px] outline-none ${isNameEdit ? '' : 'hidden'}`}
            />
          </div>
          <div className="max-w-[100px]">
            <div className="mb-4 ">
              <Typography variant="sso_track" fontWeight="bold">
                {t(DICTIONARY_CONSTANT.SSO.Global.LAST_NAME)}
              </Typography>
            </div>
            <Typography variant="l2" className={` ${isNameEdit ? 'hidden' : ''}`}>
              {lastname}
            </Typography>
            <input
              value={_lastname}
              onChange={handleLastnameChange}
              className={`w-full border-b-2 border-b-[#828077] bg-transparent text-[13px] outline-none ${isNameEdit ? '' : 'hidden'}`}
            />
          </div>
          <div className="ml-auto">
            <button onClick={editNameClick} className="mb-4  ">
              <Typography variant="sso_track" fontWeight="bold" underline fontColor="black">
                {isNameEdit
                  ? t(DICTIONARY_CONSTANT.SSO.Global.CANCEL)
                  : t(DICTIONARY_CONSTANT.SSO.Global.EDIT)}
              </Typography>
            </button>
          </div>
        </div>
        {isNameEdit && (
          <p className="pb-2 text-[11px] text-[#4b4b4b]">
            {t(DICTIONARY_CONSTANT.SSO.Global.CONSISTENT_NAME)}
          </p>
        )}
        {!passName && isNameEdit && (
          <p className="error py-2 text-[11px] text-[#D99200] ">
            {t(DICTIONARY_CONSTANT.SSO.Global.REQUIRED_All)}
          </p>
        )}
        {errUpdate !== '' && isNameEdit && (
          <p className="error py-2 text-[11px] text-[#D99200] ">{errUpdate}</p>
        )}
        <button
          className={` h-[40px] bg-[#828077] px-10 py-2 text-white ${isNameEdit ? '' : 'hidden'}`}
          onClick={updateName}
        >
          <Typography variant="sso_btn_text" fontWeight="bold">
            {t(DICTIONARY_CONSTANT.SSO.Global.UPDATE)}
          </Typography>
        </button>
        <div className="my-5 border border-t-[#d7d6d5] "></div>
        <div className="my-5 flex gap-5">
          <div>
            <div className="mb-4">
              <Typography variant="sso_track" fontWeight="bold">
                {t(DICTIONARY_CONSTANT.SSO.Global.PHONE_NUMBER)}
              </Typography>
            </div>
            <Typography variant="l2">{`${AreaCode} ${phoneNum}`}</Typography>
            {/* <div
              className={`grid grid-cols-[30%_67%] gap-2 text-[13px] ${isPhoneEdit ? '' : 'hidden'} `}
            >
              <select
                id="phoneAreaVal"
                className="border-b-2 border-b-[#828077] bg-transparent outline-none"
                onChange={handlePhoneAreaCodeChange}
                value={_AreaCode}
              >
                {MobileAreaCode.map((mac) => (
                  <option value={mac.code}>{mac.label}</option>
                ))}
              </select>
              <input
                id="phoneNumVal"
                value={_phoneNum}
                onChange={handlePhoneNumChange}
                className={`w-full border-b-2 border-b-[#828077] bg-transparent  outline-none `}
              />
            </div> */}
          </div>
          {/* <div className="ml-auto">
            <button
              onClick={editPhoneClick}
              className="mb-4 border-b-2 border-b-black text-[11px] font-bold "
            >
              {isPhoneEdit
                ? t(DICTIONARY_CONSTANT.SSO.Global.CANCEL)
                : t(DICTIONARY_CONSTANT.SSO.Global.EDIT)}
            </button>
          </div> */}
        </div>
        {errSendPhone !== '' && !phoneOTPVerified && (
          <p className="error mt-1 pb-2 text-[11px] text-[#D99200]">{errSendPhone}</p>
        )}
        {/* {!isPhoneNumValid && isPhoneEdit && (
          <p className="error mt-1 pb-2 text-[11px] text-[#D99200]">
            {t(DICTIONARY_CONSTANT.SSO.Global.PHONE_FORMAT)}
          </p>
        )} */}
        <button
          onClick={sentPhoneOTP}
          className={` bg-[#828077] px-10 py-2  text-white ${phoneOTPVerified ? 'hidden' : ''}`}
        >
          <Typography variant="sso_btn_text" fontWeight="bold">
            {t(DICTIONARY_CONSTANT.SSO.Global.VERIFY)}{' '}
          </Typography>
        </button>
        <MiniModal isOpen={isModalOpen} onClose={closeModal}>
          <div className="m-auto flex max-w-[580px] flex-col items-center gap-5 pt-10">
            <div className="m-auto text-[20px] ">
              {t(DICTIONARY_CONSTANT.SSO.Global.ENTER_PASSCODE)}
            </div>
            <div className="m-auto text-center text-[13px]">
              {phoneNum.length > 4 ? (
                <p>
                  {t(DICTIONARY_CONSTANT.SSO.Global.OTP_SENT_PHONE).replace(
                    /{phone}/gi,
                    phoneNum.substring(0, phoneNum.length - 4).replace(/[0-9]/g, '*') +
                      phoneNum.slice(-4)
                  )}
                </p>
              ) : (
                <p>
                  {t(DICTIONARY_CONSTANT.SSO.Global.OTP_SENT_PHONE).replace(/{phone}/gi, phoneNum)}
                </p>
              )}
              {/* <p>{t(DICTIONARY_CONSTANT.SSO.Global.CHECK_OTP_PHONE)}</p> */}
            </div>
            <div className="w-[345px]">
              <CodeInput />
              <button
                onClick={verifyBindPhone}
                className="mt-5 h-10 w-full bg-[#808077] text-white"
              >
                {t(DICTIONARY_CONSTANT.SSO.Global.CONTINUE)}
              </button>
            </div>
            {errPhoneBind !== '' && (
              <p className="error mt-1 pb-2 text-[11px] text-[#D99200]">{errPhoneBind}</p>
            )}
            <div className={`text-[11px] ${isActive ? '' : 'hidden'}`}>
              {t(DICTIONARY_CONSTANT.SSO.Global.RESEND_OTP_COUNTDOWN).replace(
                /{seconds}/gi,
                String(seconds)
              )}
            </div>
            <a
              onClick={sentPhoneOTP}
              className={`text-[11px] font-bold text-[#1d2021] underline ${isActive ? 'hidden' : ''}`}
            >
              {t(DICTIONARY_CONSTANT.SSO.Global.RESEND_OTP_NOW)}
            </a>
            <a className="mt-5 text-[11px] font-bold text-[#1d2021] underline" onClick={closeModal}>
              {t(DICTIONARY_CONSTANT.SSO.Global.GO_BACK)}
            </a>
          </div>
        </MiniModal>
        <div className="my-5 border border-t-[#d7d6d5] "></div>
        <div className="my-5 flex gap-5">
          <div>
            <div className="mb-4 ">
              <Typography variant="sso_track" fontWeight="bold">
                {t(DICTIONARY_CONSTANT.SSO.Global.EMAIL)}
              </Typography>
            </div>
            <Typography variant="l2" className={` ${isEmailEdit ? 'hidden' : ''}`}>
              {email}
            </Typography>
            <input
              id="emailVal"
              value={_email}
              onChange={handleEmailChange}
              className={`w-full border-b-2 border-b-[#828077] bg-transparent text-[13px] outline-none ${isEmailEdit ? '' : 'hidden'}`}
            />
          </div>

          <div className="ml-auto">
            <button onClick={editEmailClick} className="mb-4  ">
              <Typography variant="sso_track" fontWeight="bold" underline fontColor="black">
                {isEmailEdit
                  ? t(DICTIONARY_CONSTANT.SSO.Global.CANCEL)
                  : t(DICTIONARY_CONSTANT.SSO.Global.EDIT)}
              </Typography>
            </button>
          </div>
        </div>
        {errSendEmail !== '' && (isEmailEdit || !emailOTPVerified) && (
          <p className="error mt-1 pb-2 text-[11px] text-[#D99200]">{errSendEmail}</p>
        )}
        {!isEmailValid && isEmailEdit && (
          <p className="error mt-1 pb-2 text-[11px] text-[#D99200]">
            {t(DICTIONARY_CONSTANT.SSO.Global.EMAIL_FORMAT)}
          </p>
        )}
        <button
          onClick={sentEmailOTP}
          className={` bg-[#828077] px-10 py-2  text-white ${isEmailEdit || emailOTPVerified == false ? '' : 'hidden'}`}
        >
          <Typography variant="sso_btn_text" fontWeight="bold">
            {t(DICTIONARY_CONSTANT.SSO.Global.VERIFY)}
          </Typography>
        </button>

        <div className="flex gap-5">
          <div>
            {hasPassword || isPasswordEdit ? (
              <Typography variant="sso_track" fontWeight="bold">
                {t(DICTIONARY_CONSTANT.SSO.Password.PASSWORD)}
              </Typography>
            ) : (
              <Typography
                onClick={() => setisPasswordEdit(!isPasswordEdit)}
                variant="sso_track"
                fontWeight="bold"
                className="inline-block border-b-2 border-b-black"
              >
                {t(DICTIONARY_CONSTANT.SSO.Password.SET_UP_PASSWORD)}
              </Typography>
            )}
            {isPasswordEdit ? (
              <>
                <input
                  className="w-full border-b border-b-[#828077] bg-transparent text-[13px] outline-none"
                  type="password"
                  onChange={handlePWDChange}
                  value={passwordValue}
                />
                <div className="mt-3 w-full text-[13px]">
                  <div>{t(DICTIONARY_CONSTANT.SSO.Password.LENGTH_REQUIRE)}</div>

                  <div className="mt-1 flex flex-col gap-1">
                    <div className={passwordConditions.hasUpperCase ? 'text-[#D99200]' : ''}>
                      {t(DICTIONARY_CONSTANT.SSO.Password.UPPERCASE_REQUIRE)}
                      <div
                        className={passwordConditions.hasUpperCase ? 'with-checkmark ' : ''}
                      ></div>
                    </div>
                    <div className={passwordConditions.hasLowerCase ? 'text-[#D99200]' : ''}>
                      {t(DICTIONARY_CONSTANT.SSO.Password.LOWERCASE_REQUIRE)}
                      <div
                        className={passwordConditions.hasLowerCase ? 'with-checkmark ' : ''}
                      ></div>
                    </div>
                    <div className={passwordConditions.hasNumber ? 'text-[#D99200]' : ''}>
                      {t(DICTIONARY_CONSTANT.SSO.Password.NUMBER_REQUIRE)}
                      <div className={passwordConditions.hasNumber ? 'with-checkmark ' : ''}></div>
                    </div>
                    <div className={passwordConditions.hasSpecialChar ? 'text-[#D99200]' : ''}>
                      {t(DICTIONARY_CONSTANT.SSO.Password.SPECIAL_CHARACTER_REQUIRE)}
                      <div
                        className={passwordConditions.hasSpecialChar ? 'with-checkmark ' : ''}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 w-full">
                  <Typography variant="sso_track" fontWeight="bold" fontColor="black">
                    {t(DICTIONARY_CONSTANT.SSO.Password.CONFIRM_PASSWORD)}
                  </Typography>
                  <input
                    className="w-full border-b border-b-[#828077] bg-transparent text-[13px] outline-none"
                    type="password"
                    onChange={handlePWDConfirmChange}
                    value={passwordConfirmValue}
                  />
                  {!passwordConfirm && (
                    <p className="error mt-1 pt-2 text-[11px] text-[#D99200]">
                      {t(DICTIONARY_CONSTANT.SSO.Password.PASSWORD_NOT_CORRECT)}
                    </p>
                  )}
                </div>
                <button
                  onClick={setPasswordUpdate}
                  className="mt-5 h-[40px] bg-[#828077] px-10 py-2 text-white"
                >
                  {hasPassword ? (
                    <Typography variant="sso_btn_text">
                      {t(DICTIONARY_CONSTANT.SSO.Password.UPDATE)}
                    </Typography>
                  ) : (
                    <Typography variant="sso_btn_text">
                      {t(DICTIONARY_CONSTANT.SSO.Password.CONFIRM)}
                    </Typography>
                  )}
                </button>
                {!passwordCheck && (
                  <p className="error mt-1 pt-2 text-[11px] text-[#D99200]">
                    {t(DICTIONARY_CONSTANT.SSO.Password.PWD_WRONG)}
                  </p>
                )}
              </>
            ) : (
              hasPassword && (
                <Typography variant="l2" className="mt-2">
                  *******
                </Typography>
              )
            )}
          </div>
          {(hasPassword || isPasswordEdit) && (
            <button onClick={editPasswordClick} className="ml-auto  h-fit">
              <Typography variant="sso_track" fontWeight="bold" underline fontColor="black">
                {isPasswordEdit
                  ? t(DICTIONARY_CONSTANT.SSO.Global.CANCEL)
                  : t(DICTIONARY_CONSTANT.SSO.Global.EDIT)}
              </Typography>
            </button>
          )}
        </div>

        <MiniModal isOpen={isModalOpen2} onClose={closeModal2}>
          <div className="m-auto flex max-w-[580px] flex-col items-center gap-5 pt-10">
            <div className="m-auto text-[20px] ">
              {t(DICTIONARY_CONSTANT.SSO.Global.ENTER_PASSCODE)}
            </div>
            <div className="m-auto text-center ">
              <Typography variant="l2">
                {t(DICTIONARY_CONSTANT.SSO.Global.OTP_SENT_EMAIL).replace(/{email}/gi, maskEmail)}
              </Typography>
            </div>
            <div className="w-[345px]">
              <CodeInput />
              <button
                onClick={verifyBindEmail}
                className="mt-5 h-10 w-full bg-[#808077] text-white"
              >
                {t(DICTIONARY_CONSTANT.SSO.Global.CONTINUE)}
              </button>
            </div>
            {errEmailBind !== '' && (
              <p className="error mt-1 pb-2 text-[11px] text-[#D99200]">{errEmailBind}</p>
            )}
            <div className={`text-[11px] ${isActive ? '' : 'hidden'}`}>
              {t(DICTIONARY_CONSTANT.SSO.Global.RESEND_OTP_COUNTDOWN).replace(
                /{seconds}/gi,
                String(seconds)
              )}
            </div>
            <a
              onClick={sentEmailOTP}
              className={`text-[11px] font-bold text-[#1d2021] underline ${isActive ? 'hidden' : ''}`}
            >
              {t(DICTIONARY_CONSTANT.SSO.Global.RESEND_OTP_NOW)}
            </a>
            <a
              className="mt-5 text-[11px] font-bold text-[#1d2021] underline"
              onClick={closeModal2}
            >
              {t(DICTIONARY_CONSTANT.SSO.Global.GO_BACK)}
            </a>
          </div>
        </MiniModal>
        <div className="my-5 border border-t-[#d7d6d5] "></div>
        <div className="flex gap-5">
          <div>
            <div className="mb-4">
              <Typography variant="sso_track" fontWeight="bold">
                {t(DICTIONARY_CONSTANT.SSO.Global.INTERESTS)}
              </Typography>
            </div>
          </div>
          <div className="ml-auto">
            <button onClick={editInterestClick} className="mb-4 ">
              <Typography variant="sso_track" fontWeight="bold" underline fontColor="black">
                {isInterestEdit
                  ? t(DICTIONARY_CONSTANT.SSO.Global.CANCEL)
                  : t(DICTIONARY_CONSTANT.SSO.Global.EDIT)}
              </Typography>
            </button>
          </div>
        </div>
        <Typography variant="l2" className={` ${isInterestEdit ? 'hidden' : ''}`}>
          {checkboxTxt}
        </Typography>
        <div className={`grid grid-cols-2 gap-3  sm:grid-cols-3 ${isInterestEdit ? '' : 'hidden'}`}>
          {InterestChecklist.map((interest) => (
            <div className="flex items-center" key={interest.code}>
              <input
                className="ssoinput mr-1.5 mt-[2px]"
                type="checkbox"
                value={interest.code}
                checked={_selectedInterest.includes(interest.code)}
                onChange={handleInterestChange}
              />
              <label id={interest.code}>
                <Typography variant="l2">{t(interest.label)}</Typography>
              </label>
            </div>
          ))}
        </div>
        {errUpdate !== '' && isInterestEdit && (
          <p className="error py-2 text-[11px] text-[#D99200] ">{errUpdate}</p>
        )}
        {isSelectMore && isInterestEdit && (
          <p className="error py-2 text-[11px] text-[#D99200]">
            {t(DICTIONARY_CONSTANT.SSO.Global.MAXIMUM_SELECT)}
          </p>
        )}
        <button
          className={` mt-3 bg-[#828077] px-10 py-2  text-white ${isInterestEdit ? '' : 'hidden'}`}
          onClick={updateInterests}
        >
          <Typography variant="sso_btn_text" fontWeight="bold">
            {t(DICTIONARY_CONSTANT.SSO.Global.UPDATE)}
          </Typography>
        </button>
        <div className="my-5 border border-t-[#d7d6d5] "></div>
        <div className="flex gap-5">
          <div>
            <div className="mb-4 ">
              <Typography variant="sso_track" fontWeight="bold">
                {t(DICTIONARY_CONSTANT.SSO.Global.CONSENT_PREFERENCE)}
              </Typography>
            </div>
          </div>
          <div className="ml-auto">
            <button onClick={editConsentClick} className="mb-4 ">
              <Typography variant="sso_track" fontWeight="bold" underline fontColor="black">
                {isConsentEdit
                  ? t(DICTIONARY_CONSTANT.SSO.Global.CANCEL)
                  : t(DICTIONARY_CONSTANT.SSO.Global.EDIT)}
              </Typography>
            </button>
          </div>
        </div>
        {ConsentList.map((policy) => (
          <div
            className={`flex items-start pb-2  ${isConsentEdit ? 'hidden' : ''}`}
            key={policy.code}
          >
            <input
              disabled={policy.required}
              className="ssoinput mr-1.5 mt-[2px]"
              type="checkbox"
              value={policy.code}
              checked={privacyConsent.includes(policy.code)}
            />
            <Typography variant="l2">
              <label
                dangerouslySetInnerHTML={{
                  __html: t(policy.label, { name: '', escapeInterpolation: false }),
                }}
              ></label>
            </Typography>
          </div>
        ))}
        {ConsentList.map((policy) => (
          <div
            className={`flex items-start pb-2 text-[13px] ${isConsentEdit ? '' : 'hidden'}`}
            key={policy.code}
          >
            <input
              disabled={policy.required}
              className="ssoinput mr-1.5 mt-[2px]"
              type="checkbox"
              value={policy.code}
              checked={_privacyConsent.includes(policy.code)}
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
        ))}
        <div className=" border-t border-black"></div>
        <div className="w-full pt-3 text-[13px]">{t(DICTIONARY_CONSTANT.SSO.Consent.NOTE)}</div>
        {errUpdate !== '' && isConsentEdit && (
          <p className="error py-2 text-[11px] text-[#D99200] ">{errUpdate}</p>
        )}
        <button
          className={` mt-3 bg-[#828077] px-10 py-2 text-white ${isConsentEdit ? '' : 'hidden'}`}
          onClick={updateConsent}
        >
          <Typography variant="sso_btn_text" fontWeight="bold">
            {t(DICTIONARY_CONSTANT.SSO.Global.UPDATE)}
          </Typography>
        </button>
        <div className="my-5 border border-t-[#d7d6d5]"></div>
      </div>
    </>
  );
};
export default MyProfile;
