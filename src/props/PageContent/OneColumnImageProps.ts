import { _SimpleText } from "@/props/common/_SimpleText";
import { ComponentProps } from "lib/component-props";



export type OneColumnImageField = _SimpleText & {
};


export type OneColumnImageProps = ComponentProps & {
  fields: OneColumnImageField;
};