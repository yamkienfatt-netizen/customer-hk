import { _ArticleCard, _ArticleCardGraphQL } from '@/props/common/_ArticleCard';
import { _HappeningGraphQL } from '@/props/common/_Happening';
import { _StayDetail, _StayDetailGraphQL } from '@/props/common/_StayDetail';
import { GraphQlSearch } from './GraphQlSearchProps';
import { _VenueDetailGraphQL } from '@/props/common/_VenueDetail';
import { TextField } from '@sitecore-jss/sitecore-jss-nextjs';

export type FormToEmailField = {
  recipientEmail: TextField;
  messageTemplate: TextField;
  subject: TextField;
  fromEmail: TextField;
}

export type FormToEmailQueryProps = { item: FormToEmailField};
