import { _ResidenceStayDetail } from "@/props/common/_ResidenceStayDetail";
import { _StayDetail } from "@/props/common/_StayDetail";
import { Treelist } from "@/props/fields/ScField";
import { ImageField, LinkField, RichTextField, TextField } from "@sitecore-jss/sitecore-jss-nextjs";
import { ComponentProps } from "lib/component-props";

export type MeetingRoomInfoTemplateField = {
    SelectedMeetingRoomInfo: Treelist<_ResidenceStayDetail>[];
    BrochureCTALink: LinkField;
    BrochureCTAText: TextField;
    EnquiryCTALink: LinkField;
    EnquiryCTAText: TextField;
    
    CompareVenue: RichTextField;
}


export type MeetingRoomInfoTemplateProps = ComponentProps & {
    fields: MeetingRoomInfoTemplateField;
};