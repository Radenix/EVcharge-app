import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, ScrollView, BackHandler, TextInput, FlatList, Alert } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import * as SecureStore from "expo-secure-store";
import { SvgXml } from "react-native-svg";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
const { width, height } = Dimensions.get("window");

const AddingVehicleSheet = ({ isOpen, onClose }) => {

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [searchMake, setSearchMake] = useState('');
  const [searchModel, setSearchModel] = useState('');
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMake, setSelectedMake] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [cityNumber, setCityNumber] = useState('');
  const [serieInput, setSerieInput] = useState('');
  const [carNumberInput, setCarNumberInput] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  
  
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

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("access_token");
        const response = await fetch(`http://67.207.72.73/cararchive?year=${selectedYear}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setBrands(data.map(item => item.make));
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Error fetching car brands:", error);
      }
    };
  
    if (selectedYear) {
      fetchBrands();
    }
  }, [selectedYear]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        let apiUrl = `http://67.207.72.73/cararchive?year=${selectedYear}`;
        if (selectedMake) {
          apiUrl += `&make=${selectedMake}`;
        }
        const accessToken = await SecureStore.getItemAsync("access_token")
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setModels(data.map(item => item.model));
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Error fetching car models:", error);
      }
    };
  
    if (selectedYear && selectedMake !== null) {
      fetchModels();
    }
  }, [selectedYear, selectedMake]);


  useEffect(() => {
    setFilteredBrands(brands.filter(brand => brand.toLowerCase().includes(searchMake.toLowerCase())));
  }, [searchMake, brands]);

  useEffect(() => {
    setFilteredModels(models.filter(model => model.toLowerCase().includes(searchModel.toLowerCase())));
  }, [searchModel, models]);

  const handleChangeMake = () => {
    setSelectedModel(null);
    setSelectedMake(null);
  };

  const handleChangeModel = () => {
    setSelectedModel(null);
    setSelectedColor(null);
  };

  const handleChangeColor = () => {
    setSelectedColor(null);
    setPlateNumber(null);
  }


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

  const ColorSquare = ({ colors, label  }) => {
    return (
      <View style={{ flexDirection: 'column', alignItems: 'center', gap:10 }}>
        <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ width: 50, height: 50, borderRadius: 10 }}
        />
        <Text style={{color: '#a8a6a8', fontFamily: 'Poppins-Regular'}}>{label}</Text>
      </View>
    );
  };

  const handleAdd = async () => {
    if (cityNumber && serieInput && carNumberInput) {
      setPlateNumber(`${cityNumber}${serieInput}${carNumberInput}`);
      try {
        const accessToken = await SecureStore.getItemAsync("access_token");
        const userId = parseInt(await SecureStore.getItemAsync("userId"), 10);
        const response = await axios.post("http://67.207.72.73/vehicles", {
          customer_id: userId,
          color: selectedColor,
          plate_number: `${cityNumber}${serieInput}${carNumberInput}`,
          car_brand: selectedMake,
          car_model: selectedModel,
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          setSelectedColor(null);
          setPlateNumber(null);
          setSelectedMake(null);
          setSelectedModel(null);
          onClose;
        } else {
          console.error("Failed to add vehicle. Status:", response.status);
        }
      } catch (error) {
        console.error("Error adding vehicle:", error);
      }
    } else {
      console.error("Plate number is required.");
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
    <Animated.View style={{ borderTopLeftRadius: 15, borderTopRightRadius: 15, opacity: fadeAnim, height: 'auto', backgroundColor: 'white', padding: 20, position: 'absolute', bottom: 0, left: 0, right: 0, display: isOpen ? 'flex' : 'none' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <TouchableOpacity onPress={(selectedMake && selectedModel === null) && selectedColor === null ? handleChangeMake : ((selectedMake !== null && selectedModel !== null) && selectedColor === null ? handleChangeModel : (selectedMake !== null && selectedModel !== null) && selectedColor !== null ? handleChangeColor : onClose)} style={{ position: 'absolute', left: 0 }}>
          <SvgXml xml={arrowIcon} height={26} width={26} />
        </TouchableOpacity>
        {selectedModel === null ? 
          <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 17 }}>Add your vehicle</Text>
          : 
          (!selectedColor ?
          <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 17 }}>What color is it?</Text>
          :
          <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 17 }}>What's your plate number?</Text>
          )
        }
      </View>

      {selectedModel === null ? 
      <View style={{ borderColor: 'gray', borderWidth: 1, borderRadius: 13, height:55, marginTop:15 }}>
        <Picker
          selectedValue={selectedYear}
          style={{height:50, width: '100%' }}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
        >
          {selectedYear ? null : <Picker.Item label="Select the production year of your car" value="" color="gray" fontFamily='Poppins-Regular' />}
          {Array.from({ length: 2024 - 1997 + 1 }, (_, index) => 2024 - index).map((year) => (
            <Picker.Item key={year} label={year.toString()} value={year.toString()} />
          ))}
        </Picker>
      </View>
      :
      null}

      {selectedYear !== null && selectedMake === null ? <TextInput
        style={{ height: 40, borderColor: 'gray', borderBottomWidth: 1, marginVertical: 10, paddingHorizontal: 10, fontFamily: 'Poppins-Regular' }}
        onChangeText={text => setSearchMake(text)}
        value={searchMake}
        placeholder="Type or select your vehicle's make"
        fontSize={17} 
      />
      : null
    }

    {selectedMake && selectedModel === null ?
    <View style={{flexDirection: 'row', alignItems: 'center', gap:7}}>
      <Text style={{marginTop: 10, marginLeft:10}}>{selectedMake}</Text>
    </View>
    : null}

      {selectedMake !== null && selectedModel === null ? <TextInput
        style={{ height: 40, borderColor: 'gray', borderBottomWidth: 1, marginVertical: 10, paddingHorizontal: 10, fontFamily: 'Poppins-Regular' }}
        onChangeText={text => setSearchModel(text)}
        value={searchModel}
        placeholder="Type or select your vehicle's model"
        fontSize={17} 
      />: null}
{!selectedModel ? 
  <ScrollView style={{ marginTop: 10, height: selectedYear ? height / 1.6 : height / 2.5 }}>
    {!selectedMake
      ? filteredBrands.map((brand, index) => (
          <View key={`${brand}-${index}`}>
            <TouchableOpacity onPress={() => setSelectedMake(brand)}>
              <Text style={{ fontFamily: 'Poppins-Regular', marginLeft: 20 }}>{brand}</Text>
            </TouchableOpacity>
            <View
              style={{
                borderBottomColor: '#ececec',
                borderBottomWidth: 0.8,
                marginVertical: 10,
              }}
            />
          </View>
        ))
      : filteredModels.map((model, index) => (
          <View key={`${selectedModel}-${index}`}>
            <TouchableOpacity onPress={() => setSelectedModel(model)}>
              <Text style={{ fontFamily: 'Poppins-Regular', marginLeft: 20 }}>{model}</Text>
            </TouchableOpacity>
            <View
              style={{
                borderBottomColor: '#ececec',
                borderBottomWidth: 0.8,
                marginVertical: 10,
              }}
            />
          </View>
        ))}
  </ScrollView>
  : 
  <View style={{height: !selectedColor ? height / 2.7 : height / 3}}>
    {!selectedColor &&
    <FlatList
    style={{marginTop: 35}}
    data={[
      [
        { colors: ['#efedef', '#cac8ca'], label: 'White' },
        { colors: ['#cacacf', '#88888e'], label: 'Silver' },
        { colors: ['#aba9ab', '#717275'], label: 'Grey' },
        { colors: ['#505a69', '#23262c'], label: 'Black' },
        { colors: ['#f1ddbd', '#d2bc96'], label: 'Beige' },
        { colors: ['#f0d621', '#dab616'], label: 'Yellow' },
      ],
      [
        { colors: ['#c5872b', '#a65e17'], label: 'Orange' },
        { colors: ['#a45933', '#764420'], label: 'Brown' },
        { colors: ['#c13a40', '#a22323'], label: 'Red' },
        { colors: ['#1e491f', '#154814'], label: 'Green' },
        { colors: ['#438cc1', '#2162a0'], label: 'Blue' },
        { colors: ['#f0d621','green', '#377db7', '#a22323'], label: 'Other' },
      ],
    ]}
        renderItem={({ item,index }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: index === 0 ? 20 : 0 }}>
            {item.map(colorItem => (
              <TouchableOpacity key={colorItem.colors.join()} onPress={() => setSelectedColor(colorItem.label)}>
                <ColorSquare key={colorItem.colors.join()} colors={colorItem.colors} label={colorItem.label} />
              </TouchableOpacity>
            ))}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
    />
    }
    {
      selectedColor && 
      <View style={{flex: 1,marginTop: 40}}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap:10,height:80,justifyContent:'center', borderWidth:1, borderColor: 'gray', borderRadius:15}}>
        <View style={{flex:1,maxWidth:100}}>
        <Picker
          style={{width:'100%',height:50, position: 'relative'}}
          selectedValue={cityNumber}
          onValueChange={(itemValue) => setCityNumber(itemValue)}
          itemStyle={{position: 'absolute'}}
        >
          {[...Array(72)].map((_, index) => (
            <Picker.Item key={index} label={`${index + 1 < 10 ? '0' : ''}${index + 1}`} value={`${index + 1}`}  />
          ))}
          <Picker.Item label="85" value="85"  />
          <Picker.Item label="90" value="90"  />
          <Picker.Item label="99" value="99"  />
        </Picker>
        </View>
        <TextInput
          style={{height: 40, width: 80, borderColor: 'gray', borderBottomWidth: 1, textAlign: 'center'}}
          placeholder="AA"
          onChangeText={text => setSerieInput(text.toUpperCase())}
          value={serieInput}
          maxLength={2}
        />
        <TextInput
          style={{height: 40, width: 80, borderColor: 'gray', borderBottomWidth: 1, textAlign: 'center'}}
          placeholder="123"
          onChangeText={text => setCarNumberInput(text.replace(/[^0-9]/g, ''))}
          value={carNumberInput}
          keyboardType="numeric"
          maxLength={3}
        />
      </View>
      <TouchableOpacity 
        onPress={handleAdd} 
        style={{
            width: '100%',
            backgroundColor: "#39434e",
            height: 65,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: 'center',
            marginTop: 70
          }} 
        disabled={!(cityNumber && serieInput.length===2 && carNumberInput.length===3)}>
        <Text style={{color: "#fff",
              fontSize: 18,
              fontFamily: "Poppins-Regular",
              marginTop: 3,}}>Add the vehicle</Text>
      </TouchableOpacity>
    </View>
    }
  </View>
}
    </Animated.View>

  );
};

export default AddingVehicleSheet;
