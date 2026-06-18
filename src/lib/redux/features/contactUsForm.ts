import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface contactUsForm {
  inquiryType?: string;
}

const initialState: contactUsForm = {
  inquiryType: ''
};

export const contactUsFormSlice = createSlice({
  name: 'contactUsForm',
  initialState,
  reducers: {
    setContactUsFormInquiryTypeState(state, action) {
      state.inquiryType = action.payload;
    },
  },
});

export const { setContactUsFormInquiryTypeState } = contactUsFormSlice.actions;

export const getContactUsFormState = (state: RootState) => state.contactUsForm;

export default contactUsFormSlice.reducer;
