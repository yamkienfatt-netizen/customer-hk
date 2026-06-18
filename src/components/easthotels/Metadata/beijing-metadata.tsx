import { LayoutServicePageState, useSitecoreContext } from "@sitecore-jss/sitecore-jss-nextjs";
import ComponentError from "../Error/ComponentError";
import { usePathname } from "next/navigation";
import Script from "next/script";

export const BeijingMetadata = () => {
    try {
        const pathname = usePathname();
        const isBeijing = pathname.toLowerCase().startsWith('/beijing');

        if (!isBeijing) {
            return <></>
        }
        return (
            <>
                <script src='https://www.thehotelsnetwork.com/js/loader.js?property_id=1163102' async></script>
                <Script src='/scripts/beijing-analytics.js'
                    onReady={() => {
                        console.log('Beijing analytics ready');
                    }} />
            </>
        );
    } catch (err) {
        return <ComponentError error={err} />
    }
};
