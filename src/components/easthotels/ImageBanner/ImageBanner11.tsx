import React, { JSX } from 'react';
import { _cta } from '@/props/common/_cta';
import { ImageBanner11Props } from '@/props/Media/ImageBannerProps';
import BannerTextSection from '../Banner/BannerTextSection';
import ImageRevealAnimation from '../Animation/ImageRevealAnimation';
import BannerTextSectionContent from 'components/easthotels/Banner/BannerTextSectionContent';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import HeaderSection from 'components/easthotels/Navigation/HeaderSection';
import {
  LayoutServicePageState,
  TextField,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import ComponentError from '../Error/ComponentError';
import { cn } from 'lib/utils';
import CTAButton from '../Button/CTAButton';

const ImageBanner11 = (ImageBanner11Props: ImageBanner11Props): JSX.Element => {
  try {
    const { sitecoreContext } = useSitecoreContext();
    const isPageEditing = sitecoreContext.pageState === LayoutServicePageState.Edit;

    const AnimationComponent = FadeInUp;
    const sitecoreCss = ImageBanner11Props.params?.Styles ?? '';
    return (
      <>
        <div className={cn('small-section-container lg:!max-w-[1440px]', sitecoreCss)}>
          <div className="flex flex-col items-center justify-between overflow-hidden lg:hidden">
            <ImageRevealAnimation
              scImage={ImageBanner11Props.fields.RightImage}
              className="min-h-[386px]  min-w-[322px]"
            />
            <div className="mx-[15px] mt-[40px]">
              <BannerTextSection
                {...ImageBanner11Props.fields}
                ctaButtonSize={'large'}
                showCTABtn={false}
              />
            </div>
            <ImageRevealAnimation
              scImage={ImageBanner11Props.fields.LeftImage}
              className="min-h-[386px] min-w-[322px]"
            />
          </div>

          {(isPageEditing || ImageBanner11Props.fields.BannerCTAText.value !== '') && (
            <div className={'fixed bottom-0 left-0 z-20 w-full lg:relative lg:z-0 lg:hidden'}>
              <CTAButton
                url={ImageBanner11Props.fields.BannerCTAUrl}
                text={ImageBanner11Props.fields.BannerCTAText}
                variant={'contained-big'}
                bgColor={'green-primary'}
                fontColor={'white'}
                extraContainerStyles="min-h-[50px] bg-royal-green"
              />
            </div>
          )}

          <div className="hidden overflow-hidden lg:mx-[50px] lg:flex">
            <div className="pt-[88px]">
              {/* w-[370px] */}
              <div className="mb-[100px]">
                <AnimationComponent>
                  <HeaderSection
                    heading1=""
                    heading2={ImageBanner11Props.fields.Heading as TextField}
                  />
                </AnimationComponent>
              </div>
              <div className="h-[445px] w-[335px]">
                <ImageRevealAnimation scImage={ImageBanner11Props.fields.LeftImage} />
              </div>
            </div>
            {/* <div className="w-[104px]" /> */}

            <div className="flex flex-1 flex-col justify-between ">
              {/* w-[790px] */}
              <div className="flex h-full w-full flex-col justify-between">
                <div className="flex w-full justify-end ">
                  {/* h-[516px]w-[690px]*/}
                  <div className="h-[516px] w-[690px] lg:ml-[113px]">
                    <ImageRevealAnimation
                      scImage={ImageBanner11Props.fields.RightImage}
                      className="h-full object-cover"
                    />
                  </div>
                </div>

                {/* mt-[60px] justify-end */}
                <div className="mt-[30px] flex flex-col lg:ml-[113px] ">
                  <AnimationComponent>
                    <div className="max-w-[630px]">
                      <BannerTextSectionContent
                        {...ImageBanner11Props.fields}
                        ctaButtonSize={'large'}
                        filledCTAClassName={'mt-[0px] max-h-[40px] px-[75px] max-w-[300px]'}
                        flexCTABtn={true}
                      />
                    </div>
                  </AnimationComponent>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

// export default withDatasourceCheck()<ImageBanner11Prop>(Default);
export default ImageBanner11;
