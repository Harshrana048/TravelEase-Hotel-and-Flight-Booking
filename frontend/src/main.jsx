import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux'
import App from './App.jsx'
import { store } from './redux/store.js'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(

  
     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID} >
    <Provider store={store}>
      <App />
    </Provider>
    </GoogleOAuthProvider>
 
)
console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);