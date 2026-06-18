import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { sendGTMEvent } from '@next/third-parties/google';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { useI18n } from 'next-localization';
import React, { useState } from 'react';

interface SidebarProps {
  onLinkClick: (arg0: string) => void;
  selectedLink: string;
}

interface userProfile {
  FirstName: string;
  Id: string;
}

const publicUrl = getPublicUrl();

const Sidebar = ({ onLinkClick, selectedLink }: SidebarProps) => {
  const { t } = useI18n();
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onLinkClick(event.target.value);
  };

  const [hasProfile, setGetUserProfile] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [memberId, setMemberId] = useState('');
  (async () => {
    if (!hasProfile) {
      try {
        const origin = publicUrl; //'http://localhost:3000'; //window.location.origin;
        const response = await fetch(`${origin}/api/profile/getProfile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status == 200) {
          const data = (await response.json()) as userProfile;
          //console.debug(data.Signature);
          if (data) {
            setFirstname(data.FirstName);
            setMemberId(data.Id);
          }
        } else {
          //signOut({callbackUrl: `/${locale()}`, redirect:true});
          //sign out or print any message since error on profile, to be continue
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      setGetUserProfile(true);
    }
  })();
  return (
    <>
      <div className="fixed mt-16 hidden w-48 sm:block">
        <div className="text-[20px] leading-[23px]">
          <p>{t(DICTIONARY_CONSTANT.SSO.Global.WELCOME_BACK)}</p>
          <p className="font-semibold">{firstname}.</p>
          <p className="text-[14px]">ID:{memberId}</p>
          <div className="my-5 border-t border-t-[#adadac]"></div>
          <ul className="flex flex-col gap-5 py-5 text-[11px] font-bold leading-[18px] tracking-[0.88px]">
            <li>
              <a
                onClick={() => {
                  onLinkClick('UPCOMING BOOKING');
                  sendGTMEvent({
                    event: 'member_dashboard_interact',
                    intent: 'sidebar nav UPCOMING STAY', //+ t(DICTIONARY_CONSTANT.SSO.Global.UPCOMING_BOOKING),
                  });
                }}
                className={`border-b-2 ${
                  selectedLink === 'UPCOMING BOOKING' ? 'border-b-black' : 'border-b-transparent'
                }`}
              >
                {t(DICTIONARY_CONSTANT.SSO.Global.UPCOMING_BOOKING)}
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  onLinkClick('MEMBER OFFERS');
                  sendGTMEvent({
                    event: 'member_dashboard_interact',
                    intent: 'sidebar nav MEMBER OFFERS', // + t(DICTIONARY_CONSTANT.SSO.Global.MEMBER_OFFERS),
                  });
                }}
                className={`border-b-2 ${
                  selectedLink === 'MEMBER OFFERS' ||
                  selectedLink.indexOf('MemberOffersDetail') == 0
                    ? 'border-b-black'
                    : 'border-b-transparent'
                }`}
              >
                {t(DICTIONARY_CONSTANT.SSO.Global.MEMBER_OFFERS)}
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  onLinkClick('MY PROFILE');
                  sendGTMEvent({
                    event: 'member_dashboard_interact',
                    intent: 'sidebar nav MY PROFILE', // + t(DICTIONARY_CONSTANT.SSO.Global.MY_PROFILE),
                  });
                }}
                className={`border-b-2 ${selectedLink === 'MY PROFILE' ? 'border-b-black' : 'border-b-transparent'}`}
              >
                {t(DICTIONARY_CONSTANT.SSO.Global.MY_PROFILE)}
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  sendGTMEvent({
                    event: 'member_dashboard_interact',
                    intent: 'sidebar nav LOGOUT', // + t(DICTIONARY_CONSTANT.SSO.Global.LOGOUT),
                  });
                  onLinkClick('LOGOUT');
                }}
                className={`border-b-2 ${selectedLink === 'LOGOUT' ? 'border-b-black' : 'border-b-transparent'} logout`}
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
          <p className="text-[14px]">ID:{memberId}</p>
          <div className="my-5 border border-t-[#adadac]"></div>
          <div>
            <select
              onChange={handleSelectChange}
              value={selectedLink}
              className="w-full border-b bg-transparent text-[11px] focus:outline-none"
            >
              <option value="UPCOMING BOOKING">
                {t(DICTIONARY_CONSTANT.SSO.Global.UPCOMING_BOOKING)}
              </option>
              <option value="MEMBER OFFERS">
                {t(DICTIONARY_CONSTANT.SSO.Global.MEMBER_OFFERS)}
              </option>
              <option value={'MY PROFILE'}>{t(DICTIONARY_CONSTANT.SSO.Global.MY_PROFILE)}</option>
              <option value={'LOGOUT'}>{t(DICTIONARY_CONSTANT.SSO.Global.LOGOUT)}</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
