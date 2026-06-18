import { _ArticleCardGraphQL } from '@/props/common/_ArticleCard';
import { _HappeningGraphQL } from '@/props/common/_Happening';
import { FormToEmailQueryProps } from '@/props/Graphql/FormToEmailQueryProps';
import clientFactory from 'lib/graphql-client-factory';

const FormToEmailQueryDocument = /* GraphQL */ `
  query FormToEmailQuery($startItem: String!, $language: String!) {
    item(path: $startItem, language: $language) {
      ... on _FormToEmail {
        recipientEmail {
          value
          jsonValue
        }
        messageTemplate {
          value
          jsonValue
        }
        subject {
          value
          jsonValue
        }
        fromEmail {
          value
          jsonValue
        }
      }
    }
  }
`;

//Ref: https://sitecore-nextjs-guide.hakmeng.com/graphql/connected-mode

export const GetFormToEmailService = async (
  startItem: string,
  language: string
): Promise<FormToEmailQueryProps> => {
  const graphQLClient = clientFactory({});

  let result = await graphQLClient.request<FormToEmailQueryProps>(FormToEmailQueryDocument as any, {
    startItem: startItem,
    language: language,
  });

  return result;
};
