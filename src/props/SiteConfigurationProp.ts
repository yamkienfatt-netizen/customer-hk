import { ComponentProps } from "lib/component-props";
import { NavigationLinkProp, NavigationLinksProp } from "./Navigation/NavigationProps";
import { Field, ImageField, LinkField, RichTextField, TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import { SiteSupportedLanguageProp } from "./Language/LanguageProps";
import { BookNowHotel, ReservationsProp } from "./Location/ReservationProp";
import { _ScItem } from "@/props/common/_ScItem";
import { Treelist } from "@/props/fields/ScField";
import { _SocialLinks } from "./common/_SocialLinks";
import { _cta } from "./common/_cta";


export type SiteConfigurationProp = ComponentProps & {
    fields: {
      Icon: ImageField;
      IconMobile: ImageField;
      SiteMenu: NavigationLinksProp;
      PropertyLinks: NavigationLinksProp;
      HomeLink: NavigationLinkProp;
      FooterLinks: NavigationLinksProp;
      FooterSitemap: NavigationLinksProp;
      SubscriptionForm: LinkField;
      SiteLanguages: SiteSupportedLanguageProp;
      BookNowConfiguration: ReservationsProp;
      ReservationLabel: TextField;
      ICPContent: RichTextField;
      IsSSOEnabled: Field<boolean>;
    } & _SocialLinks & _cta;
  };
  
  export type PropertySiteConfigurationProp = ComponentProps & {
    fields: {
      Icon: ImageField;
      FooterIcon: ImageField;
      IconMobile: ImageField;
      MainSite: LinkField;
      SiteMenu: NavigationLinksProp;
      PropertyLinks: NavigationLinksProp;
      HomeLink: NavigationLinkProp;
      FooterLinks: NavigationLinksProp;
      FooterSitemap: NavigationLinksProp;
      SubscriptionForm: LinkField;
      SiteLanguages: SiteSupportedLanguageProp;
      PropertyBookNowConfiguration: BookNowHotel;
      ReservationLabel: TextField;
      SideReservationLabel: TextField;
      SideReservationPropertyLabel: TextField;
      ICPContent: RichTextField;
      IsSSOEnabled: Field<boolean>;
    } & _SocialLinks & _cta;
  };

  export type PropertyEastResidenceSiteConfigurationProp = PropertySiteConfigurationProp & {
    fields:{
      EASTResidenceLink: LinkField;
      EASTResidenceText: TextField;
    }
  }