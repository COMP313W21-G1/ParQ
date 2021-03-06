import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import MapScreen from "./screens/MapScreen";
import SignupScreen from "./screens/SignupScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ReservationScreen from "./screens/ReservationScreen";
import ReservationDetailScreen from "./screens/ReservationDetailScreen";
import AddReservationScreen from "./screens/AddReservationScreen";
import ModifyReservationScreen from "./screens/ModifyReservationScreen";
import AddLotScreen from "./screens/AddLotScreen";
import parkingSpotsScreen from "./screens/parkingSpotsScreen";

const Stack = createStackNavigator();
const screenOptions = {
  headerShown: false,
};

export const SignedInStack = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={screenOptions}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="ReservationScreen" component={ReservationScreen} />
      <Stack.Screen name="AddReservationScreen" component={AddReservationScreen} />
      <Stack.Screen name="AddLotScreen" component={AddLotScreen} />
      <Stack.Screen name="parkingSpotsScreen" component={parkingSpotsScreen} />
      <Stack.Screen
        name="ReservationDetailScreen"
        component={ReservationDetailScreen}
      />
      <Stack.Screen
        name="ModifyReservationScreen"
        component={ModifyReservationScreen}
      />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export const SignedOutStack = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={screenOptions}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
