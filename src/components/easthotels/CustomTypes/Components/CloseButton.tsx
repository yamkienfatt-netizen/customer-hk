import React from 'react';
import Typography from '../../Typography/Typography';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import Image from 'next/image';

const publicUrl = getPublicUrl();
const CloseButton = ({ className, onClick }: { className?: string; onClick?: () => void }) => {
  const { t, locale } = useI18n();
  return (
    <div
      className={`${className} mt-1 flex flex-row items-center border-b-[2px] border-transparent hover:cursor-pointer hover:border-black-secondary`}
      onClick={() => {
        onClick && onClick();
      }}
    >
      <Image
        src={`${publicUrl}/icon_close.svg`}
        alt="close"
        className="mr-[5px]"
        width={5}
        height={5}
      />

      <Typography variant="l1" fontWeight="bold">
        {t(DICTIONARY_CONSTANT.GENERAL.CLOSE_BUTTON)}
      </Typography>
    </div>
  );
};

export default CloseButton;
