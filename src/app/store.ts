import { configureStore } from '@reduxjs/toolkit';
import { generalInfosSlice } from '../features/generalInfosSlice';
import { statusSlice } from '../features/statusSlice';

export const store = configureStore({
  reducer: {
    status: statusSlice.reducer,
    generalInfos: generalInfosSlice.reducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
