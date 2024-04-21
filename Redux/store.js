import { configureStore } from '@reduxjs/toolkit';
import accountReducer, { messageReducer, chatReducer, socketReducer } from './slice';
import thunk from 'redux-thunk';

// const middleware = [...getDefaultMiddleware(), thunk];

const store = configureStore({
  reducer: {
    account: accountReducer,
    message: messageReducer,
    chat: chatReducer,
    socket: socketReducer,
  },
  // middleware,
});

export default store;
