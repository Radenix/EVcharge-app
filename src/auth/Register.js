// Register.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert} from "react-native";
import tw from "twrnc";
import axios from 'axios';
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

const Register = ({ setStatus, setPhoneNumber }) => {
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const handleRegister = async () => {
    try {
      const response = await axios.post('http://157.245.22.206/customer/register', {
        phone,
        password,
        deviceToken: "1",
        code: "1",
        requestID: "1"
      });
      if (response.data.status === 200) {
        setStatus('verification');
        setErrorMessage('')
        const maskedPhoneNumber = phone.slice(0, 9) + 'X'.repeat(phone.length - 9);
        setPhoneNumber(maskedPhoneNumber)
      }
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.response.status === 500){
        setErrorMessage(error.response.data.error_message)
      }
    }
  };

  const handleToLogin = () =>{
    setStatus('login')
  }

  const [fontsLoaded] = useFonts({
    'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
  });
  if (!fontsLoaded) {
    return <AppLoading/>;
}
  // tw`text-[#313e47] text-[39px] mb-[30px] items-center`
  return (
    <View style={tw`flex-1 bg-[#eaebed] items-center justify-end h-[100%]`}>
      <Text style={{fontFamily: 'Poppins-Medium', fontSize: 34 , color: '#313e47', marginBottom: 17, width: '85%'}}>Get all your vehicle needs right at your doorstep</Text>
        <TextInput
          style={tw`bg-[#fff] text-[#000] pl-[17px] text-[18px] mb-[15px] rounded-xl w-[85%] h-[8%] `}
          placeholder="Mobile Number"
          placeholderTextColor="#313e49"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoCapitalize="none"
        />
        <TextInput
          style={tw`bg-[#fff] text-[#313e47] pl-[17px] text-[18px] rounded-xl w-[85%] h-[8%] `}
          placeholder="Password"
          placeholderTextColor="#313e47"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        {errorMessage ? <Text style={tw`text-red-600 text-[15px] w-[85%] ml-[10px] mt-[5px]`}>{errorMessage}!</Text> : null}
        <TouchableOpacity style={tw`justify-center items-center bg-[#313e47] mb-[5rem] mt-[25px] rounded-xl w-[85%] h-[8%]`} title="Register" onPress={handleRegister}>
        <Text style={tw`text-[#fff] text-[23px]`}>Get Started</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleToLogin}>
       <Text>pass to login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;
