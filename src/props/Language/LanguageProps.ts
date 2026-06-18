import { TextField } from '@sitecore-jss/sitecore-jss-nextjs';

export type SitecoreLanguageItem = {
    fields:{
        Iso: TextField;
    }
}

export type SiteLanguageProp = {
    fields:{
        LanguageText: TextField;
        LanguageSetting: SitecoreLanguageItem;
    }
}

export type SiteSupportedLanguageProp = {
    fields:{
        SupportedLanguages: SiteLanguageProp[]
    }
}