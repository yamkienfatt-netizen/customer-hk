import type { AppProps } from 'next/app';
import { I18nProvider } from 'next-localization';
import { SitecorePageProps } from 'lib/page-props';
import Bootstrap from 'src/Bootstrap';

import '../global.css';
import 'swiper/css';
import 'swiper/css/bundle';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';
import { wrapper } from 'lib/redux/store';
import { Provider } from 'react-redux';
import { MiamiMetadata } from 'components/easthotels/Metadata/miami-metadata';
import { BeijingMetadata } from 'components/easthotels/Metadata/beijing-metadata';
import { HongkongMetadata } from 'components/easthotels/Metadata/hongkong-metadata';
import { OneTrustProvider } from 'components/cookies/oneTrustProvider';
import { GoogleTagProvider } from 'components/cookies/googleTagProvider';
import { JSX } from 'react';

function App({ Component, pageProps }: AppProps<SitecorePageProps>): JSX.Element {
  const { dictionary, gtmid, ...rest } = pageProps;
  const { store } = wrapper.useWrappedStore(rest);

  return (
    // Use the next-localization (w/ rosetta) library to provide our translation dictionary to the app.
    // Note Next.js does not (currently) provide anything for translation, only i18n routing.
    // If your app is not multilingual, next-localization and references to it can be removed.
    <>
      <Provider store={store}>
        <GoogleTagProvider gtmId={gtmid} />
        <MiamiMetadata />
        <BeijingMetadata />
        <HongkongMetadata />

        <OneTrustProvider locale={pageProps.locale} />

        <Bootstrap {...pageProps} />
        <I18nProvider lngDict={dictionary} locale={pageProps.locale}>
          <motion.div
            key={'page_animation'}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1, ease: 'easeInOut' } }}
          >
            <Component {...rest} />
          </motion.div>
        </I18nProvider>
      </Provider>
    </>
  );
}

export default App;
