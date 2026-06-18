import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface AccordionState {
  ids: string[];
}

const initialState: AccordionState = {
  ids: [],
};

export const accordionSlice = createSlice({
  name: 'accordion',
  initialState,
  reducers: {
    setAccordionState(state, action) {
      state.ids = action.payload;
    },
  },
});

export const { setAccordionState } = accordionSlice.actions;

export const getAccordionState = (state: RootState) => state.accordion;

export default accordionSlice.reducer;
