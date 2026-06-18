import { _SimplePageGraphQLFields } from "../Core/PageProps";


export interface ItemUrlGraphQL {
    url: string;
    path: string;
}

export interface BreadcrumbItemGraphQL extends _SimplePageGraphQLFields {
    id: string;
    name: string;
    url: ItemUrlGraphQL;
    template : {
      id: string;
      name: string;
    }
}

export type BreadcrumbGraphQLProps = {
    item: BreadcrumbItemGraphQL & {
      ancestors: BreadcrumbItemGraphQL[];
    };
  };
  