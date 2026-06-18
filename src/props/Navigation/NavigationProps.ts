import { _ArticleCard } from '@/props/common/_ArticleCard';
import { _BannerWithCta } from '@/props/common/_BannerWithCta';
import { _SimpleText } from '@/props/common/_SimpleText';
import { _cta } from '@/props/common/_cta';
import { Treelist } from '@/props/fields/ScField';
import { ImageField, Field, TextField, LinkField, useSitecoreContext, LayoutServicePageState } from '@sitecore-jss/sitecore-jss-nextjs';

export type NavigationLinksProp = {
  fields: {
    SelectedLinks: (HeaderMegaMenus|NavigationLinksProp|NavigationLinkProp)[];
    Title: TextField;
    URL: LinkField;
  };
};

export type NavigationLinkProp = {
  fields: {
    Title: TextField;
    URL: LinkField;
  };
};

export type TeaserMenuLink = _ArticleCard & {

}

export type HeaderMegaMenus = {
  fields: {
    Title: TextField;
    Description: TextField;
    CTAUrl: LinkField;
    CTAText: TextField;
    SelectedLinks: (TeaserMenuLink|NavigationLinkProp)[];
    SelectedCTA: Treelist<_cta>[];
    SelectedArticles: Treelist<_SimpleText>[];
    IsMegaMenu : Field<boolean>;
    IsContent: Field<boolean>;
    OverrideMobileSubMenuByLink: Field<boolean>;
  }
}