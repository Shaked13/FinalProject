import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialSearchState = {
    search: ""
}

const SearchSlice = createSlice({
    name: "search",
    initialState: initialSearchState,
    reducers: {
        searchWord: (state: TSearchState, action: PayloadAction<string>) => {
            state.search = action.payload
        }
    }
});

export type TSearchState = typeof initialSearchState;
export const searchActions = SearchSlice.actions;
export default SearchSlice.reducer;