import { LinkField, TextField, ImageField } from "@sitecore-jss/sitecore-jss-nextjs";

export interface _SocialLinks {
    InstagramLink: LinkField;
    InstagramText: TextField;
    InstagramIcon: ImageField;

    FacebookLink: LinkField;
    FacebookText: TextField;
    FacebookIcon: ImageField;

    WechatQRCode: ImageField;
    WechatText: TextField;
    WechatIcon: ImageField;
    WechatIconBlack: ImageField;
    WechatQRCodeText: TextField;

    TripAdvisorIcon: ImageField;
    TripAdvisorLink: LinkField;
    TripAdvisorText: TextField;
}