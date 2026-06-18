import React, { JSX } from 'react';
import {
  Link,
  Text,
  useSitecoreContext,
  LinkField,
  TextField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import ComponentError from '../Error/ComponentError';

interface Fields {
  data: {
    datasource: {
      url: {
        path: string;
        siteName: string;
      };
      field: {
        jsonValue: {
          value: string;
          editable: string;
        };
      };
    };
    contextItem: {
      url: {
        path: string;
        siteName: string;
      };
      field: {
        jsonValue: {
          value: string;
          editable: string;
        };
      };
    };
  };
}

type EhTitleProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type ComponentContentProps = {
  id: string;
  styles: string;
  children: JSX.Element;
};

const ComponentContent = (props: ComponentContentProps) => {
  try {
    const id = props.id;
    return (
      <div className={`component title ${props.styles}`} id={id ? id : undefined}>
        <div className="component-content">
          <div className="field-title">{props.children}</div>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};

export const Default = (props: EhTitleProps): JSX.Element => {
  try {
    const datasource = props.fields?.data?.datasource || props.fields?.data?.contextItem;
    const { sitecoreContext } = useSitecoreContext();

    const text: TextField = {
      value: datasource?.field?.jsonValue?.value,
      editable: datasource?.field?.jsonValue?.editable,
    };
    const link: LinkField = {
      value: {
        href: datasource?.url?.path,
        title: datasource?.field?.jsonValue?.value,
        editable: true,
      },
    };
    if (sitecoreContext.pageState !== 'normal') {
      link.value.querystring = `sc_site=${datasource?.url?.siteName}`;
      if (!text.value) {
        text.value = 'Title field';
        link.value.href = '#';
      }
    }

    return (
      <ComponentContent styles={props.params.styles} id={props.params.RenderingIdentifier}>
        <>
          {sitecoreContext.pageState === 'edit' ? (
            <Text field={text} />
          ) : (
            <HtmlLink field={link}>
              <Text field={text} />
            </HtmlLink>
          )}
        </>
      </ComponentContent>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
