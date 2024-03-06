import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  Animated,
  TouchableOpacity,
  PanResponder,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import MapView, {Polyline} from "react-native-maps";
import { SvgXml } from "react-native-svg";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import ServiceSelection from "../components/ServiceSelection";
import FuelDeliverySheet from "../components/FuelDeliverySheet";


const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Home = ({ setStatus }) => {
  const [selectService, setSelectService] = useState(true);
  const [fuelDeliverySheetSup, setFuelDeliverySheetSup] = useState(false);
  const [fuelDeliverySheetPositionSup, setFuelDeliverySheetPositionSup] = useState();
  const [toggleMenu, setToggleMenu] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [polyline, setPolyline] = useState([]);

  const pan = useRef(new Animated.ValueXY()).current;

  const logoutIcon = `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#f00505">
  <g id="SVGRepo_bgCarrier" stroke-width="0"/>
  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
  <g id="SVGRepo_iconCarrier"> <path d="M9.00195 7C9.01406 4.82497 9.11051 3.64706 9.87889 2.87868C10.7576 2 12.1718 2 15.0002 2L16.0002 2C18.8286 2 20.2429 2 21.1215 2.87868C22.0002 3.75736 22.0002 5.17157 22.0002 8L22.0002 16C22.0002 18.8284 22.0002 20.2426 21.1215 21.1213C20.2429 22 18.8286 22 16.0002 22H15.0002C12.1718 22 10.7576 22 9.87889 21.1213C9.11051 20.3529 9.01406 19.175 9.00195 17" stroke="#f00505" stroke-width="1.5" stroke-linecap="round"/> <path d="M15 12L2 12M2 12L5.5 9M2 12L5.5 15" stroke="#f00505" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </g>
  </svg>` 
  const menuIcon = `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 6H20M4 12H20M4 18H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`

  const handleMapRegionChange = () => {
    setSelectService(false);
    setToggleMenu(false);
  };

  const handleMapRegionChangeComplete = () => {
    setSelectService(true);
    setToggleMenu(true);
  };

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(pan, {
      toValue: { x: 0, y: 0 },
      duration: 200,
      useNativeDriver: false
    }).start();
  };

  const handleCloseDrawer = () => {
    Animated.timing(pan, {
      toValue: { x: -200, y: 0 },
      duration: 200,
      useNativeDriver: false
    }).start(() => {
      setDrawerOpen(false);
    });
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      if (drawerOpen && gestureState.dx < 0) {
        pan.setValue({ x: gestureState.dx, y: 0 });
      }
    },
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dx < -100) {
        handleCloseDrawer();
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false
        }).start();
      }
    }
  });


  const handleLogout = async () => {
    try {
      const userId = await SecureStore.getItemAsync("userId");
      const accessToken = await SecureStore.getItemAsync("access_token")
      await fetch(`http://67.207.72.73/users/logout?userId=${userId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      await SecureStore.deleteItemAsync("userId");
      await SecureStore.deleteItemAsync("access_token");
      await SecureStore.deleteItemAsync("refresh_token");
      await SecureStore.deleteItemAsync("access_expiration_time");
      setStatus("login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const [fontsLoaded] = useFonts({
    "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1, position: "relative" }}
        initialRegion={{
          latitude: 40.4093,
          longitude: 49.8671,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        showsUserLocation={true}
        onRegionChange={handleMapRegionChange}
        onRegionChangeComplete={handleMapRegionChangeComplete}
      >
        <Polyline 
          coordinates={polyline}
          strokeColor="#000"
          strokeWidth={6}  
          lineDashPattern={[1]}
        />
      </MapView>
      <TouchableOpacity onPress={handleOpenDrawer} style={{display: toggleMenu ? 'flex' : 'none', position: 'absolute', top: 30, left: 10, padding: 10, zIndex: 2}}>
        <SvgXml xml={menuIcon} width={30} height={30}/>
      </TouchableOpacity>
      {drawerOpen && (
        <Animated.View style={{position: 'absolute', top: 0, left: 0, bottom: 0, width: 200, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 2, height: 0 }, shadowOpacity: 0.3, shadowRadius: 2, elevation: 5, zIndex: 1, transform: [{ translateX: pan.x }]}} {...panResponder.panHandlers}>
          <TouchableOpacity onPress={handleLogout} style={{flexDirection:'row', alignSelf:'center', alignItems:'center', gap:5, padding: 15, backgroundColor: '#fff', borderWidth: 1, borderRadius:10, borderColor: '#f00505', width:'95%', marginTop: 50}}>
            <SvgXml xml={logoutIcon} width={20} height={20}/>
            <Text style={{color:'#f00505', fontFamily: 'Poppins-Regular', marginTop:3}}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      <View style={{ display: drawerOpen ? 'none' : 'flex' }}>
        <ServiceSelection
          selectService={selectService}
          fuelDeliverySheetPositionSup={fuelDeliverySheetPositionSup}
          setFuelDeliverySheetSup={setFuelDeliverySheetSup}
          fuelDeliverySheetSup={fuelDeliverySheetSup}
        />
      </View>
      <View style={{ display: drawerOpen ? 'none' : 'flex' }}>
        <FuelDeliverySheet
          setFuelDeliverySheetPositionSup={setFuelDeliverySheetPositionSup}
          fuelDeliverySheetSup={fuelDeliverySheetSup}
          setFuelDeliverySheetSup={setFuelDeliverySheetSup}
          onSelectSuggestion={setPolyline}
        />
      </View>
    </View>
  );
};

export default Home;
