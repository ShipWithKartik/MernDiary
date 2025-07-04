import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './slice/userSlice'
import storage from 'redux-persist/lib/storage' 
import persistReducer from 'redux-persist/es/persistReducer'
import persistStore from 'redux-persist/es/persistStore'

const rootReducer = combineReducers({
  user: userReducer
})  
// combineReducers is used to combine multiple reducers into a single reducer function
// In this case, we are combining the userReducer into a rootReducer.

const persistConfig = {
  key:'root',
  storage,
  version:1
}
// key:'root' is the key under which the persisted state will be stored in the storage (like localStorage)
// storage is the storage engine we are using to persist the state. Here, we are using redux-persist's default storage, which is localStorage in web applications.
// version:1 is used to manage the versioning of the persisted state.


const persistedReducer = persistReducer(persistConfig,rootReducer);
// This wraps the rootReducer so that Whenever the Redux state changes, it will be saved to the storage defined in persistConfig.



export const store = configureStore({
  reducer: persistedReducer,

  middleware:(getDefaultMiddleware) => {
    return getDefaultMiddleware({serializableCheck: false})
  }
})


export const persistor = persistStore(store);
// This creates a persistor object that saves the Redux state to localStorage and restores it when the app starts.



/*
By Default the Redux store is in memory only which means:
-> When a user refreshes the browser or reopens the app all Redux state is lost.
-> To persist the Redux state across browser refreshes, we use redux-persist

We also use a PersistGate to delay UI rendering until the rehydration is completed 
When we use redux-persist , it restores (rehydrate) the saved Redux state from persistent storage like localStorage into Redux store when app starts 
However this rehydration is asynchronous - it doesn't happen instantly , if our UI renders before the Redux state is restored , components behave incorrectly

PersistGate is a special React component provided by redux-persist. It "gates" or holds back rendering our app's UI until the persisted state has been successfully rehydrated into Redux Store
*/

