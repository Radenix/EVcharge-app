import React, { useState, useEffect } from 'react';
import Register from './src/auth/Register';
import Login from './src/auth/Login';
import Home from './src/screens/Home';
import * as Keychain from 'react-native-keychain';
import * as SecureStore from 'expo-secure-store';
import Verification from './src/auth/Verification';
import { Alert } from 'react-native';


const App = () => {
  const [status, setStatus] = useState('register');
  const [phoneNumber, setPhoneNumber] = useState();

  const checkTokenExpiration = async () => {
    const expirationTime = await SecureStore.getItemAsync('access_expiration_time');
    if (expirationTime) {
      const expirationDate = new Date(expirationTime);
      const now = new Date();
      if (expirationDate > now) {
        setStatus('home');
      } else {
        setStatus('register');
      }
    } else {
      setStatus('register');
    }
  };
  
  useEffect(() => {
    checkTokenExpiration();
  }, []);
  

  if (status === 'register') {
    return <Register setStatus={setStatus} setPhoneNumber={setPhoneNumber} />;
  }
  if (status === 'verification') {
    return <Verification setStatus={setStatus} phoneNumber={phoneNumber} />;
  }
  if (status === 'login') {
    return <Login setStatus={setStatus} />;
  }
  if (status === 'home') {
    return <Home setStatus={setStatus} />;
  }
};

export default App;
