import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface ScriptLoadStatusState {
  aliyunCaptchaLoaded: boolean;
}

const initialState: ScriptLoadStatusState = {
  aliyunCaptchaLoaded: false,
};

export const scriptLoadStatusSlice = createSlice({
  name: 'scriptLoadStatus',
  initialState,
  reducers: {
    setAliyunCaptchaLoadedState(state, action) {
      state.aliyunCaptchaLoaded = action.payload;
    },
  },
});

export const { setAliyunCaptchaLoadedState } = scriptLoadStatusSlice.actions;

export const getScriptLoadStatusState = (state: RootState) => state.scriptLoadStatus;

export default scriptLoadStatusSlice.reducer;
