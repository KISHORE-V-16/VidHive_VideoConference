import { configureStore,createSlice } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; 
import {persistStore,persistReducer} from 'redux-persist'


const persistConfigure = {

    key:'root',
    storage,
};

export const initialState={

}


const storeslice = createSlice({
    name:"cart",
    initialState,
    reducers:{
       

    }
});



const persistedReducer = persistReducer(persistConfigure,storeslice.reducer);


export const store = configureStore({
    reducer:{
        cart:persistedReducer
    }
});

export const persistor = persistStore(store); 


