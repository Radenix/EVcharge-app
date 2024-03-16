// Checkout.js

import React, {useEffect, useState} from "react";
import { View, Text, TouchableOpacity, BackHandler } from "react-native";
import { SvgXml } from "react-native-svg";

const Checkout = ({ onClose, isOpen, selectedLocation, selectedVehicle, selectedCharge  }) => {

  const arrowIcon = `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 12H18M6 12L11 7M6 12L11 17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

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

  return (
    <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <View style={{ backgroundColor: "#fff", width: "100%", height: "100%", padding: 20, position: 'relative' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: "100%", justifyContent: 'center', position: 'relative', marginTop: 15 }}>
          <TouchableOpacity onPress={onClose} style={{position: 'absolute', left: 0}}>
            <SvgXml xml={arrowIcon} width={26} height={26}/>
          </TouchableOpacity>  
          <Text style={{ fontSize: 20, fontFamily: "Poppins-Regular", marginTop: 5 }}>
            Checkout
          </Text>
        </View>
        <View style={{marginTop: 20, flexDirection: 'column', gap:30}}>
          <View style={{flexDirection:'column'}}> 
            <Text style={{fontSize: 19, fontFamily: 'Poppins-Medium'}}>Selected Vehicle:</Text>
            {selectedVehicle &&
            <Text style={{fontSize: 15, fontFamily:'Poppins-Regular'}}>{selectedVehicle.car_brand} {selectedVehicle.car_model} - {selectedVehicle.plate_number}</Text>
            }
          </View>
          <View style={{flexDirection:'column'}}> 
            <Text style={{fontSize: 19, fontFamily: 'Poppins-Medium'}}>Charge Type:</Text>
            {selectedCharge &&
            <Text style={{fontSize: 15, fontFamily:'Poppins-Regular', color: selectedCharge === 'Fast Charge' ? '#5cb082' : '#4c9ad2'}}>{selectedCharge}</Text>
            }
          </View>
          <View style={{flexDirection:'column'}}> 
            <Text style={{fontSize: 19, fontFamily: 'Poppins-Medium'}}>Address:</Text>
            {selectedLocation &&
            <Text style={{fontSize: 15, fontFamily:'Poppins-Regular'}}>{selectedLocation}</Text>
            }
          </View>
        </View>

        <View style={{flex:1, justifyContent: 'flex-end'}}>
          <TouchableOpacity
            style={{ backgroundColor: "#39434e", height: 65, borderRadius: 15, justifyContent: "center", alignItems: "center", width: "100%"}}>
            <Text style={{ color: "#fff", fontSize: 18, fontFamily: "Poppins-Regular", marginTop: 3 }}>
              Place Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Checkout;
