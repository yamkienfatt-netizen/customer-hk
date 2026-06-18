import { TextField } from '@sitecore-jss/sitecore-jss-nextjs';
import clientFactory from 'lib/graphql-client-factory';

export type FormToEmailField = {
  RecipientEmail : TextField;
  MessageTemplate : TextField;
  Subject : TextField;
  FromEmail: TextField;
};

const query = `
    query FormToEmailQueryReq($id: String!, $language: String!) {
        item(path: $id, language: $language) {
            id
            name
            path
            EmailBody: field(name: "EmailBody") {
                value
            }
            Subject : field(name: "Subject") {
                value
            }
            FromEmail: field(name: "FromEmail") {
                value
            }
            InternalEmailBody: field(name: "InternalEmailBody") {
                value
            }
            InternalRecipientEmail: field(name: "InternalRecipientEmail") {
                value
            }
            InternalSubject: field(name: "InternalSubject") {
                value
            }
            InternalFromEmail: field(name: "InternalFromEmail") {
                value
            }
        }
    }
`;
export type FormToEmailQueryProps = { item: FormToEmailField };

export const GetFormToEmailService = async (id: string, language: string): Promise<any> => {
  const graphQLClient = clientFactory({});
    console.log(id, language);
  const result = await graphQLClient.request<FormToEmailQueryProps>(query, {
    id: id,
    language: language,
  });

   return result?.item;
};
