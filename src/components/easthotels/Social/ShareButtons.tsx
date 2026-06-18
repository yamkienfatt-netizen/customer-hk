import React, { useState, useEffect } from 'react';
import Typography from '../Typography/Typography';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { Separator } from 'components/ui/separator';
import { HtmlLink } from '../CustomTypes/Components/HtmlLink';
import ComponentError from '../Error/ComponentError';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { useI18n } from 'next-localization';
import Image from 'next/image';

const publicUrl = getPublicUrl();

const Mailto = ({
  email,
  subject,
  body,
  children,
}: {
  email: string;
  subject: string;
  body: string;
  children: React.ReactNode;
}) => {
  try {
    let params = '?'; //open email client:  mailto:?
    if (subject) {
      params += `subject=${encodeURIComponent(subject)}`;
    }
    if (body) {
      params += `${subject ? '&' : ''}body=${encodeURIComponent(body)}`;
    }
    return <a href={`mailto:${email}${params}`}>{children}</a>;
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

// reusable module
//TODO: Convert to sitecore component
const ShareButtions = () => {
  try {
    const [fullUrl, setFullUrl] = useState('');
    const { t, locale } = useI18n();

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const url = window.location.href;
        setFullUrl(url);
      }
    }, []);

    return (
      <div className="flex items-center">
        <Typography variant="l1" fontWeight="bold">
          {t(DICTIONARY_CONSTANT.SOCIAL_SHARE.SHARE_LABEL)}
        </Typography>
        <Separator orientation="vertical" className="mx-[15px] h-[15px] w-[2px]" />
        <div className="flex flex-row items-center">
          {/* TODO: wen, any way for user to edit email & subject? or we can hardcode this also? */}
          <Mailto email="" subject="" body={fullUrl}>
            <Image
              src={`${publicUrl}/icon_email_black.svg`}
              className="mr-[15px] h-[15px] w-[15px] object-fill"
              alt="mail"
              width={15}
              height={15}
            />
          </Mailto>

          <a href={`https://www.facebook.com/sharer/sharer.php?u=${fullUrl}`} target="_blank">
            <Image
              src={`${publicUrl}/icon_fb_black.svg`}
              className="mr-[12px] mt-[-3px] h-[15px] w-[8px] object-fill"
              alt="mail"
              width={8}
              height={15}
            />
          </a>

          <a href={`https://www.linkedin.com/sharing/share-offsite?url=${fullUrl}`} target="_blank">
            <Image
              src={`${publicUrl}/icon_linkedin_black.svg`}
              className="mt-[-5px] h-[15px] w-[15px] object-fill"
              alt="mail"
              width={15}
              height={15}
            />
          </a>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default ShareButtions;
