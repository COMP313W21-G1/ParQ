import React, { useState, useEffect } from "react";
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
import { firebase, db, getVendors } from "../firebase";
import { useSelector } from "react-redux";
import { string } from "yup/lib/locale";
import { selectSpot, getSpot } from "../slices/spotSlice";

const ParkingDetailsCard = (location) => {
  const navigation = useNavigation();
  const [spot, setSpot] = useState([]);
  const parking = useSelector(selectSpot);
  const [vendors, setVendors] = useState([]);
  //console.log(location);
  useEffect(() => {
    try {
      getVendors(setVendors);
      getSpot(setSpot);
    } catch (error) {
      //
    }
  }, []);

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
          <Text style={tw`text-center p-1 text-lg`}>
            Address: {location.route.params.address}
          </Text>
          <Text style={tw`text-center p-1 text-base`}>
            Description(Array or Formatted String):{" "}
            {`${location.route.params.vendor} ? ${
              location.route.params.description
            }:${JSON.stringify(location?.route.params?.description)}`}
          </Text>
          <Text style={tw`text-center p-1 text-base`}>
            Coordinates:
            {` ${location.route.params.location.lat}, ${location.route.params.location.lng}`}
          </Text>
        </View>
      </View>
      <View
        style={tw`flex-row bg-white justify-between py-1 mt-auto border-t border-gray-100`}
      >
        <TouchableOpacity
          disabled={location.route.params.vendor ? false : true}
          onPress={() => {
            let loc = {};
            loc = {
              lat: location.route.params.location.lat,
              lng: location.route.params.location.lng,
            };
            navigation.navigate("ReservationForm", {
              name: location.route.params.name,
              address: location.route.params.address,
              location: loc,
              description: location.route.params.description,
            });
          }}
          style={tw`flex-col justify-evenly w-36 h-12 m-1 rounded-full  ${
            location.route.params.vendor ? "bg-gray-500" : "bg-gray-200"
          } `}
        >
          <Icon
            name="car"
            type="font-awesome"
            color={location.route.params.vendor ? "white" : "red"}
            size={18}
          />
          <Text
            style={tw`text-center  ${
              location.route.params.vendor ? "text-white" : "text-black"
            }`}
          >
            Reserve Spot
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            let loc = {};
            loc = {
              lat: location.route.params.location.lat,
              lng: location.route.params.location.lng,
            };
            navigation.navigate("FavouriteForm", {
              name: location.route.params.name,
              address: location.route.params.address,
              location: loc,
              description: location.route.params.description,
            });
          }}
          style={tw`flex justify-between w-36 h-12 m-1 rounded-full border-4 border-gray-500`}
        >
          <Text style={tw`text-center `}>Add to favourites</Text>
          <Icon name="favorite" type="MaterialIcons" color="red" size={18} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ParkingDetailsCard;

const styles = StyleSheet.create({});
