import { useNavigation } from "@react-navigation/core";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import Map from "../components/Map";
import NavigateCard from "../components/NavigateCard";
import RideOptionsCard from "../components/RideOptionsCard";
import ParkingDetailsCard from "../components/ParkingDetailsCard";
import ReservationForm from "../components/ReservationForm";
import FavouriteForm from "../components/FavouriteForm";

const MapScreen = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();

  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.navigate("HomeScreen")}
        style={tw`bg-gray-100 absolute top-12 left-8 z-50 p-2 rounded-full shadow-lg`}
      >
        <Icon name="chevron-left" type="fontawesome" size={30} />
      </TouchableOpacity>

      <View style={tw`h-1/2 flex-shrink flex-grow`}>
        <Map />
      </View>

      <View style={tw`h-1/2`}>
        <Stack.Navigator>
          <Stack.Screen
            name="NavigateCard"
            component={NavigateCard}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="RideOptionsCard"
            component={RideOptionsCard}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ParkingDetailsCard"
            component={ParkingDetailsCard}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ReservationForm"
            component={ReservationForm}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="FavouriteForm"
            component={FavouriteForm}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({});
