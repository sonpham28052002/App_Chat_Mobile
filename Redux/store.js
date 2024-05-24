import { configureStore } from '@reduxjs/toolkit';
import accountReducer, { messageReducer, chatReducer, socketReducer, modalReducer,userOnlineReducer } from './slice';
import thunk from 'redux-thunk';

// const middleware = [...getDefaultMiddleware(), thunk];

const store = configureStore({
  reducer: {
    account: accountReducer,
    message: messageReducer,
    // chat: chatReducer,
    socket: socketReducer,
    modal: modalReducer,
    user:userOnlineReducer,
  },
    // call: callReducer
  }
  // middleware,
});

export default store;
