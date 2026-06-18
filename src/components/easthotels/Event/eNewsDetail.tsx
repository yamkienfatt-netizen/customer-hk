import React, { ReactNode, JSX } from 'react';
import { eNewsDetailProps } from '@/props/media/eNewsDetailProps';
import { Placeholder as ScPlaceholder } from '@sitecore-jss/sitecore-jss-nextjs';
import ComponentError from '../Error/ComponentError';

export type NewsDetailDummyDataType = {
  id: string;
  title: string;
  desc: string;
  thumbnail: string;
  content: ReactNode;
};

export const Default = (eNewsDetailData: eNewsDetailProps): JSX.Element => {
  try {
    const enewsDetailPlaceholderKey = `enewsdetail`;
    const enewsDetailSideMenuPlaceholderKey = `enewsdetailsidemenu`;
    const enewsDetailContentPlaceholderKey = `enewsdetailcontent`;

    const sitecoreCss = eNewsDetailData.params?.Styles ?? '';

    return (
      <div className={'herobanner-section-container ' + sitecoreCss}>
        <ScPlaceholder name={enewsDetailPlaceholderKey} rendering={eNewsDetailData.rendering} />

        <div className="mx-[15px] flex flex-row justify-center">
          <div className="sticky top-[77px] mr-[77px] hidden h-fit w-[230px] pt-[77px] lg:block">
            <ScPlaceholder
              name={enewsDetailSideMenuPlaceholderKey}
              rendering={eNewsDetailData.rendering}
            />
          </div>

          <div className="mt-[30px] w-[920px]">
            <ScPlaceholder
              name={enewsDetailContentPlaceholderKey}
              rendering={eNewsDetailData.rendering}
            />

            <div className="mb-[50px]" />
          </div>
        </div>
        <div className="mb-[40px] lg:mb-[120px]" />
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }
};
