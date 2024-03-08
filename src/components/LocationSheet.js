import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, BackHandler, TextInput, FlatList, Alert } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import * as SecureStore from "expo-secure-store";
import { SvgXml } from "react-native-svg";
import axios from 'axios';

const { width, height } = Dimensions.get("window");

const LocationSheet = ({ isOpen, onClose, setSelectedLocation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: isOpen ? 1 : 0,
        duration: 80,
        useNativeDriver: true
      }
    ).start();
  }, [isOpen]);

  const handleBackButton = () => {
    if (isOpen) {
      onClose();
      return true;
    }
    return false;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
  }, [isOpen]);

  const arrowIcon = `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 12H18M6 12L11 7M6 12L11 17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const locationButtonIcon = `<svg width="18" height="21" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M9 4.5C6.92893 4.5 5.25 6.17893 5.25 8.25C5.25 10.3211 6.92893 12 9 12C11.0711 12 12.75 10.3211 12.75 8.25C12.75 6.17893 11.0711 4.5 9 4.5ZM9 10.5C7.75736 10.5 6.75 9.49264 6.75 8.25C6.75 7.00736 7.75736 6 9 6C10.2426 6 11.25 7.00736 11.25 8.25C11.25 9.49264 10.2426 10.5 9 10.5ZM9 0C4.44579 0.00516641 0.755167 3.69579 0.75 8.25C0.75 11.1938 2.11031 14.3138 4.6875 17.2734C5.84552 18.6108 7.14886 19.8151 8.57344 20.8641C8.83177 21.045 9.17573 21.045 9.43406 20.8641C10.856 19.8147 12.1568 18.6104 13.3125 17.2734C15.8859 14.3138 17.25 11.1938 17.25 8.25C17.2448 3.69579 13.5542 0.00516641 9 0ZM9 19.3125C7.45031 18.0938 2.25 13.6172 2.25 8.25C2.25 4.52208 5.27208 1.5 9 1.5C12.7279 1.5 15.75 4.52208 15.75 8.25C15.75 13.6153 10.5497 18.0938 9 19.3125Z" fill="#0D141C"/>
  </svg>
  `

  const fetchSuggestions = async (value) => {
    try {
      const accessToken = await SecureStore.getItemAsync("access_token");
      if (value !== '') {
        const response = await axios.get(`http://164.90.242.76/address/suggest?lat=40.48134258360203&lng=50.01265907799119&query=${value}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setSuggestions(response.data);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };


  

  const handleSelectSuggestion = async (item) => {
    try {
      const accessToken = await SecureStore.getItemAsync("access_token");
      const response = await axios.get(`http://164.90.242.76/address/route?origin=Dəniz%20Mall&destination=${item.address}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const polyline = response.data.polyline;
      const points = decodePolyline(polyline);
      // console.log('Polyline points:', points); 
      // onSelectSuggestion(points);
      setSelectedLocation(item.address)
      onClose();
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };
  
  
  

  const decodePolyline = (encoded) => {
    let index = 0;
    let lat = 0;
    let lng = 0;
    const coordinates = [];
  
    while (index < encoded.length) {
      let b;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;
  
      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;
  
      const point = { latitude: lat / 1e5, longitude: lng / 1e5 };
      coordinates.push(point);
    }
  
    return coordinates;
  };
  
  const handleChangeText = (value) => {
    setQuery(value);
    fetchSuggestions(value);
  };

  const renderSuggestions = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectSuggestion(item)} style={{ flexDirection: 'row', paddingVertical: 8, alignItems: 'center', gap:5 }}>
      <View style={{width:48, height:48, borderRadius: 10, backgroundColor:'#E8EDF2', justifyContent: 'center', alignItems:'center'}}><SvgXml xml={locationButtonIcon}/></View>
      <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15, color: 'black' }}>{item.address}</Text>
      {/* <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 13, color: 'silver' }}>{item.type}</Text> */}
    </TouchableOpacity>
  );

  return (
    <Animated.View style={{ borderTopLeftRadius: 15, borderTopRightRadius: 15, opacity: fadeAnim, height: 600, backgroundColor: 'white', padding: 20, position: 'absolute', bottom: 0, left: 0, right: 0, display: isOpen ? 'flex' : 'none' }}>
      <TouchableOpacity onPress={onClose} style={{ alignSelf: 'flex-start', marginTop: 10 }}>
        <SvgXml xml={arrowIcon} width={26} height={26} style={{ marginTop: -10 }} />
      </TouchableOpacity>

      <TextInput
        value={query}
        onChangeText={handleChangeText}
        placeholder="Search location..."
        style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 15, padding: 10, marginTop: 10 }}
      />

      <FlatList
        data={suggestions}
        renderItem={renderSuggestions}
        keyExtractor={(item, index) => index.toString()}
        // style={{marginLeft:5}}
      />
    </Animated.View>
  );
};

export default LocationSheet;
