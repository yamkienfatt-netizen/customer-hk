import { LayoutServicePageState, useSitecoreContext } from "@sitecore-jss/sitecore-jss-nextjs";
import ComponentError from "../Error/ComponentError";
import { usePathname } from "next/navigation";
import { GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";

export const MiamiMetadata = () => {
    try {
        const pathname = usePathname();
        const isMiami = pathname.toLowerCase().startsWith('/miami');

        if (!isMiami) {
            return <></>
        }

        const miamiJsonLtd = {
            "@context": "https://schema.org",
            "@type": "Hotel",
            "name": "East Hotel Miami",
            "description": "EAST Miami is a design hotel with four pools, lush outdoor spaces and a glamorous rooftop bar in the heart of trendy Brickell City Centre.",
            "url": "https://www.easthotels.com/en/miami/",
            "logo": "https://www.easthotels.com/miami/-/media/swirehotels/easthotels/east_miami/east_miami_logotop.ashx",
            "telephone": "+1 305 712 7000",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "788 Brickell Plaza, Miami, FL 33131, USA",
                "addressCountry": "USA"
            },
            "image": "https://www.easthotels.com/miami/-/media/swirehotels/easthotels/east_miami/mediagallery/bayking.ashx",
            "starRating": {
                "@type": "Rating",
                "ratingValue": "4"
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "reviewCount": "2935",
                "ratingValue": "4.5"
            }
        }


        return (
            <>
                <Script data-ot-ignore src='/scripts/miami-analytics.js'
                    onReady={() => {
                        console.log('Miami analytics ready');
                    }} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(miamiJsonLtd) }}
                />
            </>
        );
    } catch (err) {
        return <ComponentError error={err} />
    }
};
