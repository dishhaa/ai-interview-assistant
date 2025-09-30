import { createSlice } from "@reduxjs/toolkit";

const candidateSlice = createSlice({
  name: "candidates",
  initialState: {
    list: [],
  },
  reducers: {
    addCandidate: (state, action) => {
      state.list.push({
        id: action.payload.id,
        name: action.payload.name,
        email: action.payload.email,
        phone: action.payload.phone,
        score: 0,
        status: "Pending",
        summary: "",
        chat: [],
      });
    },
    updateCandidate: (state, action) => {
      const { id, data } = action.payload;
      const index = state.list.findIndex((c) => c.id === id);
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...data };
      }
    },
    removeCandidate: (state, action) => {
      state.list = state.list.filter((c) => c.id !== action.payload);
    },
  },
});

export const { addCandidate, updateCandidate, removeCandidate } =
  candidateSlice.actions;
export default candidateSlice.reducer;
