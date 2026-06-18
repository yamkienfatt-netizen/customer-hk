import { RootState } from "lib/redux/store";
import { useSelector } from "react-redux";

export const useSelectedInquiryType = () => {
  const contactUsFormType = useSelector((state: RootState) => state.contactUsForm.inquiryType);

  return contactUsFormType;
}