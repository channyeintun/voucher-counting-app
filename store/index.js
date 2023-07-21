import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import { firestoreApi } from './apis/firestoreApi';
import { setupListeners } from '@reduxjs/toolkit/query'

export const store = configureStore({
      reducer: {
            app: appReducer,
            [firestoreApi.reducerPath]: firestoreApi.reducer,
      },
      middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware({
                  serializableCheck: false
            }).concat(firestoreApi.middleware);
      },
});

setupListeners(store.dispatch)