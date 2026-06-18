import QuoteSection from '../Event/QuoteSection';
import Typography from '../Typography/Typography';
import { SocialMediaPhotoWallProps, SocialPost } from '@/props/social/SocialMediaPhotoWall';
import {
  Text as ScText,
  Image as ScImage,
  ImageField,
  TextField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecoreLink } from '../CustomTypes/Components/SitecoreLink';
import { Treelist } from '@/props/fields/ScField';
import FadeInUp from '../Animation/FadeInUp';
import { QrCodeDialog } from 'components/easthotels/CustomTypes/Components/QrCodeDialog';
import { JSX } from 'react';
import ComponentError from '../Error/ComponentError';
const SocialLinks = ({
  socialMediaPhotoWallProps,
}: {
  socialMediaPhotoWallProps: SocialMediaPhotoWallProps;
}) => {
  // console.log('socialMediaPhotoWallProps', socialMediaPhotoWallProps);
  try {
  } catch (err) {
    return <ComponentError error={err} />;
  }

  return (
    <div className="grid grid-cols-2 gap-x-[30px] gap-y-[10px] lg:flex lg:grid-cols-none lg:flex-wrap lg:gap-y-0">
      {/* instagram link */}
      <SitecoreLink field={socialMediaPhotoWallProps.fields.InstagramLink} className="flex">
        <div className=" mr-[5px]">
          <ScImage field={socialMediaPhotoWallProps.fields.InstagramIcon} />
        </div>
        <Typography variant="l1" fontColor="white">
          <ScText field={socialMediaPhotoWallProps.fields.InstagramText} />
        </Typography>
      </SitecoreLink>
      {/* fb link */}
      <SitecoreLink field={socialMediaPhotoWallProps.fields.FacebookLink} className="flex">
        <div className=" mr-[5px]">
          <ScImage field={socialMediaPhotoWallProps.fields.FacebookIcon} />
        </div>
        <Typography variant="l1" fontColor="white">
          <ScText field={socialMediaPhotoWallProps.fields.FacebookText} />
        </Typography>
      </SitecoreLink>
      {/* wechat qr code pop up */}

      {socialMediaPhotoWallProps.fields.WechatIcon.value &&
      Object.keys(socialMediaPhotoWallProps.fields.WechatIcon.value).length > 0 ? (
        <QrCodeDialog
          qrCodeImg={socialMediaPhotoWallProps.fields.WechatQRCode}
          desc={socialMediaPhotoWallProps.fields.WechatQRCodeText}
          descIc={socialMediaPhotoWallProps.fields.WechatIconBlack}
        >
          <div className="flex cursor-pointer">
            <div className=" mr-[5px]">
              <ScImage field={socialMediaPhotoWallProps.fields.WechatIcon} />
            </div>
            <Typography variant="l1" fontColor="white">
              <ScText field={socialMediaPhotoWallProps.fields.WechatText} />
            </Typography>
          </div>
        </QrCodeDialog>
      ) : null}

      {/* trip advisor link */}
      {socialMediaPhotoWallProps.fields.TripAdvisorIcon.value &&
      Object.keys(socialMediaPhotoWallProps.fields.TripAdvisorIcon.value).length > 0 ? (
        <SitecoreLink field={socialMediaPhotoWallProps.fields.TripAdvisorLink} className="flex">
          <div className=" mr-[5px] max-w-[16px]">
            <ScImage field={socialMediaPhotoWallProps.fields.TripAdvisorIcon} />
          </div>
          <Typography variant="l1" fontColor="white">
            <ScText field={socialMediaPhotoWallProps.fields.TripAdvisorText} />
          </Typography>
        </SitecoreLink>
      ) : null}
    </div>
  );
};
const AnimatedImage = ({ src, account }: { src: ImageField; account: TextField }) => {
  return (
    <figure className=" mb-[25px]">
      <FadeInUp>
        <ScImage field={src} className="w-[100vh] pb-[10px]" />
        <figcaption>
          <Typography variant={'l2'} fontColor="white">
            <ScText field={account} />
          </Typography>
        </figcaption>
      </FadeInUp>
    </figure>
  );
};

const SocialPostsList = ({ Posts }: { Posts: Treelist<SocialPost>[] }): JSX.Element => {
  try {
    // Convert post into [[0,1],[2,3]] so that we can have wrapper for every 2 posts
    // <div> <div>post1</div> <div>post2</div> </div>
    // <div> <div>post1</div> <div>post2</div> </div>
    const formattedPosts: Treelist<SocialPost>[][] = [];
    for (let i = 0; i < Posts.length; i += 2) {
      const tmpArr: Treelist<SocialPost>[] = [];
      tmpArr.push(Posts[i]);
      if (i + 1 < Posts.length) {
        tmpArr.push(Posts[i + 1]);
      }
      formattedPosts.push(tmpArr);
    }
    // Sample: Extract the hero images and quotes
    const firstQuote = Posts[0]?.fields;
    const secondQuote = Posts[0]?.fields;
    const firstPosts = Posts.slice(1, 3);

    const list = formattedPosts.map((post, index) => {
      return (
        <div key={index}>
          {post[0]?.fields.Quote?.value.trim().length !== 0 ? (
            <div
              className={`flex flex-col justify-between h-[${
                index % 2 == 0 ? '40' : '60'
              }%] mb-[25px]`}
            >
              <hr className="mb-auto bg-white text-white" />
              <QuoteSection {...post[0]?.fields} type="bg_small" />
              <hr className="mt-auto bg-white text-white" />
            </div>
          ) : (
            <div className="">
              <AnimatedImage src={post[0]?.fields.Image} account={post[0]?.fields.Account} />
            </div>
          )}
          {post[1] != undefined ? (
            <>
              {post[1]?.fields.Quote?.value.trim().length !== 0 ? (
                <div
                  className={`flex flex-col justify-between h-[${index % 2 == 0 ? '40' : '60'}%]`}
                >
                  <hr className="mb-auto bg-white text-white" />
                  <QuoteSection {...post[1]?.fields} type="bg_small" />
                  <hr className="mt-auto bg-white text-white" />
                </div>
              ) : (
                <div className={`h-[${index % 2 == 0 ? '60' : '40'}%]`}>
                  <AnimatedImage src={post[1]?.fields.Image} account={post[1]?.fields.Account} />
                </div>
              )}
            </>
          ) : (
            ''
          )}
        </div>
      );
    });

    return (
      <div className="mt-[40px] flex justify-center">
        <div className="hidden lg:block">
          <div className="grid grid-cols-4 gap-x-[30px]">{list}</div>
        </div>
        <div className="lg:hidden">
          {firstQuote && <QuoteSection {...firstQuote} type="bg_small" />}
          <div className="my-[20px] flex justify-center gap-[15px]">
            {firstPosts.map((post, index) => (
              <AnimatedImage key={index} src={post.fields.Image} account={post.fields.Account} />
            ))}
          </div>
          {Posts.length >= 3 && (
            <>
              <div className="flex justify-center">
                <AnimatedImage src={Posts[2]?.fields.Image} account={Posts[2]?.fields.Account} />
              </div>
            </>
          )}
          {secondQuote && <QuoteSection {...secondQuote} type="bg_small" />}
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export const Default = (socialMediaPhotoWallProps: SocialMediaPhotoWallProps): JSX.Element => {
  try {
    const sitecoreCss = socialMediaPhotoWallProps.params?.Styles ?? '';

    return (
      <div className={`full-width-section-container  ${sitecoreCss}`}>
        <div className="w-full bg-green-secondary px-[15px] py-[10px] lg:px-[50px]">
          <div className="medium-section-container !my-[60px]">
            <div className="mb-[28px] flex justify-center">
              <Typography variant="h4" fontColor="white">
                <ScText field={socialMediaPhotoWallProps.fields.Heading} />
              </Typography>
            </div>
            <div className="flex justify-center">
              <SocialLinks socialMediaPhotoWallProps={socialMediaPhotoWallProps}></SocialLinks>
            </div>
            <SocialPostsList {...socialMediaPhotoWallProps.fields} />
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
