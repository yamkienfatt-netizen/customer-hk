import { _ResidenceStayDetail } from "@/props/common/_ResidenceStayDetail";
import { _StayDetail } from "@/props/common/_StayDetail";
import { Treelist } from "@/props/fields/ScField";
import { ImageField, LinkField, TextField } from "@sitecore-jss/sitecore-jss-nextjs";
import { ComponentProps } from "lib/component-props";

export type RoomInfoTemplateField = {
    SelectedRoomInfo: Treelist<_ResidenceStayDetail>[];
    BrochureCTALink: LinkField;
    BrochureCTAText: TextField;
    EnquiryCTALink: LinkField;
    EnquiryCTAText: TextField;
    
    RoomSizeIcon: ImageField;
    CapacityIcon: ImageField;
    BedSizeIcon: ImageField;
    BathroomIcon: ImageField;
    BedroomIcon: ImageField;
    FloorIcon: ImageField;
}


export type RoomInfoTemplateProps = ComponentProps & {
    fields: RoomInfoTemplateField;
};