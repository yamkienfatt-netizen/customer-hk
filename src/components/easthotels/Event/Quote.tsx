import React from 'react';
import QuoteSection from './QuoteSection';
import ComponentError from '../Error/ComponentError';

const Quote = ({ fields }) => {
  try {
    return (
      <div className="small-section-container flex lg:justify-center">
        <QuoteSection {...fields} />
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }
};

export default Quote;
