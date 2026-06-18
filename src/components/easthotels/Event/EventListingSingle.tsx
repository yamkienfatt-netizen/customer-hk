import React from 'react';
import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import CTAButton from 'components/easthotels/Button/CTAButton';
import Typography from 'components/easthotels/Typography/Typography';
import {
  LayoutServicePageState,
  useSitecoreContext,
  withDatasourceCheck,
  Image as ScImage,
  Text as ScText,
  TextField,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecoreLink } from '../CustomTypes/Components/SitecoreLink';
import { EventListingSingleProps } from '@/props/PageContent/EventListingSingleProps';
import { useI18n } from 'next-localization';
import { DICTIONARY_CONSTANT } from '@/utilities/DictionaryConstant';
import ComponentError from '../Error/ComponentError';

const Default = (eventListingSingleProps: EventListingSingleProps) => {
  try {
    const { t } = useI18n();
    const context = useSitecoreContext();
    const isPageEditing = context.sitecoreContext.pageState === LayoutServicePageState.Edit;
    return (
      <FadeInUp>
        {/* mt-[30px] */}
        <div className={`mx-auto max-w-[540px] lg:mt-[60px] lg:max-w-[975px]`}>
          <div className={`mx-[15px] grid gap-[20px] lg:grid-cols-3 lg:gap-[50px]`}>
            <div className={`w-full md:max-w-[345px] lg:col-span-1 lg:max-w-[334px]`}>
              {isPageEditing ? (
                <ScImage
                  field={eventListingSingleProps.fields.Image}
                  className="h-full  w-full object-cover"
                />
              ) : (
                <SitecoreLink field={eventListingSingleProps.fields.URL}>
                  <ScImage
                    field={eventListingSingleProps.fields.Image}
                    className="h-full w-full object-cover"
                  />
                </SitecoreLink>
              )}
            </div>
            <div className="grid place-content-center lg:col-span-2 lg:w-[590px]">
              {(isPageEditing || eventListingSingleProps.fields.Legend) && (
                <Typography variant="l3" fontWeight="bold" fontColor="#A8ADA1">
                  <ScText field={eventListingSingleProps.fields.Legend} />
                </Typography>
              )}
              {(isPageEditing || eventListingSingleProps.fields.Title) && (
                <SitecoreLink field={eventListingSingleProps.fields.URL}>
                  <div className="mt-[20px]">
                    <Typography variant="h2" font="Bellefair">
                      <ScText field={eventListingSingleProps.fields.Title} />
                    </Typography>
                  </div>
                </SitecoreLink>
              )}
              {(isPageEditing || eventListingSingleProps.fields.SubTitle) && (
                <Typography variant="l3" extraStyles="mt-[15px]">
                  <ScText field={eventListingSingleProps.fields.SubTitle} />
                </Typography>
              )}

              <div className="mt-[30px] hidden flex-row gap-[70px] lg:flex">
                {(isPageEditing ||
                  eventListingSingleProps.fields.Date ||
                  eventListingSingleProps.fields.Time) && (
                  <div>
                    <Typography variant="l1" fontWeight="bold" extraStyles="mb-[10px]">
                      {t(DICTIONARY_CONSTANT.HAPPENING.TIME_LABEL)}
                    </Typography>
                    {(isPageEditing || eventListingSingleProps.fields.Date) && (
                      <Typography variant="p">
                        <ScText field={eventListingSingleProps.fields.Date} />
                      </Typography>
                    )}
                    {(isPageEditing || eventListingSingleProps.fields.Time) && (
                      <Typography variant="p">
                        <ScText field={eventListingSingleProps.fields.Time} />
                      </Typography>
                    )}
                  </div>
                )}
                {(isPageEditing || eventListingSingleProps.fields.Location) && (
                  <div>
                    <Typography variant="l1" fontWeight="bold" extraStyles="mb-[10px]">
                      {t(DICTIONARY_CONSTANT.HAPPENING.LOCATION_LABEL)}
                    </Typography>
                    <Typography variant="p">
                      <ScText field={eventListingSingleProps.fields.Location} />
                    </Typography>
                  </div>
                )}
              </div>

              {(isPageEditing ||
                eventListingSingleProps.fields.Date ||
                eventListingSingleProps.fields.Time) && (
                <Typography variant="p" extraStyles="lg:hidden mt-[30px]">
                  <ScText field={eventListingSingleProps.fields.Date} />
                  {' | '}
                  <ScText field={eventListingSingleProps.fields.Time} />
                </Typography>
              )}
              {(isPageEditing || eventListingSingleProps.fields.Location) && (
                <Typography variant="p" extraStyles="lg:hidden">
                  <ScText field={eventListingSingleProps.fields.Location} />
                </Typography>
              )}

              {(isPageEditing || eventListingSingleProps.fields.Description) && (
                <div className="my-[30px]">
                  <Typography variant="p">
                    <ScText field={eventListingSingleProps.fields.Description} />
                  </Typography>
                </div>
              )}
              {(isPageEditing || eventListingSingleProps.fields.URL.value.href) && (
                <CTAButton
                  url={eventListingSingleProps.fields.URL as LinkField}
                  text={eventListingSingleProps.fields.Text as TextField}
                  variant="underlined"
                />
              )}
            </div>
          </div>
        </div>
      </FadeInUp>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export default withDatasourceCheck()<EventListingSingleProps>(Default);
