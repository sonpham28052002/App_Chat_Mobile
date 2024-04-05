import { createSlice } from '@reduxjs/toolkit';

const accountSlice = createSlice({
  name: 'account',
  initialState: {
  },
  reducers: {
    save: (state, action) => {
      console.log("save:", action.payload)
      Object.assign(state, action.payload);
    },
    updateAvatar: (state, action) => {
      console.log("updateAvatar:", action.payload)
      Object.assign(state, action.payload);
    }
  },
});

// const conversationSlice = createSlice({
//   name: 'message',
//   initialState: {},
//   reducers:{
//     addConversation: (state, action) => {
//       console.log("addConversation:", action.payload)
//       Object.assign(state, action.payload);
//     },
//   }
// });
export const { save, updateAvatar, updateLastMessage } = accountSlice.actions;
// export const { addConversation } = conversationSlice.actions;
export default accountSlice.reducer;
// export const conversationSl = conversationSlice.reducer;
