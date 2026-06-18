import React, { JSX } from 'react';

import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { Article2Prop } from '@/props/PageContent/Article2Prop';
import Typography from 'components/easthotels/Typography/Typography';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import {
  useSitecoreContext,
  Image as ScImage,
  Text as ScText,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { PageRouteFields } from '@/props/Core/PageProps';
import { _StayDetail } from '@/props/common/_StayDetail';
import ComponentError from '../Error/ComponentError';

export const Default = (): JSX.Element => {
  try {
    const { t } = useI18n();

    const context = useSitecoreContext();
    const { route } = context.sitecoreContext;
    const pageFields = route?.fields as PageRouteFields & _StayDetail;
    return (
      <div className="small-section-container !max-w-[850px]">
        <FadeInUp>
          <div className="mx-[15px] lg:mx-0 lg:text-center">
            <Typography variant="h2" font="Bellefair">
              {t(DICTIONARY_CONSTANT.STAYS.ROOM_FEATURES)}
            </Typography>

            <div className="my-[16px] lg:my-[30px]">
              <Typography variant="p">
                <ScText field={pageFields.FeatureDescription} />
              </Typography>
            </div>
          </div>
        </FadeInUp>
        <FadeInUp>
          <div className="my-[24px] mt-4 flex flex-wrap justify-center gap-[15px] lg:my-[60px] lg:gap-[30px] ">
            {pageFields.FeatureList.map((icon, index) => (
              <div
                key={index}
                className="flex w-[105px] flex-col items-center text-center md:w-[180px]"
              >
                <ScImage
                  field={icon.fields.IconImage}
                  className="mb-[10px] w-[50px]"
                  editable={false}
                />
                <Typography variant="l3">
                  <ScText field={icon.fields.Title} editable={false} />
                </Typography>
              </div>
            ))}
          </div>
        </FadeInUp>
        <hr className="my-[30px] lg:my-[50px]" />
        <FadeInUp>
          <div className="mx-[15px] lg:mx-0">
            <Typography variant="h4">{t(DICTIONARY_CONSTANT.STAYS.MORE_AMENITIES)}</Typography>
            <div className="mt-[30px] grid grid-cols-2 gap-y-[15px]   lg:gap-x-[160px]">
              {pageFields.AmenitiesList.map((item, index) => (
                <Typography variant="l3" key={index}>
                  <ScText field={item.fields.Title} editable={false} />
                </Typography>
              ))}
            </div>
          </div>
        </FadeInUp>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
