import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {},
  reducers: {
    addMessage: (state, { payload }) => {
      const { candidateId, message } = payload;
      if (!state[candidateId]) state[candidateId] = [];
      state[candidateId].push(message);
    },
    resetChat: (state, { payload }) => {
      state[payload] = [];
    },
  },
});

export const { addMessage, resetChat } = chatSlice.actions;
export default chatSlice.reducer;
