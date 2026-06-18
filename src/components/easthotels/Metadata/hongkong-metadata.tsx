import { LayoutServicePageState, useSitecoreContext } from "@sitecore-jss/sitecore-jss-nextjs";
import ComponentError from "../Error/ComponentError";
import { usePathname } from "next/navigation";
import { GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";

export const HongkongMetadata = () => {
    try {
        const pathname = usePathname();
        const isHongkong = pathname.toLowerCase().startsWith('/hongkong');

        if (!isHongkong) {
            return <></>
        }

        const hongkongJsonLtd = {
            "@context": "https://schema.org",
            "@type": "Hotel",
            "name": "East Hotel Hong Kong",
            "description": "EAST Hong Kong is a modern lifestyle hotel with sleek design vibes on the east side of Hong Kong Island. Work, play and stay in buzzing Taikoo Shing.",
            "url": "https://www.easthotels.com/en/hongkong/",
            "logo": "https://www.easthotels.com/hongkong/-/media/swirehotels/easthotels/east_hongkong/header/east-logo.ashx",
            "telephone": "+852 3968 3968",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "29 Taikoo Shing Road, Taikoo Shing, Hong Kong",
                "addressCountry": "Hong Kong"
            },
            "image": "https://www.easthotels.com/hongkong/-/media/swirehotels/easthotels/east_hongkong/mediagallery/gallery/suite-3006---sofa-area-night-hd.ashx",
            "starRating": {
                "@type": "Rating",
                "ratingValue": "4"
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "reviewCount": "1112",
                "ratingValue": "4.3"
            }
        }


        return (
            <>
                <Script src='/scripts/hongkong-analytics.js'
                    onReady={() => {
                        console.log('Hongkong analytics ready');
                    }} />
                <script src='https://www.thehotelsnetwork.com/js/loader.js?property_id=1163101' async></script>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(hongkongJsonLtd) }}
                />
            </>
        );
    } catch (err) {
        return <ComponentError error={err} />
    }
};
