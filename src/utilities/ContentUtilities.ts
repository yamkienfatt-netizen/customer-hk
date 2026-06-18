import { EastIDs } from "./EastIdsConstant";
import { EastPaths } from "./EastPathsConstant";

export const GetSiteStartItemId = (currentItem: string) => {
    console.log(`currentItem` , currentItem);
    if(currentItem.toLowerCase().includes(EastPaths.EASTHONGKONG_ROOT_ITEM.toLowerCase())){
        return EastIDs.EASTHONGKONG_ROOT_ITEM;
    }else if(currentItem.toLowerCase().includes(EastPaths.EASTMIAMI_ROOT_ITEM.toLowerCase())){
        return EastIDs.EASTMIAMI_ROOT_ITEM;
    }else if(currentItem.toLowerCase().includes(EastPaths.EASTBEIJING_ROOT_ITEM.toLowerCase())){
        return EastIDs.EASTBEIJING_ROOT_ITEM;
    }else{
        return EastIDs.EASTHOTELS_ROOT_ITEM;
    }
};