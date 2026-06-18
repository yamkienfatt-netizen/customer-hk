import React, { JSX } from 'react';

import Typography from '../Typography/Typography';
import { getPublicUrl } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { HtmlLink } from '../CustomTypes/Components/HtmlLink';
import {
  ComponentRendering,
  GetServerSideComponentProps,
  useComponentProps,
  Text as ScText,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { GetBreadcrumbService } from '@/graphql/BreadcrumbQuery.service';
import { ComponentProps } from 'lib/component-props';
import {
  BreadcrumbGraphQLProps,
  BreadcrumbItemGraphQL,
} from '@/props/Graphql/BreadcrumbGraphQLProps';
import { EastIDs, IsIDsIdentical } from '@/utilities/EastIdsConstant';
import ComponentError from '../Error/ComponentError';
import Image from 'next/image';
const publicUrl = getPublicUrl();

export type BreadcrumbProps = ComponentProps & {
  rendering: ComponentRendering;
  fields: {
    data: BreadcrumbGraphQLProps;
  };
};

export const Default = (breadcrumbProps: BreadcrumbProps): JSX.Element => {
  try {
    const sitecoreContext = useSitecoreContext();
    const isPageEditing = sitecoreContext.sitecoreContext.pageEditing
      ? sitecoreContext.sitecoreContext.pageEditing
      : false;

    let breadcrumbArray: BreadcrumbItemGraphQL[] = [];
    breadcrumbArray.push(breadcrumbProps.fields.data?.item as BreadcrumbItemGraphQL); // current item
    breadcrumbProps.fields.data?.item.ancestors.map(
      (item: BreadcrumbItemGraphQL, index: number) => {
        if (
          breadcrumbArray.length < 3 &&
          !IsIDsIdentical(item.template.id, EastIDs.EAST_DATE_FOLDER_TEMPLATE) &&
          !IsIDsIdentical(item.id, EastIDs.EASTHOTELS_ROOT_ITEM) &&
          !IsIDsIdentical(item.template.id, EastIDs.EAST_PROPERTY_HOME_PAGE_TEMPLATE)
        ) {
          // We only need to show 2 level breadcrumb navigation (1 level up parent)
          breadcrumbArray.push(item);
        }
      }
    );

    breadcrumbArray = breadcrumbArray.reverse();

    return (
      <div className="hidden border lg:block">
        <div className="my-[12px] ml-[25px] flex">
          {breadcrumbArray &&
            breadcrumbArray.map((breadcrumb: BreadcrumbItemGraphQL, index: number) => {
              if (breadcrumb?.title?.jsonValue?.value) {
                breadcrumb.title.jsonValue.value =
                  String(breadcrumb.title?.jsonValue?.value)?.toUpperCase() || '';
              }

              return (
                <React.Fragment key={index}>
                  <Typography variant="l2">
                    {isPageEditing ? (
                      <ScText field={breadcrumb.title?.jsonValue} />
                    ) : (
                      <HtmlLink href={breadcrumb.url.path}>
                        <ScText field={breadcrumb.title?.jsonValue} />
                      </HtmlLink>
                    )}
                  </Typography>
                  {index !== breadcrumbArray.length - 1 && (
                    <Image
                      src={`${publicUrl}/icon_breadcrumb_arrow.svg`}
                      alt="location"
                      className="mt-[-2px] px-[8px]"
                      width={22}
                      height={20}
                    />
                  )}
                </React.Fragment>
              );
            })}
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
