import React from 'react';
import { _cta } from '@/props/common/_cta';
import { ImageBanner9Props } from '@/props/Media/ImageBannerProps';
import ImageRevealAnimation from '../Animation/ImageRevealAnimation';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import HeaderSection from 'components/easthotels/Navigation/HeaderSection';
import { TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import ComponentError from '../Error/ComponentError';

// export const Default = (ImageBanner9Prop: ImageBanner9Prop): JSX.Element => {
const ImageBanner9 = (ImageBanner9Props: ImageBanner9Props) => {
  try {
    const AnimationComponent = FadeInUp;
    const sitecoreCss = ImageBanner9Props.params?.Styles ?? '';
    return (
      <div className={'small-section-container ' + sitecoreCss}>
        <div className="mx-[15px] lg:ml-[50px]">
          <div className="flex flex-col items-center justify-between gap-[15px] lg:hidden">
            <div>
              <div className="max-w-[300px] self-start">
                <AnimationComponent>
                  <HeaderSection
                    heading1=""
                    heading2={ImageBanner9Props.fields.Heading as TextField}
                  />
                </AnimationComponent>
              </div>
              <ImageRevealAnimation scImage={ImageBanner9Props.fields.RightImage} />
            </div>

            <div className="flex gap-[15px]">
              <div className="w-[50%]">
                <ImageRevealAnimation scImage={ImageBanner9Props.fields.LeftImage} />
              </div>
              <div className="w-[50%]">
                <ImageRevealAnimation scImage={ImageBanner9Props.fields.BottomImage} />
              </div>
            </div>
          </div>
          <div className="hidden overflow-hidden lg:mx-[50px] lg:flex">
            <div className="pt-[88px]">
              <div className="mb-[100px] w-[370px]">
                <AnimationComponent>
                  <HeaderSection
                    heading1=""
                    heading2={ImageBanner9Props.fields.Heading as TextField}
                  />
                </AnimationComponent>
              </div>
              <div className="h-[450px] w-[340px] object-cover">
                <ImageRevealAnimation
                  scImage={ImageBanner9Props.fields.LeftImage}
                  width={340}
                  height={450}
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col items-end">
              <div className=" w-[790px]">
                <div className="flex justify-end ">
                  <div className="h-[516px] w-[690px] object-cover">
                    <ImageRevealAnimation
                      scImage={ImageBanner9Props.fields.RightImage}
                      width={690}
                      height={516}
                    />
                  </div>
                </div>
                <div className="mt-[60px]">
                  <div className="h-[500px] w-[500px] object-cover ">
                    <ImageRevealAnimation
                      scImage={ImageBanner9Props.fields.BottomImage}
                      width={500}
                      height={500}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

// export default withDatasourceCheck()<ImageBanner9Prop>(Default);

export default ImageBanner9;
