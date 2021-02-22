import { configureStore } from '@reduxjs/toolkit';
import { statusSlice } from '../features/statusSlice';

const store = configureStore({
  reducer: {
    status: statusSlice.reducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
