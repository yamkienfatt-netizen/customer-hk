import { MotionValue, useScroll } from 'framer-motion';
import React, { useRef, JSX } from 'react';
import Typography from '../Typography/Typography';
import FadeInUp from '../Animation/FadeInUp';
import {
  Text as ScText,
  Image as ScImage,
  ImageField,
  TextField,
  withDatasourceCheck,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { LeadInBanner2Props } from '@/props/Media/LeadInBannerProps';
import ImageRevealAnimation from 'components/easthotels/Animation/ImageRevealAnimation';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import ComponentError from '../Error/ComponentError';
import useWindowSize from 'src/hooks/useWindowSize';

const BannerText = ({
  heading1,
  heading2,
  logo,
  scrollYProgress,
}: {
  heading1: TextField;
  heading2: TextField;
  logo: ImageField;
  scrollYProgress: MotionValue<number>;
}) => {
  try {
    return (
      <>
        <FadeInUp className="flex flex-col items-center" scrollYProgress={scrollYProgress}>
          <div className="text-center lg:w-[602px] [@media(min-width:992px)]:w-[646px]">
            <Typography variant="h3" font="Bellefair">
              <ScText field={heading1} />
            </Typography>
            <br />
            <Typography variant="h3" font="Bellefair">
              <ScText field={heading2} />
            </Typography>
          </div>
          <ScImage className="my-[30px] lg:my-[84px]" field={logo} />
        </FadeInUp>
      </>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

const Default = (leadinBanner2Props: LeadInBanner2Props): JSX.Element => {
  const { isMobile } = useWindowSize();

  try {
    const target = useRef(null);
    const { scrollYProgress } = useScroll({
      target,
      offset: ['start end', 'end end'],
    });

    const height = leadinBanner2Props?.fields?.Image?.value?.height || '562';
    const width = leadinBanner2Props?.fields?.Image?.value?.width || '562';

    const sitecoreCss = leadinBanner2Props.params?.Styles ?? '';
    return (
      <div className={`medium-section-container ${sitecoreCss} relative`}>
        <div className="mx-[15px] flex flex-col items-center lg:mx-0">
          <div ref={target}>
            <BannerText
              heading1={leadinBanner2Props.fields.Heading1}
              heading2={leadinBanner2Props.fields.Heading2}
              logo={leadinBanner2Props.fields.Logo}
              scrollYProgress={scrollYProgress}
            />
          </div>
          <ImageRevealAnimation
            scImage={leadinBanner2Props.fields.Image}
            scVideo={leadinBanner2Props.fields.VideoLink}
            height={~~height}
            width={isMobile ? '100vw' : ~~width}
            srcSetArr={[{ mw: 400 }, { mw: 510 }]}
            sizes="(min-width: 992px) 400px, 510px"
          />
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<LeadInBanner2Props>(Default);
