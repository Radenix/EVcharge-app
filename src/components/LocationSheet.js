import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, BackHandler, TextInput, FlatList, Alert } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import * as SecureStore from "expo-secure-store";
import { SvgXml } from "react-native-svg";
import axios from 'axios';

const { width, height } = Dimensions.get("window");

const LocationSheet = ({ isOpen, onClose, onSelectSuggestion }) => {
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
      onSelectSuggestion(points);
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
    <TouchableOpacity onPress={() => handleSelectSuggestion(item)} style={{ flexDirection: 'column', gap: -5, paddingVertical: 5 }}>
      <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15, color: 'black' }}>{item.address}</Text>
      <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 13, color: 'silver' }}>{item.type}</Text>
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
        style={{marginLeft:5}}
      />
    </Animated.View>
  );
};

export default LocationSheet;
