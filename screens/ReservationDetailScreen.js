import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  TouchableOpacity,
  Alert
} from "react-native";

import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import {
  convertDateTime,
  deleteReservation,
  getReservations,
} from "../firebase";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/core";

const ReservationDetailScreen = (props) => {
  const { reservationItem } = props.route.params;
  const navigator = useNavigation();
  const timefix = (timefloat) => {
    console.log(typeof timefloat);
    return String(timefloat).toString();
  };
  return (
    //display the reservation details
    //add buttons to edit the start and end time or cancel the reservation
    //to edit the start and end time make sure you check if the spot, lot, date and time is already reerved

    <View style={tw`px-3 flex w-full h-full`}>
      <Text style={tw`text-center text-4xl font-bold h-1/5 pt-24`}>
        Details for reservation
      </Text>
      <TouchableOpacity
        onPress={() => navigator.goBack()}
        style={tw`bg-gray-100 absolute top-8 left-3 z-50 p-2 rounded-full shadow-lg`}
      >
        <Icon name="chevron-left" type="fontawesome" size={30} />
      </TouchableOpacity>
      <View style={tw`flex-col m-auto h-1/3 w-11/12`}>
        <View style={[tw`flex-row justify-between py-2`, styles.divide]}>
          <Text style={tw`font-bold text-lg`}>Res ID: </Text>
          <Text style={tw`text-gray-500 text-lg`}>{reservationItem.id}</Text>
        </View>

        <View style={[tw`flex-row justify-between py-2`, styles.divide]}>
          <Text style={tw`font-bold text-lg`}>Spot Id:</Text>
          <Text style={tw`text-gray-500 text-lg`}>
            {reservationItem.parkingSpotId}
          </Text>
        </View>
        <View style={[tw`flex-row justify-between py-2`, styles.divide]}>
          <Text style={tw`font-bold text-lg`}>Start Time:</Text>
          <Text style={[tw`text-lg `, styles.converted]}>
            {convertDateTime(reservationItem.start)}
          </Text>
        </View>
        <View style={[tw`flex-row justify-between py-2`, styles.divide]}>
          <Text style={tw`font-bold text-lg `}>End time:</Text>
          <Text style={[tw`text-lg `, styles.converted]}>
            {timefix(convertDateTime(reservationItem.end))}
          </Text>
        </View>
        <View style={[tw`flex-row justify-between py-2`, styles.divide]}>
          <Text style={tw`font-bold text-lg`}>Address:</Text>
          <Text style={tw`text-gray-500 text-lg`}>
            {reservationItem.spotInfo.parkingAddress}
          </Text>
        </View>
        <View style={[tw`flex-row justify-between py-2`, styles.divide]}>
          <Text style={tw`font-bold text-lg`}>Type:</Text>
          <Text style={tw`text-gray-500 text-lg`}>
            {reservationItem.spotInfo.parkingSpots.type}
          </Text>
        </View>
        <View style={[tw`flex-row justify-between py-1`, styles.divide]}>
          <Text style={tw`font-bold text-lg`}>Cost:</Text>
          <Text style={tw`text-gray-500 text-lg`}>
            ${reservationItem.spotInfo.feePerHour}
          </Text>
        </View>
      </View>
      <View style={tw`flex-row m-auto`}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("ModifyReservationScreen", {
              reservationItem,
            });
          }}
          style={tw`bg-gray-300 p-1 rounded-lg border-8 border-gray-500 mx-auto`}
        >
          <Text style={tw`text-gray-900 text-lg font-bold`}>EDIT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Delete Reservation ?",
              "Are you sure you want to Delete your reservation?",
              [
                {
                  text: "Cancel",
                  onPress: () => {
                    return;
                  },
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => {
                    deleteReservation(reservationItem.id);
                    props.navigation.navigate("ReservationScreen");
                    Alert.alert("Your reservation has been deleted");
                  },
                  style: "ok",
                },
              ]
            );
          }}
          style={tw`bg-red-900 p-2 rounded-lg border-4 border-red-500 mx-1`}
        >
          <Text style={tw`text-yellow-100 text-lg font-bold`}>DELETE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  divide: { borderBottomColor: "gray", borderBottomWidth: 1 },
  converted: {
    color: "rgb(107, 114, 128)",
  },
});

export default ReservationDetailScreen;
