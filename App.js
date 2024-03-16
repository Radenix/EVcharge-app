import React, { useState, useEffect } from 'react';
import Register from './src/auth/Register';
import Login from './src/auth/Login';
import MainScreen from './src/screens/MainScreen';
import * as Keychain from 'react-native-keychain';
import * as SecureStore from 'expo-secure-store';
import Verification from './src/auth/Verification';
import { TouchableWithoutFeedback, Alert, View } from 'react-native';
import * as NavigationBar from "expo-navigation-bar"


const App = () => {

  const [status, setStatus] = useState('Register');
  const [phoneNumber, setPhoneNumber] = useState();

  const checkTokenExpiration = async () => {
    const expirationTime = await SecureStore.getItemAsync('access_expiration_time');
    if (expirationTime) {
      const expirationDate = new Date(expirationTime);
      const now = new Date();
      if (expirationDate > now) {
        setStatus('MainScreen');
      } else {
        setStatus('Register');
      }
    } else {
      setStatus('Register');
    }
  };
  
  useEffect(() => {
    checkTokenExpiration();
  }, []);

  // const [barVisibility, setBarVisibility] = useState('hidden');

  NavigationBar.setVisibilityAsync('hidden');
  NavigationBar.setBehaviorAsync('inset-swipe');

  if (status === 'Register') {
    return <Register setStatus={setStatus} setPhoneNumber={setPhoneNumber} />;
  }
  if (status === 'Verification') {
    return <Verification setStatus={setStatus} phoneNumber={phoneNumber} />;
  }
  if (status === 'Login') {
    return <Login setStatus={setStatus} />;
  }
  if (status === 'MainScreen') {
    return <MainScreen setStatus={setStatus} />;
  }
};

export default App;
