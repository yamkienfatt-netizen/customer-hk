import { userProfile } from '@/pages/api/auth/[...nextauth]';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import {
  GetLocaleUrl,
  SitecoreLanguageToAzureB2CLanguageMapping,
} from '@/utilities/LanguageUtilities';
import { sendGTMEvent } from '@next/third-parties/google';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { signIn, signOut } from 'next-auth/react';
import { useI18n } from 'next-localization';
import { useState } from 'react';

interface NavigationProps {
  selectedValue: string;
  setIsLoading: (isLoading: boolean) => void;
}
const NavigationSideBar = (props: NavigationProps) => {
  const { t, locale } = useI18n();
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    (document.querySelector(`#${event.target.value}`) as HTMLLinkElement).click();
  };

  const toLogin = () => {
    props.setIsLoading(true);
    const currentPath = window.location.pathname;
    signIn(
      'azureb2c',
      //   { callbackUrl: GetLocaleUrl(SsoApiPaths.SIGN_IN_CALLBACK, locale()) },
      { callbackUrl: currentPath },
      {
        ui_locales:
          SitecoreLanguageToAzureB2CLanguageMapping[
            locale() as keyof typeof SitecoreLanguageToAzureB2CLanguageMapping
          ],
      }
    );
  };
  const [hasProfile, setGetUserProfile] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [memberId, setMemberId] = useState('');

  (async () => {
    if (!hasProfile) {
      try {
        const origin = getPublicUrl();
        const response = await fetch(`${origin}/api/profile/getProfile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status == 200) {
          const data = (await response.json()) as userProfile;
          if (data) {
            setFirstname(data?.FirstName ?? '');
            setMemberId(data?.Id ?? '');
          }
        } else if (response.status == 401) {
          toLogin();
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setGetUserProfile(true);
    }
  })();

  return (
    <>
      <div className="mt-16 hidden min-w-[300px] pr-[30px] sm:block ">
        <div className="sticky top-24 text-[20px] leading-[23px]">
          <p>{t(DICTIONARY_CONSTANT.SSO.Global.WELCOME_BACK)}</p>
          <p className="font-semibold">{firstname}</p>
          <p className="text-[14px]">{memberId}</p>
          <div className="my-5 border-t border-t-[#adadac]"></div>
          <ul className="flex flex-col gap-5 py-5 text-[11px] font-bold leading-[18px] tracking-[0.88px]">
            <li>
              <a
                id="UPCOMING_BOOKING"
                href="/member/upcoming-stays"
                onClick={(event) => {
                  event.preventDefault();
                  props.setIsLoading(true);
                  sendGTMEvent({
                    event: 'member_dashboard_interact',
                    intent: 'sidebar nav UPCOMING STAY', //+ t(DICTIONARY_CONSTANT.SSO.Global.UPCOMING_BOOKING),
                  });
                  window.location.href = GetLocaleUrl('/member/upcoming-stays', locale());
                }}
                className={`border-b-2 ${
                  props.selectedValue === 'UPCOMING_BOOKING'
                    ? 'border-b-black'
                    : 'border-b-transparent'
                }`}
              >
                {t(DICTIONARY_CONSTANT.SSO.Global.UPCOMING_BOOKING)}
              </a>
            </li>
            <li>
              <a
                id="MEMBER_OFFERS"
                href="/member/member-offers"
                onClick={(event) => {
                  event.preventDefault();
                  props.setIsLoading(true);
                  sendGTMEvent({
                    event: 'member_dashboard_interact',
                    intent: 'sidebar nav MEMBER OFFERS', // + t(DICTIONARY_CONSTANT.SSO.Global.MEMBER_OFFERS),
                  });
                  window.location.href = GetLocaleUrl('/member/member-offers', locale());
                }}
                className={`border-b-2 ${
                  props.selectedValue === 'MEMBER_OFFERS'
                    ? 'border-b-black'
                    : 'border-b-transparent'
                }`}
              >
                {t(DICTIONARY_CONSTANT.SSO.Global.MEMBER_OFFERS)}
              </a>
            </li>
            <li>
              <a
                id="MY_PROFILE"
                href="/member/my-profile"
                onClick={(event) => {
                  event.preventDefault();
                  props.setIsLoading(true);
                  sendGTMEvent({
                    event: 'member_dashboard_interact',
                    intent: 'sidebar nav MY PROFILE', // + t(DICTIONARY_CONSTANT.SSO.Global.MY_PROFILE),
                  });
                  window.location.href = GetLocaleUrl('/member/my-profile', locale());
                }}
                className={`border-b-2 ${props.selectedValue === 'MY_PROFILE' ? 'border-b-black' : 'border-b-transparent'}`}
              >
                {t(DICTIONARY_CONSTANT.SSO.Global.MY_PROFILE)}
              </a>
            </li>
            <li>
              <a
                id="LOGOUT"
                onClick={() => {
                  props.setIsLoading(true);
                  sendGTMEvent({
                    event: 'member_dashboard_interact',
                    intent: 'sidebar nav LOGOUT', // + t(DICTIONARY_CONSTANT.SSO.Global.LOGOUT),
                  });
                  signOut({
                    callbackUrl: GetLocaleUrl('/', locale()),
                    redirect: true,
                  });
                  //onLinkClick('LOGOUT');
                }}
                className={`border-b-2 ${props.selectedValue === 'LOGOUT' ? 'border-b-black' : 'border-b-transparent'} logout`}
              >
                {t(DICTIONARY_CONSTANT.SSO.Global.LOGOUT)}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="block py-10 sm:hidden">
        <div className="text-[20px]">
          <p>{t(DICTIONARY_CONSTANT.SSO.Global.WELCOME_BACK)}</p>
          <p>{firstname}</p>
          <p className="text-[14px]">{memberId}</p>
          <div className="my-5 border border-t-[#adadac]"></div>
          <div>
            <select
              onChange={handleSelectChange}
              className="w-full border-b bg-transparent text-[11px] focus:outline-none"
              value={props.selectedValue}
            >
              <option value="UPCOMING_BOOKING">
                {t(DICTIONARY_CONSTANT.SSO.Global.UPCOMING_BOOKING)}
              </option>
              <option value="MEMBER_OFFERS">
                {t(DICTIONARY_CONSTANT.SSO.Global.MEMBER_OFFERS)}
              </option>
              <option value={'MY_PROFILE'}>{t(DICTIONARY_CONSTANT.SSO.Global.MY_PROFILE)}</option>
              <option value={'LOGOUT'}>{t(DICTIONARY_CONSTANT.SSO.Global.LOGOUT)}</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationSideBar;
