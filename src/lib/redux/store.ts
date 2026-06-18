import { configureStore } from '@reduxjs/toolkit';
import { accordionSlice } from './features/accordionNavigation';
import { contactUsFormSlice } from './features/contactUsForm';
import { createWrapper } from 'next-redux-wrapper';
import { scriptLoadStatusSlice } from './features/scriptLoadStatus';
import { userLoginStatusSlice } from './features/userLoginStatus';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [accordionSlice.name]: accordionSlice.reducer,
      [contactUsFormSlice.name]: contactUsFormSlice.reducer,
      [scriptLoadStatusSlice.name]: scriptLoadStatusSlice.reducer,
      [userLoginStatusSlice.name]: userLoginStatusSlice.reducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export const wrapper = createWrapper<AppStore>(makeStore);
