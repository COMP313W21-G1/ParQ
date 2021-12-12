import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "tailwind-react-native-classnames";
import SafeViewAndroid from "./SafeViewAndroid";
import { Icon, Image } from "react-native-elements";
import { useNavigation } from "@react-navigation/core";
import { useSelector } from "react-redux";

const ReservationForm = (location) => {
  const navigation = useNavigation();
  //console.log(location.route.params.parkingSpot);

  return (
    <SafeAreaView
      style={[SafeViewAndroid.AndroidSafeAreaBottom, tw`bg-white flex-grow`]}
    >
      <View>
        <Text style={tw`text-2xl text-center font-bold`}>Reservation Form</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`absolute top-3 left-5 z-50 p-3 rounded-full`}
        >
          <Icon name="chevron-left" type="fontawesome" />
        </TouchableOpacity>
        <View style={tw`flex-col p-3 items-center  text-xl`}>
          <Text style={tw`text-xl`}>Name: {location.route.params.name}</Text>
          <Text style={tw`text-xl`}>
            Address: {location.route.params.address}
          </Text>
          <Text style={tw`text-base`}>
            Description(Array or Formatted String):{" "}
            {`${location.route.params.description[0]}\n${location.route.params.description}`}
          </Text>
          <Text style={tw`text-base`}>
            Coordinates:
            {` ${location.route.params.location.lat}, ${location.route.params.location.lng}`}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ReservationForm;

const styles = StyleSheet.create({});
