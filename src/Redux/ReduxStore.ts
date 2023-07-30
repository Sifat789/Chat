import { configureStore } from "@reduxjs/toolkit";
import CurUserSlice from "./CurUserSlice";

export interface RootState {
    CurUserSlice : {
        name: string
        id: string
    }
}

const store = configureStore({
    reducer: {
        CurUserSlice: CurUserSlice
    }
})

export default store