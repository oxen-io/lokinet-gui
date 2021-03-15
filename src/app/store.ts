import { configureStore } from '@reduxjs/toolkit';
import { exitStatusSlice } from '../features/exitStatusSlice';
import { generalInfosSlice } from '../features/generalInfosSlice';
import { statusSlice } from '../features/statusSlice';
import { uiSlice } from '../features/uiStatusSlice';

export const store = configureStore({
  reducer: {
    status: statusSlice.reducer,
    generalInfos: generalInfosSlice.reducer,
    exitStatus: exitStatusSlice.reducer,
    uiStatus: uiSlice.reducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
