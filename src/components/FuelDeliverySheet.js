import React, { useState, useRef, useEffect } from "react";
import {View, Text, Dimensions, PanResponder, Animated, TouchableOpacity, BackHandler, Alert} from "react-native";
import { SvgXml } from "react-native-svg";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import ChargeTypeSelection from "./ChargeTypeSelection";
import ArrivalDateSelection from "./ArrivalDateSelection";
import AddingVehicleSheet from "./AddingVehicleSheet";
import * as SecureStore from "expo-secure-store";
import Checkbox from "expo-checkbox";
import axios from 'axios';
import LocationSheet from "./LocationSheet";


const { width, height } = Dimensions.get("window");

const FuelDeliverySheet = ({setFuelDeliverySheetPositionSup ,fuelDeliverySheetSup, setFuelDeliverySheetSup, fuelDeliverySheetPositionSup}) => {
  const fuelDeliverySheetPosition = useRef(new Animated.Value(height)).current;
  setFuelDeliverySheetPositionSup(fuelDeliverySheetPosition);

  const [activeAccordion, setActiveAccordion] = useState(null);

  const arrowIcon = `<svg fill="#39434e" height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve" stroke="#39434e">

  <g id="SVGRepo_bgCarrier" stroke-width="0"/>
  
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
  
  <g id="SVGRepo_iconCarrier"> <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"/> </g>
  
  </svg>`;
  const electricStation = `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="748" viewBox="0 0 520 748" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M402.83 90.78L519.71 207.66V494.58C519.71 551.93 501.84 582.97 441 582.97H344.31V649.62H39.27V0.840027H344.31V526.73H441C466.66 526.73 463.46 523.01 463.46 494.58V230.94L363.08 130.55L402.83 90.78ZM0.950012 675.66H382.64V747.83H0.950012V675.66ZM227.99 327.61H150.28L106.63 438.33L173.16 447.64L130.04 578.06L276.95 405.59L186.46 407.72L227.99 327.61ZM89.87 66.25H293.73V223.99H89.87V66.25Z" fill="#55a9ad"/>
  </svg>`
  const carIcon = `<svg height="800px" width="800px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="" stroke="">
  <g id="SVGRepo_bgCarrier" stroke-width="0"/>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
  <g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#39434e;} </style> <g> <path class="st0" d="M495.144,222.319h-23.666l-57.053-99.424H202.691l-79.664,99.424H25.062 c-15.469,0-27.236,13.815-24.722,29.086l15.072,91.822c0,0.726,0.594,1.388,1.322,1.388h64.387 c3.305-28.757,27.764-51.166,57.379-51.166s54.076,22.409,57.381,51.166H343.43c3.305-28.757,27.766-51.166,57.381-51.166 s54.074,22.409,57.381,51.166h36.953c9.32,0,16.856-7.537,16.856-16.858v-88.583C512,229.855,504.465,222.319,495.144,222.319z M327.894,162.559h57.906l35.898,59.76l1.254,3.709l0.268,0.984h-95.326V162.559z M179.853,226.923l1.879-4.604l47.799-59.76 h53.016v64.454h-74.61L179.853,226.923z"/> <path class="st0" d="M138.5,313.282c-18.707,0-34.242,13.552-37.348,31.334c-0.398,2.114-0.598,4.362-0.598,6.611 c0,20.889,16.99,37.878,37.945,37.878c20.957,0,37.946-16.99,37.946-37.878c0-2.248-0.198-4.496-0.594-6.611 C172.744,326.833,157.209,313.282,138.5,313.282z"/> <path class="st0" d="M400.81,313.282c-18.709,0-34.244,13.552-37.35,31.334c-0.398,2.114-0.596,4.362-0.596,6.611 c0,20.889,16.988,37.878,37.945,37.878c20.955,0,37.944-16.99,37.944-37.878c0-2.248-0.198-4.496-0.594-6.611 C435.053,326.833,419.518,313.282,400.81,313.282z"/> </g> </g>
  </svg>`
  const locationIcon = `<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve" fill="#39434e" stroke="#39434e">
  <g id="SVGRepo_bgCarrier" stroke-width="0"/>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
  <g id="SVGRepo_iconCarrier"> <path fill="" d="M32,0C18.746,0,8,10.746,8,24c0,5.219,1.711,10.008,4.555,13.93c0.051,0.094,0.059,0.199,0.117,0.289l16,24 C29.414,63.332,30.664,64,32,64s2.586-0.668,3.328-1.781l16-24c0.059-0.09,0.066-0.195,0.117-0.289C54.289,34.008,56,29.219,56,24 C56,10.746,45.254,0,32,0z M32,32c-4.418,0-8-3.582-8-8s3.582-8,8-8s8,3.582,8,8S36.418,32,32,32z"/> </g>
  </svg>`
  const clockIcon = `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="">
  <g id="SVGRepo_bgCarrier" stroke-width="0"/>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
  <g id="SVGRepo_iconCarrier"> <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="#39434e"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V11.6893L15.0303 13.9697C15.3232 14.2626 15.3232 14.7374 15.0303 15.0303C14.7374 15.3232 14.2626 15.3232 13.9697 15.0303L11.4697 12.5303C11.329 12.3897 11.25 12.1989 11.25 12V8C11.25 7.58579 11.5858 7.25 12 7.25Z" fill="white"/> </g>
  </svg>`


  // const [isCollapsed1, setIsCollapsed1] = useState(true);
  const [isCollapsed2, setIsCollapsed2] = useState(true);
  const [isCollapsed3, setIsCollapsed3] = useState(true);
  const [isCollapsed4, setIsCollapsed4] = useState(true);

  const toggleAccordion = (accordionNumber) => {
    
    if (accordionNumber === 2) {
      setIsCollapsed2(!isCollapsed2);
      // setIsCollapsed1(true);
      setIsCollapsed3(true);
      setIsCollapsed4(true);
      setActiveAccordion(2);
    } else if (accordionNumber === 3) {
      setIsCollapsed3(!isCollapsed3);
      // setIsCollapsed1(true);
      setIsCollapsed2(true);
      setIsCollapsed4(true);
      setActiveAccordion(3);
    } else if (accordionNumber === 4) {
      setIsCollapsed4(!isCollapsed4);
      // setIsCollapsed1(true);
      setIsCollapsed2(true);
      setIsCollapsed3(true);
      setActiveAccordion(4);
    } else if (accordionNumber === 0) {
      // setIsCollapsed1(true);
      setIsCollapsed2(true);
      setIsCollapsed3(true);
      setIsCollapsed4(true);
      setActiveAccordion(null);
    }
  };

  const [fontsLoaded] = useFonts({
    "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
  });

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderMove: (evt, gestureState) => {
      fuelDeliverySheetPosition.setValue(gestureState.dy);
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy > 100) {
        Animated.timing(fuelDeliverySheetPosition, {
          toValue: height,
          duration: 800,
          useNativeDriver: false,
        }).start(() => setFuelDeliverySheetSup(false));
      } else {
        Animated.spring(fuelDeliverySheetPosition, {
          toValue: 0,
          friction: 5,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  useEffect(() => {
    const backAction = () => {
      if (fuelDeliverySheetSup) {
        Animated.timing(fuelDeliverySheetPosition, {
          toValue: height,
          duration: 800,
          useNativeDriver: false,
        }).start(() => setFuelDeliverySheetSup(false));
        return true;
      }
      return false;
    };
  
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
  
    return () => backHandler.remove();
  }, [fuelDeliverySheetSup]);
  
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCharge, setSelectedCharge] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicles, setVehicles] = useState([]);

  const [isAddingVehicleSheetOpen, setIsAddingVehicleSheetOpen] = useState(false);


  const toggleAddingVehicleSheet = () => {
    if (isAddingVehicleSheetOpen) {
      setIsAddingVehicleSheetOpen(false);
      setFuelDeliverySheetSup(true);
      Animated.timing(fuelDeliverySheetPosition, {
        toValue: 0,
        duration: 800,
        useNativeDriver: false,
      }).start();
    } else {
      setIsAddingVehicleSheetOpen(true);
      if (fuelDeliverySheetSup) {
        Animated.timing(fuelDeliverySheetPosition, {
          toValue: height,
          duration: 800,
          useNativeDriver: false,
        }).start(() => setFuelDeliverySheetSup(false));
      }    
  };
};

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("access_token");
        const userId = await SecureStore.getItemAsync("userId");
        const response = await fetch(`http://164.90.242.76/vehicles?customer_id=${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setVehicles(data);
        } else {
          console.error("Failed to fetch vehicles. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  // useEffect(() => {
  //   onSelectSuggestion(onSelectedSuggestion)
  // }, [onSelectedSuggestion])

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
  };


  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);

  const toggleLocationSheet = () => {
    if (isLocationSheetOpen) {
      setIsLocationSheetOpen(false);
      setFuelDeliverySheetSup(true);
      Animated.timing(fuelDeliverySheetPosition, {
        toValue: 0,
        duration: 800,
        useNativeDriver: false,
      }).start();
    } else {
      setIsLocationSheetOpen(true);
      if (fuelDeliverySheetSup) {
        Animated.timing(fuelDeliverySheetPosition, {
          toValue: height,
          duration: 800,
          useNativeDriver: false,
        }).start(() => setFuelDeliverySheetSup(false));
      }
    }
  };
  
  



  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View>
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "transparent",
          padding: 16,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 'auto',
          alignItems: "center",
        },
        { transform: [{ translateY: fuelDeliverySheetPosition }] },
      ]}
      {...panResponder.panHandlers}
    >
      <View
        style={{
          flex: 1,
          width: "98%",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 7,
        }}
      >
        <TouchableOpacity onPress={toggleLocationSheet}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 15,
              overflow: "hidden",
              height: 65,
            }}
          >
              <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15}}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 7}}>
                  <SvgXml xml={locationIcon} width={27} height={26}/>
                  {selectedLocation === null ?
                   <Text style={{fontFamily: 'Poppins-Regular', marginTop: 3}}>Select a location</Text>
                    :
                   <Text style={{fontFamily: 'Poppins-Regular', marginTop: 3}}>{selectedLocation}</Text>
                  }
                </View>
                <Text>
                  <SvgXml xml={arrowIcon} width={17} height={17} style={{transform: [{rotate: '90deg'}]}} />
                </Text>
              </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity disabled={activeAccordion === 2} activeOpacity={.8} onPress={() => toggleAccordion(2)}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 15,
              overflow: "hidden",
              height: activeAccordion === 2 ? 'auto' : 65,
            }}
          >
            {activeAccordion === 2 ? 
            <View style={{flex:1, position: 'relative', height: 'auto'}}>
              <View style={{flex:1, marginBottom:30, marginTop: 5}}>
              {vehicles.length === 0 ? (
                <Text style={{ color: 'gray', fontSize: 16, marginTop: 20, marginBottom: 5, marginLeft: 17 }}>There are no vehicles added here</Text>
              ) : (
                vehicles.map(vehicle => (
                  <View key={vehicle.id}>
                    <TouchableOpacity onPress={() => handleSelectVehicle(vehicle)}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 5 }}>
                        <View style={{ flexDirection: 'column', gap: -7 }}>
                          <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15 }}>{vehicle.car_brand} {vehicle.car_model}</Text>
                          <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 13, color: '#dbdbdc' }}>{vehicle.plate_number}</Text>
                        </View>
                        <Checkbox
                          value={selectedVehicle && selectedVehicle.id === vehicle.id}
                          onValueChange={() => handleSelectVehicle(vehicle)}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                ))
              )}
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, position: 'absolute', bottom: 0, width:'100%' }}>
                <TouchableOpacity onPress={toggleAddingVehicleSheet} style={{flexDirection: 'row' ,alignItems: 'center', gap: 5}}><Text style={{fontSize: 27, color:'#55a9ad'}}>+</Text><Text style={{color:'#55a9ad', marginTop: 2}}>Add a new vehicle</Text></TouchableOpacity> 
                <TouchableOpacity activeOpacity={.8} onPress={() => toggleAccordion(0)}>
                  <SvgXml xml={arrowIcon} width={17} height={17} style={{transform: [{rotate: '270deg'}], marginTop: 2}}  />
                </TouchableOpacity>
              </View>
            </View>
            :               
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15}}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 7}}>
                <SvgXml xml={carIcon} width={27} height={27}/>
                {selectedVehicle ? <Text style={{fontFamily: 'Poppins-Regular', marginTop: 3}}>{selectedVehicle.car_brand}</Text> : <Text style={{fontFamily: 'Poppins-Regular', marginTop: 3}}>Select a vehicle</Text>}
              </View>
              <Text>
                <SvgXml xml={arrowIcon} width={17} height={17} style={{transform: [{rotate: '90deg'}]}}  />
              </Text>
            </View>
          }
          </View>
        </TouchableOpacity>
        <TouchableOpacity disabled={activeAccordion === 3} activeOpacity={.8} onPress={() => toggleAccordion(3)}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 15,
              overflow: "hidden",
              height: activeAccordion === 3 ? 120 : 65,
            }}
          >
            {activeAccordion === 3 ? 
            <View style={{flex:1}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, width:'100%', alignItems: 'center', marginTop: 8}}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 7}}>
                  <SvgXml xml={electricStation} width={27} height={27}/>
                  <Text style={{fontFamily: 'Poppins-Regular', marginTop: 3}}>Select charge type</Text>
                </View>
                <TouchableOpacity activeOpacity={.8} onPress={() => toggleAccordion(0)}>
                  <SvgXml xml={arrowIcon} width={17} height={17} style={{transform: [{rotate: '270deg'}]}}  />
                </TouchableOpacity>
              </View>
              <ChargeTypeSelection onSelect={setSelectedCharge}/>
            </View>
            :             
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15}}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 7}}>
                <SvgXml xml={electricStation} width={27} height={27}/>
                {selectedCharge === null ? <Text style={{fontFamily: 'Poppins-Regular', marginTop: 3}}>Select charge type</Text> : <Text style={{fontFamily: 'Poppins-Regular', marginTop: 3}}>{selectedCharge}</Text>}
              </View>
              <Text>
                <SvgXml xml={arrowIcon} width={17} height={17} style={{transform: [{rotate: '90deg'}]}}  />
              </Text>
            </View>
          }
          </View>
        </TouchableOpacity>
        <TouchableOpacity disabled={activeAccordion === 4} activeOpacity={.8} onPress={() => toggleAccordion(4)}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 15,
              overflow: "hidden",
              height: activeAccordion === 4 ? 190 : 65,
            }}
          >
            {activeAccordion === 4 ? 
              <View style={{flex:1}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, width:'100%', alignItems: 'center', marginTop: 8}}>
                  <View style={{flexDirection: 'row', alignItems: 'center', gap: 7}}>
                    <SvgXml xml={clockIcon} width={27} height={27}/>
                    <Text style={{fontFamily: 'Poppins-Regular', marginTop: 3}}>Select arrival date and time</Text>
                  </View>
                  <TouchableOpacity activeOpacity={.8} onPress={() => toggleAccordion(0)}>
                    <SvgXml xml={arrowIcon} width={17} height={17} style={{transform: [{rotate: '270deg'}]}}  />
                  </TouchableOpacity>
                </View>
                <ArrivalDateSelection onSelectDate={setSelectedDate} onSelectTime={setSelectedTime}/>
              </View>
            : 
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15}}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 7}}>
                <SvgXml xml={clockIcon} width={27} height={27}/>
                {selectedTime === null || selectedDate === null ? <Text style={{fontFamily: 'Poppins-Regular', marginTop: 3}}>Select arrival time and date</Text> : <Text style={{fontFamily: 'Poppins-Regular', marginTop: 3}}>{selectedDate}, {selectedTime}</Text>}
              </View>
              <Text>
                <SvgXml xml={arrowIcon} width={17} height={17} style={{transform: [{rotate: '90deg'}]}}  />
              </Text>
            </View>}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={.8}
          style={{
            backgroundColor: "#39434e",
            height: 65,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontFamily: "Poppins-Regular",
              marginTop: 3,
            }}
          >
            Go to checkout
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
    <AddingVehicleSheet isOpen={isAddingVehicleSheetOpen} onClose={toggleAddingVehicleSheet}/>
    <LocationSheet isOpen={isLocationSheetOpen} onClose={toggleLocationSheet} setSelectedLocation={setSelectedLocation} />
    </View>
  );
};

export default FuelDeliverySheet;
