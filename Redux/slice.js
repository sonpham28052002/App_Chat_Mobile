import { createSlice } from '@reduxjs/toolkit';

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    conversation: [],
    friendList: [],
    friendRequest: [],
  },
  reducers: {
    save: (state, action) => {
      Object.assign(state, action.payload);
    },
    updateAvatar: (state, action) => {
      Object.assign(state, action.payload);
    },
    updateNickName: (state, action) => {
      const { userId, newNickName } = action.payload;
      const friend = state.friendList.find(friend => friend.user.id === userId);
      console.log(friend);
      if (friend) {
        friend.nickName = newNickName;
        console.log(friend);
      }
    },
    addToFriendList: (state, action) => {
      state.friendList.push(action.payload);
    },
    removeFriend: (state, action) => {
      const userId = action.payload;
      state.friendList = state.friendList.filter(friend => friend.user.id !== userId);
    },
    addLastMessage: (state, action) => {
      let message = action.payload.message;
      let index = action.payload.index;
      state.conversation[index].lastMessage = message;
    },
    retrieveLastMessage: (state, action) => {
      let index = action.payload;
      state.conversation[index].lastMessage.messageType = 'RETRIEVE';
    },
    addLastConversation: (state, action) => {
      state.conversation.push(action.payload);
    },
    deleteConv: (state, action) => {
      let id = action.payload;
      let conversations = [...state.conversation];
      if(id.indexOf('-') !== -1) // id là id của group
        conversations = conversations.filter(conv => conv.idGroup !== id);
      else // id là id của user
        conversations = conversations.filter(conv => conv.idGroup || (conv.user && conv.user.id !== id));
      state.conversation = conversations;
    },
    addFriendRequest: (state, action) => {
      state.friendRequest.push(action.payload);
    }
  },
});

const messSlice = createSlice({
  name: 'message',
  initialState: {
    id: '',
    messages: [],
  },
  reducers:{
    saveReceiverId: (state, action) => {
      // state = {...state, id: action.payload};
      state.id = action.payload;
    },
    saveMess: (state, action) => {
      state.messages = action.payload;
      // state = {...state, messages: action.payload}
    },
    addMess: (state, action) => {
      if(action.payload.pending == false){
        const index = state.messages.findIndex(mess => mess._id === action.payload._id);
        if(index == -1)
          state.messages = [action.payload, ...state.messages];
        else
          state.messages[index] = action.payload;
      } else if(state.messages.findIndex(mess => mess._id === action.payload._id) === -1)
        state.messages = [action.payload, ...state.messages];
    },
    retrieveMess: (state, action) => {
      let index = state.messages.findIndex(mess => mess._id === action.payload);
      state.messages[index].text = 'Tin nhắn đã bị thu hồi!';
      state.messages[index].retrieve = true
      delete state.messages[index].image;
      delete state.messages[index].file;
      delete state.messages[index].audio;
      delete state.messages[index].video;
    },
    deleteMess: (state, action) => {
      let messages3 = [...state.messages];
      messages3 = messages3.filter(mess => mess._id !== action.payload);
      state.messages = messages3;
    },
    reactMessage: (state, action) => {
      let index = state.messages.findIndex(mess => mess._id === action.payload.id);
      if(index !== -1)
        state.messages[index].extraData.react = action.payload.react;
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

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    connected : false,
  },
  reducers: {
    initSocket: (state, action) => {
      state.connected = action.payload;
    },
  },
});

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    notify: {
      userName: '',
      avt: '',
      content: '',
      type: ''
    },
    visible: false
  },
  reducers: {
    visibleModal: (state, action) => {
      state.visible = action.payload;
    },
    notify: (state, action) => {
      state.notify = action.payload;
    }
  },
});

export const { save, updateAvatar, updateLastMessage, addToFriendList, addLastMessage, 
                retrieveLastMessage, addLastConversation, deleteConv, updateNickName,
                removeFriend, addFriendRequest } = accountSlice.actions;
export const { saveReceiverId, saveMess, addMess, retrieveMess, deleteMess, reactMessage } = messSlice.actions;
// export const { deleteConversation } = chatSlice.actions;
export const { initSocket } = socketSlice.actions;
export const { visibleModal, notify } = modalSlice.actions;
export default accountSlice.reducer;
export const messageReducer = messSlice.reducer;
export const chatReducer = chatSlice.reducer
export const socketReducer = socketSlice.reducer;
export const modalReducer = modalSlice.reducer;