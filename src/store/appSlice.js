import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    center:{lat: 12.9716, lng: 77.5946},
    data:[],
    properties:[],
    selectedProperty: null,
    userPosts: [],
    onSubmit: true
}
const appSlice = createSlice({
    name:"app",
    initialState,
    reducers:{
        setCenter:(state,action)=>{
            state.center=action.payload;
        },
        setData:(state,action)=>{
            state.data= action.payload;
        },
        setProperties:(state,action)=>{
            state.properties= action.payload;
        },
        setSelectedProperty:(state,action)=>{
            state.selectedProperty= action.payload;
        },
        setUserPosts:(state, action)=>{
            state.userPosts = Array.isArray(action.payload) ? action.payload : [];
        },
        toggleOnSubmit:(state)=>{
            state.onSubmit = !state.onSubmit;
        },
        setDefault:(state)=>{
            state.center=initialState.center;
            state.data=[];
            state.properties=[];
            state.selectedProperty=null;
            state.userPosts=[];
            state.onSubmit = true;
        }
    }
});

export const {setCenter,setData,setProperties,setSelectedProperty,setUserPosts,toggleOnSubmit,setDefault} = appSlice.actions;

export default appSlice.reducer;
