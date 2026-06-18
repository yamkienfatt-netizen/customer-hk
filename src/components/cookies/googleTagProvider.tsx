import React, { JSX } from 'react';
import { GoogleTagManager } from '@next/third-parties/google';
import { GTMParams } from '@next/third-parties/dist/types/google';

function _getGTMParamsById(id: string): GTMParams {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const env = process.env.NODE_ENV || process.env.VERCEL_ENV;

  if (hostname.includes('uat')) {
    return { gtmId: id, auth: 'AIta0sDjfg1J8W1t2pGwWA', preview: 'env-1153' };
  }

  if (env === 'production') {
    return { gtmId: id };
  }

  return { gtmId: id, auth: 'AIta0sDjfg1J8W1t2pGwWA', preview: 'env-1153' };
}

export interface GoogleTagProviderProps {
  gtmId: string;
}

export const GoogleTagProvider = ({ gtmId }: GoogleTagProviderProps): JSX.Element => {
  const gtmParams = _getGTMParamsById(gtmId);
  return (
    <>
      <GoogleTagManager {...gtmParams} />
    </>
  );
};
