import { createSlice } from '@reduxjs/toolkit';

const accountSlice = createSlice({
  name: 'account',
  initialState: {
       friendList: [],
  },
  reducers: {
    save: (state, action) => {
      Object.assign(state, action.payload);
    },
    updateAvatar: (state, action) => {
      Object.assign(state, action.payload);
    },
    addToFriendList: (state, action) => {
      state.friendList.push(action.payload);
    },
  },
});

const messSlice = createSlice({
  name: 'message',
  initialState: {
    id: '',
    messages: []
  },
  reducers:{
    saveReceiverId: (state, action) => {
      state = {...state, id: action.payload};
    },
    saveMess: (state, action) => {
      state.messages = [...action.payload];
      // state = {...state, messages: action.payload}
    },
    addMess: (state, action) => {
      if(state.messages.findIndex(mess => mess._id === action.payload._id) === -1)
        state.messages = [action.payload, ...state.messages];
    },
    retreiveMess: (state, action) => {
      let messages2 = [...state.messages];
      messages2[action.payload.index] = action.payload.mess;
      state.messages = messages2;
    },
    deleteMess: (state, action) => {
      let messages3 = [...state.messages];
      messages3 = messages3.filter(mess => mess._id !== action.payload);
      state.messages = messages3;
    }
  }
});
const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    conversations: [],
  },
  reducers: {
    deleteConversation: (state, action) => {
      state.conversations = state.conversations.filter(conversation => {
        if (conversation.user && conversation.user.id !== action.payload) {
          return true;
        } else if (conversation.conversationType === 'group') {
          return false;
        }
        return false;
      });
    },
  },
});

export const { save, updateAvatar, updateLastMessage,addToFriendList } = accountSlice.actions;
export const { saveReceiverId, saveMess, addMess, retreiveMess, deleteMess } = messSlice.actions;
export const { deleteConversation } = chatSlice.actions;
export default accountSlice.reducer;
export const messageReducer = messSlice.reducer;
export const chatReducer = chatSlice.reducer
