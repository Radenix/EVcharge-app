import React, {useState} from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { format } from 'date-fns';

const ArrivalDateSelection = ({ onSelectDate, onSelectTime }) => {

    const [selectedDateOption, setSelectedDateOption] = useState(null);
    const [selectedTimeOption, setSelectedTimeOption] = useState(null);

    const handleSelectDate = (option) => {
      setSelectedDateOption(option);
      onSelectDate(option);
    };

    const handleSelectTime = (option) => {
        setSelectedTimeOption(option);
        onSelectTime(option);
      };

    const timeOptions = [
        { label: '12AM - 5AM', value: '12 AM - 5 AM' },
        { label: '5AM - 8AM', value: '5 AM - 8 AM' },
        { label: '8AM - 12PM', value: '8 AM - 12 AM' },
        { label: '12PM - 5PM', value: '12 AM - 17 AM' },
        { label: '5PM - 8PM', value: '17 AM - 20 AM' },
        { label: '8PM - 12AM', value: '20 AM - 24 AM' },
      ];
  
    const getNextWeekDates = () => {
      let dates = [];
      let currentDate = new Date();
      for (let i = 0; i < 7; i++) {
        let date = new Date(currentDate);
        date.setDate(currentDate.getDate() + i);
        dates.push(date);
      }
      return dates;
    };

    const [dates, setDates] = useState(getNextWeekDates());
  
    return (
      <View style={{flexDirection: 'column', gap:5, marginLeft:10, marginTop:10}}>  
        <ScrollView horizontal>
            {dates.map((date, index) => (
            <TouchableOpacity
                key={index}
                style={{
                padding: 10,
                alignItems: 'center',
                height: 43,
                width: 130,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: selectedDateOption === format(date, 'E, MMM d') ? '#a0cfd3' : 'black',
                backgroundColor: selectedDateOption === format(date, 'E, MMM d') ? '#e5f7f9' : 'white',
                margin: 5,
                }}
                onPress={() => handleSelectDate(format(date, 'E, MMM d'))}
            >
                <Text>{format(date, 'E, MMM d')}</Text>
            </TouchableOpacity>
            ))}
        </ScrollView>
        <Text style={{marginLeft:10, color:'gray'}}>Standard</Text>
        <ScrollView horizontal>
            {timeOptions.map((option, index) => (
                <TouchableOpacity
                key={index}
                style={{
                    padding: 10,
                    alignItems: 'center',
                    height: 43,
                    width: 130,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: selectedTimeOption === option.value ? '#a0cfd3' : 'black',
                    backgroundColor: selectedTimeOption === option.value ? '#e5f7f9' : 'white',
                    margin: 5,
                }}
                onPress={() => handleSelectTime(option.value)}
                >
                <Text>{option.label}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    );
  };
  

export default ArrivalDateSelection;
