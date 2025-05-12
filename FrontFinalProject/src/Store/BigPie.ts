import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserSlice from "./UserSlice";
import SearchSlice from "./SearchSlice";
import CartSlice from "./CartSlice";

const store = configureStore({
    reducer: {
        UserSlice,
        SearchSlice,
        CartSlice
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        })
    },
});

const rootReducer = combineReducers({
    UserSlice,
    SearchSlice,
    CartSlice
});

export type TRootState = ReturnType<typeof rootReducer>;
export default store;