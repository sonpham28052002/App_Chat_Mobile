import { configureStore } from '@reduxjs/toolkit';
import accountReducer, { messageReducer, chatReducer } from './slice';
import thunk from 'redux-thunk';

// const middleware = [...getDefaultMiddleware(), thunk];

const store = configureStore({
  reducer: {
    account: accountReducer,
    message: messageReducer,
    chat: chatReducer,
  },
  // middleware,
});

export default store;
