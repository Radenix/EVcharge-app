import React, {useState} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const ChargeTypeSelection = ({ onSelect }) => {

    const [selectedOption, setSelectedOption] = useState(null);

    const handleSelect = (option) => {
      setSelectedOption(option);
      onSelect(option);
    };
  
    return (
      <View style={{ flex:1, flexDirection: 'row', justifyContent: 'center', gap:10, alignItems: 'center' }}>
        <TouchableOpacity onPress={() => handleSelect('Fast Charge')} style={{padding: 10, alignItems: 'center', height:60, width: 130, borderWidth: 1, borderRadius: 10, borderColor: '#5cb082',overflow: 'hidden', position: 'relative'}}>
        <View style={{
        position: 'absolute',
        top: -20,
        left: -40,
        width: 90,
        height: 35,
        backgroundColor: '#5cb082',
        transform: [{rotate:'315deg'}]
        }} />
          <Text style={{ fontWeight: selectedOption === 'Fast Charge' ? 'bold' : 'normal', color: '#5cb082' }}>Fast Charge</Text>
          <Text style={{ fontWeight: selectedOption === 'Fast Charge' ? 'bold' : 'normal', color: 'grey' }}>AZN 2.97/H</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSelect('Regular Charge')} style={{padding: 10, alignItems: 'center', height:60, width: 130, borderWidth: 1, borderRadius: 10, borderColor: '#4c9ad2', overflow: 'hidden', position: 'relative' }}>
        <View style={{
        position: 'absolute',
        top: -20,
        left: -40,
        width: 90,
        height: 35,
        backgroundColor: '#4c9ad2',
        transform: [{rotate:'315deg'}]
        }} />
          <Text style={{ fontWeight: selectedOption === 'Regular Charge' ? 'bold' : 'normal', color: '#4c9ad2' }}>Regular Charge</Text>
          <Text style={{ fontWeight: selectedOption === 'Regular Charge' ? 'bold' : 'normal', color: 'grey' }}>AZN 3.09/H</Text>
        </TouchableOpacity>
      </View>
    );
  };

export default ChargeTypeSelection;
