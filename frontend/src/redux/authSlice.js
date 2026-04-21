import { createSlice } from "@reduxjs/toolkit"; 

const initialState ={
    user:null,
    token:null,
    profilePic:null,
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        loginSuccess:(state,action) => {
            state.user = action.payload.user;
            state.token = action.payload.token; 
            state.profilePic= action.payload.user.profilePic;
        },
        setProfile:(state,action) => {
            state.user = action.payload;
            state.profilePic =action.payload.profilePic;
        },
        updateProfilePic:(state,action) => {
            state.profilePic = action.payload;

        },
        logout:(state) => {
            state.user = null;
            state.token = null;
            state.profilePic=null;
        },
    },
});

export const { loginSuccess, logout,setProfile,updateProfilePic } = authSlice.actions;
export default authSlice.reducer;