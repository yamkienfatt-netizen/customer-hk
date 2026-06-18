import { _StayDetail } from "@/props/common/_StayDetail";
import { Treelist } from "@/props/fields/ScField";
import { ComponentProps } from "lib/component-props";



export interface RoomComparisonField {
    Rooms: Treelist<_StayDetail>[];
}
  

export type RoomComparisonProps = ComponentProps & {
    fields: RoomComparisonField;
};