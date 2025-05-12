import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TUser } from "../Types/TUser";

const initialState = {
    isLoggedIn: false,
    user: null as TUser | null,
};

const loadUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        return {
            isLoggedIn: true,
            user: JSON.parse(storedUser),
        };
    }
    return initialState;
};

const userSlice = createSlice({
    name: "user",
    initialState: loadUserFromLocalStorage(),
    reducers: {
        login: (state: TUserState, action: PayloadAction<TUser>) => {
            state.isLoggedIn = true;
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        Signout: (state: TUserState) => {
            state.isLoggedIn = false;
            state.user = null;
            localStorage.removeItem('user');
        },
    },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
export type TUserState = typeof initialState;
export type TUserPayload = { userName: string };