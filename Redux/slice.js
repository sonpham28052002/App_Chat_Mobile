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
    updateCoverImage: (state, action) => {
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
      if (id.indexOf('-') !== -1) // id là id của group
        conversations = conversations.filter(conv => conv.idGroup !== id);
      else // id là id của user
        conversations = conversations.filter(conv => conv.idGroup || (conv.user && conv.user.id !== id));
      state.conversation = conversations;
    },
    addFriendRequest: (state, action) => {
      state.friendRequest.push(action.payload);
    },
    seenMessage: (state, action) => {
      let id = action.payload.id;
      let index = action.payload.index
      if (state.conversation[index].lastMessage.seen.findIndex(seen => seen.id === id) === -1)
        state.conversation[index].lastMessage.seen = [...state.conversation[index].lastMessage.seen, { id: id }];
      console.log(state.conversation[index].lastMessage.seen);
    }
  },
});

const messSlice = createSlice({
  name: 'message',
  initialState: {
    id: '',
    messages: [],
  },
  reducers: {
    saveReceiverId: (state, action) => {
      // state = {...state, id: action.payload};
      state.id = action.payload;
    },
    saveMess: (state, action) => {
      state.messages = action.payload;
    },
    addMess: (state, action) => {
      if (action.payload.pending == false) {
        const index = state.messages.findIndex(mess => mess._id === action.payload._id);
        if (index == -1)
          state.messages = [action.payload, ...state.messages];
        else
          state.messages[index] = action.payload;
      } else if (state.messages.findIndex(mess => mess._id === action.payload._id) === -1)
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
      if (index !== -1)
        state.messages[index].extraData.react = action.payload.react;
    },
    updateMessage: (state, action) => {
      let index = state.messages.findIndex(mess => mess._id === action.payload._id);
      if (index !== -1)
        state.messages[index] = action.payload;
    },
    markMessageAsSeen: (state, action) => {
      const messageId = action.payload;
      const message = state.messages.find(msg => msg.id === messageId);
      if (message) {
        message.isSeen = true;
      }
    },
    //  setListUserOnline(state, action) {
    //   onsole.log("Updating listUserOnline in state: ", action.payload);
    //         state.listUserOnline = action.payload;
    //     },
  }
});

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    connected: false,
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

const callSlice = createSlice({
  name: 'call',
  initialState: [{
    idGroup: '',
    url: ''
  }],
  reducers: {
    saveCall: (action) => {
      let index = state.findIndex(call => call.idGroup === action.payload.idGroup);
      if (index !== -1)
        state[index] = action.payload;
      else
        state.push(action.payload);
    },
  },
});

const userOnlineSlice = createSlice({
  name: "user",
  initialState: {
    listUserOnline: [],
  },
  reducers: {
    updateListUserOnline: (state, action) => {
      console.log("Đã vào Redux");
      state.listUserOnline = action.payload;
      console.log("List user online: ", state.listUserOnline);
    },
    addUserIntoList: (state, action) => {
      const idUser = action.payload;
      const arr = [...state.listUserOnline];
      if (!arr.includes(idUser)) {
        state.listUserOnline = [...arr, idUser];
      }
    },
    removeUserIntoList: (state, action) => {
      const idUser = action.payload;
      const arr = [...state.listUserOnline];
      if (arr.includes(idUser)) {
        state.listUserOnline = [...arr.filter((item) => item !== idUser)];
      }
    },
  }
});

export const { save, updateAvatar, updateCoverImage, updateLastMessage, addToFriendList, addLastMessage,
  retrieveLastMessage, addLastConversation, deleteConv, updateNickName,
  removeFriend, addFriendRequest, seenMessage } = accountSlice.actions;
export const { saveReceiverId, saveMess, addMess, retrieveMess, deleteMess, reactMessage, markMessageAsSeen, updateMessage } = messSlice.actions;
// export const { deleteConversation } = chatSlice.actions;
export const { initSocket } = socketSlice.actions;
export const { visibleModal, notify } = modalSlice.actions;
export const { updateListUserOnline, addUserIntoList, removeUserIntoList } = userOnlineSlice.actions;
export const { saveCall } = callSlice.actions;
export default accountSlice.reducer;
export const messageReducer = messSlice.reducer;
export const userOnlineReducer = userOnlineSlice.reducer;
// export const chatReducer = chatSlice.reducer
// export const { callAction } = callSlice.actions;
// export const chatReducer = chatSlice.reducer
export const socketReducer = socketSlice.reducer;
export const modalReducer = modalSlice.reducer;
export const callReducer = callSlice.reducer;