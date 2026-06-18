import React, { JSX } from 'react';
import { Field, RichText as JssRichText } from '@sitecore-jss/sitecore-jss-nextjs';
import ComponentError from '../Error/ComponentError';

interface Fields {
  Text: Field<string>;
}

export type EhRichTextProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: EhRichTextProps): JSX.Element => {
  try {
    const text = props.fields ? (
      <JssRichText field={props.fields.Text} />
    ) : (
      <span className="is-empty-hint">Rich text</span>
    );
    const id = props.params.RenderingIdentifier;

    return (
      <div
        className={`component rich-text ${props.params.styles.trimEnd()}`}
        id={id ? id : undefined}
      >
        <span>Eh rich text</span>
        <div className="component-content">{text}</div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />;
  }
};
