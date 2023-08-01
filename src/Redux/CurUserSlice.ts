import { createSlice, PayloadAction  } from '@reduxjs/toolkit'


export interface currentUserType {
    name: string
    id: string
  }

const initialState: currentUserType = {name: '', id: ''}

const CurUserSlice = createSlice({
    name: 'CurrentUserSlice',
    initialState: initialState,
    reducers: {
        setCurUser: (state, action: PayloadAction<currentUserType>) => {
            return action.payload
        }
    }
})


export const { setCurUser } = CurUserSlice.actions
export default CurUserSlice.reducer