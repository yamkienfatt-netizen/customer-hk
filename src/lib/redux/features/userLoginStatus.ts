import { createSlice } from '@reduxjs/toolkit';
// import { RootState } from '../store';

export interface UserLoginStatusState {
  userLoggedIn: boolean;
  isLoading: boolean;
  memberId: string | undefined;
}

const initialState: UserLoginStatusState = {
  userLoggedIn: false,
  isLoading: true,
  memberId: undefined,
};

export const userLoginStatusSlice = createSlice({
  name: 'userLoginStatus',
  initialState,
  reducers: {
    setUserLoggedInState(state, action) {
      state.userLoggedIn = action.payload;
    },

    setIsLoadingState(state, action) {
      state.isLoading = action.payload;
    },

    setMemberIdState(state, action) {
      state.memberId = action.payload;
    },
  },
});

export const { setUserLoggedInState, setIsLoadingState, setMemberIdState } = userLoginStatusSlice.actions;

// export const getUserLoginStatusState = (state: RootState) => state.userLoginStatus;

export default userLoginStatusSlice.reducer;
