import { _cta } from "@/props/common/_cta";
import { ComponentProps } from "lib/component-props";


export type CTAField = _cta & {

}

export type CTAProps = ComponentProps & {
    fields: CTAField;
}