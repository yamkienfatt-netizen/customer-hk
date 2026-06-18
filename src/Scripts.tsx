import { EditingScripts } from '@sitecore-jss/sitecore-jss-nextjs';
// The BYOC bundle imports external (BYOC) components into the app and makes sure they are ready to be used
import BYOC from 'src/byoc';
import CdpPageView from 'components/sxa-starter/PageView/CdpPageView';
import FEAASScripts from 'components/FEAASScripts';
import CdpIdentity from 'components/CdpIdentity';
import { JSX } from 'react';

const Scripts = (): JSX.Element => {
  return (
    <>
      <BYOC />
      <CdpPageView />
      <CdpIdentity />
      <FEAASScripts />
      <EditingScripts />
    </>
  );
};

export default Scripts;
