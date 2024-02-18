import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView from "react-native-maps";

const Home = ({ setStatus }) => {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 40.4093,
          longitude: 49.8671,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    </View>
  );
};

export default Home;
