import {configureStore} from '@reduxjs/toolkit';
import cartSlice from '../redux/Apislice/cartslice';

export const store = configureStore({
    reducer:{cart:cartSlice}
})