import { configureStore } from '@reduxjs/toolkit';
import accountReducer, { messageReducer } from './slice';

const store = configureStore({
  reducer: {
    account: accountReducer,
    message: messageReducer,
  },
});

export default store;