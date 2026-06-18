import React from 'react';
import CTAButton from './CTAButton';
import ComponentError from '../Error/ComponentError';

export const Default = () => {
  try {
    return (
      <div className="mx-0">
        {/* TODO Wen: To add All Page Components to this area (able to drag from pages?), because the button should be sticky throughout the page  */}
        {/* e.g.     <RBTemplate /> */}
        <div className="sticky bottom-0 z-10 shadow-[0_0px_20px_-5px_rgb(0,0,0)]  lg:hidden ">
          <CTAButton
            text={'ENQUIRE NOW'}
            url="www.google.com"
            variant="contained-big"
            fontColor="#fff"
            bgColor="royal-green"
            extraContainerStyles="h-[50px]"
          ></CTAButton>
        </div>
      </div>
    );
  } catch (err) {
    return <ComponentError error={err} />
  }


};
