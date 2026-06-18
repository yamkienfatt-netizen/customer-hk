import React from 'react';
import Typography from '../Typography/Typography';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import {
  useSitecoreContext,
  Image as ScImage,
  Text as ScText,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { useI18n } from 'next-localization';
import ComponentError from '../Error/ComponentError';

interface RoomFeaturesSmallProps {
  iconAndTextData: any;
  listingTextData: any;
  listingTextDataSectionTitle: string;
}

const RoomFeaturesSmall = ({
  iconAndTextData,
  listingTextData,
  listingTextDataSectionTitle,
}: RoomFeaturesSmallProps) => {
  try {
    const numberOfColumns = 2;
    let newListingTextData = [[], []];
    listingTextData?.map((item: any, index: number) => {
      const r = index % numberOfColumns;
      newListingTextData[r].push(item);
    });

    const { t } = useI18n();
    return (
      <div className="flex flex-col items-center lg:items-start">
        <div className="w-full">
          <hr className="my-[40px] w-full lg:my-[30px]" />
          {iconAndTextData && (
            <>
              <FadeInUp>
                <Typography variant="h4" extraStyles="mb-[30px]">
                  {t(DICTIONARY_CONSTANT.STAYS.ROOM_FEATURES)}
                </Typography>
              </FadeInUp>

              <FadeInUp>
                <div className="mb-[50px] mt-[30px] flex flex-wrap gap-x-[15px] gap-y-[25px] lg:mb-[60px] lg:gap-x-[33px] lg:gap-y-[55px] ">
                  {iconAndTextData.map((icon: any, index: number) => (
                    <div
                      key={index}
                      className="flex w-[105px] flex-col items-center text-center lg:w-[120px]"
                    >
                      {icon.fields.IconImage && (
                        <ScImage
                          field={icon.fields.IconImage}
                          className="mb-[5px] w-[50px]"
                          editable={false}
                        />
                      )}
                      <Typography variant="l2">
                        <ScText field={icon.fields.Title} editable={false} />
                      </Typography>
                    </div>
                  ))}
                </div>
              </FadeInUp>
            </>
          )}
          {listingTextData && listingTextData.length > 0 && (
            <FadeInUp>
              <div>
                <Typography variant="h4" extraStyles="mb-[30px]">
                  {listingTextDataSectionTitle || t(DICTIONARY_CONSTANT.STAYS.AMENITIES)}
                </Typography>
                <div className="grid grid-cols-2 gap-x-[20px]">
                  {newListingTextData.map((col, index) => {
                    return (
                      <div className="flex flex-col gap-y-[5px]" key={index}>
                        {col.map((item, index) => (
                          <div key={index} className="flex">
                            {/* <Typography variant="p">・</Typography> */}
                            <Typography variant="p">
                              <ScText field={item.fields.Title} editable={false} />
                            </Typography>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
                <hr className="mt-[30px] hidden w-full lg:block" />
              </div>
            </FadeInUp>
          )}
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default RoomFeaturesSmall;
