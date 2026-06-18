import FadeInUp from 'components/easthotels/Animation/FadeInUp';
import React from 'react';

import RichTextTypography from 'components/easthotels/Typography/RichTextTypography';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import Typography from '../Typography/Typography';
import { MenuTabProps } from '@/props/Navigation/MenuTabProps';
import { withDatasourceCheck, Text as ScText } from '@sitecore-jss/sitecore-jss-nextjs';
import { SitecoreLink } from '../CustomTypes/Components/SitecoreLink';
import ComponentError from '../Error/ComponentError';

const publicUrl = getPublicUrl();

const Default = (menuTabProps: MenuTabProps) => {
  try {
    const sitecoreCss = menuTabProps.params?.Styles ?? '';
    return (
      <div className={'small-section-container !max-w-[630px] text-center ' + sitecoreCss}>
        <FadeInUp>
          <Typography variant="h3" font="Bellefair">
            <ScText field={menuTabProps.fields.Title} />
          </Typography>
        </FadeInUp>
        <FadeInUp>
          <div className="mx-[15px] mt-[80px] lg:mx-0">
            <hr className="my-[10px]" />
            {menuTabProps.fields.SelectedArticles.map((menuItem, index) => (
              <>
                <div key={index} className="flex justify-between">
                  <RichTextTypography>
                    <ScText field={menuItem.fields.Title} />
                  </RichTextTypography>

                  <SitecoreLink
                    field={menuItem.fields.Link}
                    className="flex gap-[5px] border-b-[2px] border-black-secondary"
                  >
                    <Typography variant="l1" fontWeight="bold">
                      <ScText field={menuTabProps.fields.CTAText} />
                    </Typography>
                    <img
                      src={`${publicUrl}/icon_view.svg`}
                      alt="icon_view"
                      width={18}
                      className="mt-[-3px]"
                    />
                  </SitecoreLink>
                </div>
                <hr className="my-[10px]" />
              </>
            ))}
          </div>
        </FadeInUp>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }
};

export default withDatasourceCheck()<MenuTabProps>(Default);