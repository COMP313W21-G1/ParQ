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

const ParkingDetailsCard = (location) => {
  const navigation = useNavigation();
  //console.log(location);

  return (
    <SafeAreaView
      style={[SafeViewAndroid.AndroidSafeAreaBottom, tw`bg-white flex-grow`]}
    >
      <View>
        <Text style={tw`text-2xl text-center font-bold`}>Parking Details</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`absolute top-3 left-5 z-50 p-3 rounded-full`}
        >
          <Icon name="chevron-left" type="fontawesome" />
        </TouchableOpacity>
        <View style={tw`flex-col`}>
          <Text style={tw`text-center p-1 text-xl`}>
            Name: {location.route.params.name}
          </Text>
          <Text style={tw`text-center p-1 text-xl`}>
            Address: {location.route.params.address}
          </Text>
        </View>
      </View>
      <View
        style={tw`flex-row bg-white justify-evenly py-2 mt-auto border-t border-gray-100`}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ReservationForm", {
              parkingSpot: location.route.params,
            })
          }
          style={tw`flex flex-row justify-between bg-black w-36 px-4 py-3 rounded-full`}
        >
          <Icon name="car" type="font-awesome" color="white" size={16} />
          <Text style={tw`text-white text-center`}>Reserve Spot</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("FavouriteForm", {
              parkingSpot: location.route.params,
            })
          }
          style={tw`flex flex-row justify-between w-36 px-1 py-1 rounded-full`}
        >
          <Icon name="favorite" type="MaterialIcons" color="red" size={16} />
          <Text style={tw`text-center`}>Add to favourites</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ParkingDetailsCard;

const styles = StyleSheet.create({});
