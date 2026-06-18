import { ComponentProps } from 'lib/component-props';
import NavigationSideBar from './NavigationSideBar';
import { GetServerSideComponentProps, Image, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { MemberOffers } from './types';
import Typography from '../Typography/Typography';
import CarouselCard from './CarouselCard';
import CarouselBanner from './CarouselBanner';
import { useState, JSX } from 'react';

interface MemberOffersProps extends ComponentProps {
  fields: MemberOffers;
}

const MemberoffersPage = (props: MemberOffersProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      {isLoading ? (
        <div id="loading-state">
          <div id="loading"></div>
        </div>
      ) : null}
      <div className="mt-[75px] px-[15px] sm:flex sm:px-[30px]">
        <NavigationSideBar
          setIsLoading={setIsLoading}
          selectedValue={'MEMBER_OFFERS'}
        ></NavigationSideBar>
        <div className="px-[15px] sm:w-[calc(100vw-330px)] sm:px-[30px]">
          <div className="mb-20 bg-[#f3f2f0]">
            <div className="font-[Bellefair] text-[40px] leading-[40px] sm:py-14 sm:text-[50px] sm:leading-[50px]">
              <Text field={props.fields.SectionName} />
            </div>
            <Typography variant="l2" className="py-5 sm:max-w-[60%] sm:py-0">
              <Text field={props.fields.Description} />
            </Typography>
            <div className="my-10 hidden border border-t-[#d7d6d5] sm:block"></div>
            <div>
              <CarouselBanner slides={props.fields.BannerList} />
            </div>
            <div className="pt-10 font-[Bellefair] text-[30px] leading-[30px] sm:text-[40px] sm:leading-[40px]">
              <Text field={props.fields.Title1} />
            </div>
            <Typography variant="l2" className="py-5 sm:max-w-[60%]">
              <Text field={props.fields.Description1} />
            </Typography>
            <CarouselCard slides={props.fields.CardList1}></CarouselCard>
            <div className="pt-20 sm:flex">
              <div className="sm:w-1/2">
                <Image field={props.fields.Image2} className="mx-auto w-full" />
              </div>
              <div className="flex flex-col items-start justify-center sm:w-1/2 sm:pl-10 sm:pr-20">
                <div className="py-5 text-[30px] leading-[30px] sm:py-12 sm:text-[40px] sm:leading-[40px]">
                  <div className="pt-8 sm:pt-0">
                    <Text field={props.fields.Heading2} />
                  </div>
                  <div className="font-[Bellefair]">
                    <Text field={props.fields.Title2} />
                  </div>
                </div>
                <Typography variant="l2" className="py-5">
                  <Text field={props.fields.Description2} />
                </Typography>
                {props.fields.Link2.value?.href != '' ? (
                  <a href={props.fields.Link2.value?.href}>
                    <Typography variant="sso_track" fontWeight="semibold">
                      <Text field={props.fields.Link2Text} />
                    </Typography>
                  </a>
                ) : (
                  <Typography variant="sso_track" fontWeight="semibold">
                    <Text field={props.fields.Link2Text} />
                  </Typography>
                )}
              </div>
            </div>
            <div className="mt-20 font-[Bellefair] text-[30px] leading-[30px] sm:text-[40px] sm:leading-[40px]">
              <Text field={props.fields.Title3} />
            </div>
            <Typography variant="l2" className="py-5  sm:max-w-[60%]">
              <Text field={props.fields.Description3} />
            </Typography>
            <CarouselCard slides={props.fields.CardList3}></CarouselCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberoffersPage;

export const getServerSideProps: GetServerSideComponentProps = async (
  _rendering,
  _layoutData,
  context
) => {
  context.query.cache = '0';
  return [];
};
