import { LayoutServicePageState, useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import { useEffect, JSX } from 'react';
import { identity } from '@sitecore-cloudsdk/events/browser';
import { useSelector } from 'react-redux';
import { RootState } from 'lib/redux/store';
import config from 'temp/config';

const CdpIdentity = (): JSX.Element => {
  const {
    sitecoreContext: { pageState, route },
  } = useSitecoreContext();

  const { userLoggedIn, isLoading, memberId } = useSelector(
    (state: RootState) => state.userLoginStatus
  );

  /**
   * Determines if the page view events should be turned off.
   * IMPORTANT: You should implement based on your cookie consent management solution of choice.
   * By default it is disabled in development mode
   */
  const disabled = () => {
    return process.env.NODE_ENV === 'development';
  };

  useEffect(() => {
    // Do not create events in editing or preview mode or if missing route data
    if (pageState !== LayoutServicePageState.Normal || !route?.itemId) {
      return;
    }
    // Do not create events if disabled (e.g. we don't have consent)
    if (disabled()) {
      return;
    }

    const language = route.itemLanguage || config.defaultLanguage;

    if (!isLoading && userLoggedIn && memberId) {
      identity({
        channel: 'WEB',
        page: route.name,
        identifiers: [
          {
            id: memberId,
            provider: 'userId',
          },
        ],
        language,
      }).catch((e) => console.debug(e));
      console.log('Sent IDENTITY event.');
    }
  }, [isLoading, userLoggedIn, pageState, route, memberId]);

  return <></>;
};

export default CdpIdentity;
