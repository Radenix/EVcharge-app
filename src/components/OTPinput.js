import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput } from 'react-native';

const OTPinput = ({setStatus}) => {
  const [otp, setOtp] = useState('');
  const [stat, setStat] = useState('');
  const refs = useRef([]);

  const handleOtpChange = (text, index) => {
    if (/^\d+$/.test(text) || text === '') {
      setOtp((prevOtp) => {
        const updatedOtp = prevOtp.split('');
        updatedOtp[index] = text;
        const newOtp = updatedOtp.join('');
  
        if (text === '' && index > 0) {
          refs.current[index - 1].focus();
        }
  
        if (text !== '' && index < 3) {
          refs.current[index + 1].focus();
        }

        if (newOtp.length === 4) {
          setStatus('login');
        }
        
        return newOtp;
      });
    }
  };

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', width: '60%' }}>
      {[0, 1, 2, 3].map((index) => (
        <View key={index} style={{ width: '32%',aspectRatio: 1, backgroundColor: 'white', borderRadius: 15, marginHorizontal: 5, alignItems: 'center', justifyContent: 'center' }}>
          <TextInput
            style={{ fontSize: 30, textAlign: 'center', margin: 'auto', height: '80%' }}
            maxLength={1}
            keyboardType="numeric"
            value={otp[index] || ''}
            onChangeText={(text) => handleOtpChange(text, index)}
            ref={(input) => {
              refs.current[index] = input;
            }}
          />
        </View>
      ))}
    </View>
  );
};

export default OTPinput;
