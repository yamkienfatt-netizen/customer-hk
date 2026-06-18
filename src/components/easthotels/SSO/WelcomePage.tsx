import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import { Field, Text, ImageField, Image as JssImage } from '@sitecore-jss/sitecore-jss-nextjs';
import { useI18n } from 'next-localization';
import Typography from '../Typography/Typography';
import { JSX } from 'react';

interface Welcome {
  Heading: Field<string>;
  Title: Field<string>;
  Subtitle: Field<string>;
  Description: Field<string>;
  Image: ImageField;
  RedirectTime: Field<string>;
}
interface WelcomePageProps {
  fields: Welcome;
  toLogin: () => void;
  membershipId: string;
}

const WelcomePage = (props: WelcomePageProps): JSX.Element => {
  const { t } = useI18n();
  const description = props.fields.Description.value.replace('{membershipId}', props.membershipId);
  return (
    <div className="mb-20 bg-[#f3f2f0] sm:mt-10 sm:flex sm:flex-row-reverse">
      <div className="sm:w-1/2">
        <JssImage field={props.fields.Image} className="mx-auto" />
      </div>
      <div className="flex flex-col items-start justify-center px-5 sm:w-1/2 sm:pl-10 sm:pr-20 ">
        <div className="sm:max-w-[500px]">
          <div className="py-10 text-[40px] leading-[40px]">
            <p>
              <Text field={props.fields.Heading} />
            </p>
            <p className="font-[Bellefair]">
              <Text field={props.fields.Title} />
            </p>
          </div>
          <div className="py-5 text-[20px] leading-[20px]">
            <Text field={props.fields.Subtitle} />
          </div>
          <Typography variant="l2">
            {/* <Text field={props.fields.Description} /> */}
            <p>{description}</p>
          </Typography>

          <button
            onClick={props.toLogin}
            className="mx-auto my-5 h-10 w-full bg-[#808077] text-white  sm:mx-0 sm:w-[350px]"
          >
            <Typography variant="sso_btn_text">
              {t(DICTIONARY_CONSTANT.SSO.Global.EXPLORE_NOW)}
            </Typography>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
