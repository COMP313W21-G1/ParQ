/** 
import { StyleSheet, Button, Text, View, SafeAreaView, Image, TouchableWithoutFeedback, FlatList, StatusBar } from 'react-native'

import tw from 'tailwind-react-native-classnames';

import { convertDateTime, getReservations } from "../firebase";
import React, {   useEffect, useState} from 'react';





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

const ReservationScreen = ( props, update=false  ) => {

  const [reservationsList, setReservationsList] = useState([]);
  //const { update } = props.route.params;
  

  useEffect(() => {
      try {        
        getReservations(setReservationsList);
      } catch (error) {
        console.log(error.message);
      }           
  }, [props.update]); 
  
  return (reservationsList.length > 0 ) ? 
 
  //if spots are available, add them to the view
    <SafeAreaView style={styles.container}>
      <Text style={tw`font-semibold text-lg`}>Reservation History</Text>
  
      {
        reservationsList.map((item) =>
        <ReservationItem                         
            key = {item.id}  
            id = {item.id}
            reservationItem = {item}
            nav = {props.navigation} 
          /> 
      ) 
      }
     
      <FlatList
        //extraData={reservationsList}
        data={reservationsList} 
        keyExtractor={item => item.id}
            ItemSeparatorComponent={() => (
          <View style={[tw`bg-gray-200`, { height: 0.5 }]} />
        )}
         renderItem={({ item ,})  => (
          <>
          {
            console.log(item.id)
          } 
            <ReservationItem    
              //extraData={props.update}                     
              key = {item.id}
              id = {item.id}
              reservationItem = {item}
              nav = {props.navigation}   
            />  
            
          </>
        )}
      />
     
    </SafeAreaView>
   
    :

    //if no spots are  booked, display a message
    <View style={styles.textContainer}>
      <Text style={styles.emptyTitle}>No Reservations Found! </Text>
      <Text style={styles.emptySubtitle}>Add a new reservation from the map screen</Text>     
    </View>
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#ADD8E6',
  paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
},
listItem: {
  marginTop: 8,
  marginBottom: 8
},
textContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
titleStyle: {
  fontSize: 30
},
subtitleStyle: {
  fontSize: 18
},
emptyTitle: {
  fontSize: 32,
  marginBottom: 16
},
emptySubtitle: {
  fontSize: 18,
  fontStyle: 'italic'
}
});

export default ReservationScreen;
*/

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,  Button,  } from 'react-native';
import tw from 'tailwind-react-native-classnames';

import {  getReservations, convertDateTime } from '../firebase';



export default function List(props) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getReservations(setItems); 
  }, []);

  return (
    <View style={styles.container}>
      {items.length > 0 ? <ItemList items={items} nav={props.navigation}/> : <Text>No items</Text>}
    </View>
  );
}


export  function ItemList({ items , nav}) {
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
});