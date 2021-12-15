import {
  StyleSheet,
  Button,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";

import tw from "tailwind-react-native-classnames";

import { Icon } from "react-native-elements";
import { convertDateTime, getReservations } from "../firebase";
import React, { useEffect, useState } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";

const ReservationItem = ({ reservationItem, nav }) => (
  <SafeAreaView style={tw`px-4 pt-3 flex-col justify-between w-full`}>
    <View style={tw`flex-row justify-evenly w-9/12 m-auto px-8 pb-3`}>
      <Text style={tw`text-blue-600 font-bold`}>
        Res ID: {reservationItem.id}
      </Text>
    </View>
    <View style={tw`flex-row pt-2 justify-between w-10/12 mx-auto`}>
      <Text style={tw`font-bold`}>Start Time:</Text>
      <Text>{`${convertDateTime(reservationItem.start)}`}</Text>
    </View>
    <View style={tw`flex-row pt-2 justify-between w-10/12 mx-auto`}>
      <Text style={tw`font-bold`}>End Time: </Text>
      <Text> {`${convertDateTime(reservationItem.end)}`}</Text>
    </View>
    <View style={tw`flex-row pt-2 justify-between w-10/12 mx-auto`}>
      <Text style={tw`font-bold`}>Address:</Text>
      <Text style={tw`text-gray-500`}>
        {reservationItem.spotInfo.parkingAddress}
      </Text>
    </View>
    <View style={tw`flex-row pt-2 pb-5 justify-between w-10/12 mx-auto`}>
      <Text style={tw`font-bold`}>Parking Spot:</Text>
      <Text style={tw`text-gray-500`}>
        {reservationItem.spotInfo.parkingSpots.id}
      </Text>
    </View>

    <View style={tw`w-1/4 m-auto py-1`}>
      <Button
        title="Details"
        onPress={() => {
          nav.navigate("ReservationDetailScreen", { reservationItem });
        }}
      />
    </View>
  </SafeAreaView>
);

const ReservationScreen = (props) => {
  const isFocused = useIsFocused();
  const [reservationsList, setReservationsList] = useState([]);
  const navigation = useNavigation();
  //const { update } = props.route.params;

  fetchReservationListData = async () => {
    //fetch some data and set state here
    try {
      getReservations(setReservationsList);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    isFocused && fetchReservationListData();
  }, [isFocused]);

  return reservationsList.length > 0 ? (
    //if spots are available, add them to the view
    <SafeAreaView style={tw`mx-auto pt-10`}>
      <TouchableOpacity
        onPress={() => navigation.navigate("HomeScreen")}
        style={tw`bg-gray-100 absolute top-8 left-4 z-50 p-2 rounded-full shadow-lg`}
      >
        <Icon name="chevron-left" type="fontawesome" size={30} />
      </TouchableOpacity>
      <Text style={tw`font-bold text-3xl text-center py-5`}>
        Reservation History
      </Text>

      <FlatList
        //extraData={reservationsList}
        data={reservationsList}
        style={tw`border-4 rounded-lg border-gray-400  `}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => (
          <View style={[tw`bg-gray-200`, { height: 1 }]} />
        )}
        renderItem={({ item }) => (
          <>
            {
              //console.log(item.id)
            }
            <ReservationItem
              //extraData={props.update}
              key={item.id}
              id={item.id}
              reservationItem={item}
              nav={props.navigation}
            />
          </>
        )}
      />
    </SafeAreaView>
  ) : (
    //if no spots are  booked, display a message
    <View style={styles.textContainer}>
      <Text style={styles.emptyTitle}>No Reservations Found! </Text>
      <Text style={styles.emptySubtitle}>
        Add a new reservation from the map screen
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ADD8E6",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  listItem: {
    marginTop: 8,
    marginBottom: 8,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleStyle: {
    fontSize: 30,
  },
  subtitleStyle: {
    fontSize: 18,
  },
  emptyTitle: {
    fontSize: 32,
    marginBottom: 16,
  },
  emptySubtitle: {
    fontSize: 18,
    fontStyle: "italic",
  },
});

export default ReservationScreen;

/** 
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,  Button,  } from 'react-native';
import tw from 'tailwind-react-native-classnames';

import {  getReservations, convertDateTime } from '../firebase';



export default function ReservationScreen(props) {
  const [reservationsList, setReservationsList] = useState([]);

  useEffect(() => {
    getReservations(setReservationsList); 
  }, []);

  return (
    <View style={styles.container}>
      {(reservationsList.length > 0) ? 
      <View>
        <Text >{reservationsList[0].id}</Text>
        <ItemList items={reservationsList} nav={props.navigation}/>
      </View>
      : 
        //if no spots are  booked, display a message 
        <View style={styles.container}>
          <Text >No Reservations Found! </Text>
          <Text >Add a new reservation from the map screen</Text>     
        </View>}
    </View>
  );
}


export function ItemList({ items , nav}){
  return (
    <View style={styles.itemsList}>
      {items.map((item) => {
        return (
          <View key={item.id}> 
            <Text style={styles.itemtext}>{item.id}</Text>
            <ReservationItem                        
              key = {item.id}
              id = {item.id}
              reservationItem = {item}
              nav = {nav}   
            />  
          </View>
        );
      })}
    </View>
  );
}

const ReservationItem = ({ reservationItem , nav}) => (

  <View> 
      <View style={tw`flex-row`}>
        <View style={tw`justify-start`}>
        <Text style={tw`text-blue-600`}>Res ID: {reservationItem.id}</Text>
          <Text style={tw`text-gray-500`}>Start Time: {convertDateTime(reservationItem.start)}</Text>
          <Text style={tw`text-gray-500`}>End time: {convertDateTime(reservationItem.end)}</Text>
          <Text style={tw`text-gray-500`}>Address: {reservationItem.spotInfo.parkingAddress}</Text>
        </View>  
        <View>
          <Button
            title="Details"
            onPress={() =>{ nav.navigate('ReservationDetailScreen', {reservationItem})}}
          />
        </View>
      </View>   
  </View> 
);  

const styles = StyleSheet.create({
  itemsList: { 
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  itemtext: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },      
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ebebeb',
  },
});*/
