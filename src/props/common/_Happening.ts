import { TextField } from '@sitecore-jss/sitecore-jss-nextjs';

export interface _Happening {
  Date: TextField;
  Time: TextField;
  Location: TextField;
  EventDate: TextField;
}

export interface _HappeningGraphQL {
  date: TextField;
  time: TextField;
  location: TextField;
  eventDate: {
    value: string;
    jsonValue: {
      value: string;
    }
  };
}
