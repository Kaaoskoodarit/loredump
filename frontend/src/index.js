import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import {createStore,applyMiddleware,combineReducers} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import loginReducer from './reducers/loginReducer';
import pageReducer from './reducers/pageReducer';
import categoryReducer from './reducers/categoryReducer';
import worldReducer from './reducers/worldReducer';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';
import {themeLight, themeDark} from './theme';



// Combine different reducers into one
const rootReducer = combineReducers({
	login:loginReducer,
	lore:pageReducer,
  category:categoryReducer,
  world:worldReducer
})

// Create a store that contains the state of the app, and handles
// the reducers and actions.
// applyMiddleware lets us inject a function into the store's dispatches! 
// applyMiddleware(thunk) lets us use async actions as if they were normal
const store = createStore(rootReducer,applyMiddleware(thunk));

const root = ReactDOM.createRoot(document.getElementById('root'));
// BrowserRouter allows us to use the URLs of the SPA as if it was a traditional
// website, including "back" and "forward" navigation
// Provider component lets us pass down "store"'s state to all child components
root.render(
  <React.StrictMode>
  <BrowserRouter>
  <Provider store={store}>
    <ThemeProvider theme={themeLight}>
    <CssBaseline enableColorScheme/>
    <App />
    </ThemeProvider>
  </Provider>
  </BrowserRouter>
  </React.StrictMode>
);
