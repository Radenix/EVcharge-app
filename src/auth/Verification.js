import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, TouchableOpacity, Alert} from "react-native";
import tw from "twrnc";
import axios from 'axios';
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import OTPinput from '../components/OTPinput';

const Verification = ({setStatus, phoneNumber}) => {
    const [fontsLoaded] = useFonts({
        'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
      });

    const [resendDisabled, setResendDisabled] = useState(true);
    const [countdown, setCountdown] = useState(300);

    useEffect(() => {
      let interval;
      if (resendDisabled) {
          interval = setInterval(() => {
              setCountdown((prev) => {
                  if (prev === 0) {
                      setResendDisabled(false);
                      clearInterval(interval);
                      return 300;
                  } else {
                      return prev - 1;
                  }
              });
          }, 1000);
      }
      return () => clearInterval(interval);
  }, [resendDisabled]);

  const handleResend = () => {
    setResendDisabled(true);
  };

  if (!fontsLoaded) {
    return <AppLoading/>;
  }

  return (
    <View style={tw`flex-1 bg-[#eaebed] items-center pt-[15%] h-[100%]`}>
        <Text style={{fontFamily: 'Poppins-Medium', fontSize: 30 , color: '#313e47', width: '85%'}}>Verify your account</Text>
        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 16 , marginTop: 50, color: '#313e47', width: '85%'}}>Please enter verification code sent to</Text>
        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 16 , marginTop: 20, paddingBottom: 38, color: '#6fccd3', width: '85%'}}>{phoneNumber}</Text>
        <OTPinput setStatus={setStatus}/>
        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 16 , marginTop: 35, color: '#313e47', width: '85%'}}>This code is valid for 5 minutes</Text>
        {resendDisabled ? (
                <Text style={{fontFamily: 'Poppins-Regular', fontSize: 16 , marginTop: 15, paddingBottom: 38, color: '#5f6c70', width: '85%'}}>Resend code in {Math.floor(countdown / 60)}:{countdown % 60 < 10 ? '0' : ''}{countdown % 60}</Text>
            ) : (
                <TouchableOpacity onPress={handleResend} style={{width: '85%'}}>
                    <Text style={{fontFamily: 'Poppins-Regular', fontSize: 16 , marginTop: 15, color: '#6fccd3', width: '85%', textAlign: 'left'}}>Resend code</Text>
                </TouchableOpacity>
            )}
    </View>
  )
}

export default Verification;
