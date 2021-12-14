

import { StyleSheet, Text, View, SafeAreaView, Button, StatusBar } from 'react-native'

import tw from 'tailwind-react-native-classnames';
import { convertDateTime, deleteReservation, getReservations } from "../firebase";
import React, {   useEffect, useState} from 'react';
import { useSelector } from 'react-redux';



const ReservationDetailScreen = (props) => {
    const { reservationItem } = props.route.params; 
    

    return (
   
      //display the reservation details
      //add buttons to edit the start and end time or cancel the reservation
      //to edit the start and end time make sure you check if the spot, lot, date and time is already reerved

      <SafeAreaView style={styles.container}>                  
        <View style={styles.textContainer}>
            <Text style={styles.emptyTitle}>Details for reservation </Text>              
            <Text style={tw`text-gray-500 font-semibold text-lg`}>Res ID: {reservationItem.id}</Text>
            <Text style={tw`text-gray-500`}>Spot Id: {reservationItem.parkingSpotId}</Text>
            <Text >Start Time: {convertDateTime(reservationItem.start)}</Text>
            <Text >End time: {convertDateTime(reservationItem.end)}</Text>
            <Text style={tw`text-gray-500`}>Address: {reservationItem.spotInfo.parkingAddress}</Text>
            <Text style={tw`text-gray-500`}>Type: {reservationItem.spotInfo.parkingSpots.type}</Text>
            <Text style={tw`text-gray-500`}>Cost: ${reservationItem.spotInfo.feePerHour}</Text>
            <Button
              title="Modify"
              onPress={() => props.navigation.navigate('ModifyReservationScreen', {reservationItem})}
            />
            <Button
              title="Delete"
              onPress={() => {
                  
                  deleteReservation(reservationItem.id);              
                 
                  console.log('delete');
                  props.navigation.navigate('ReservationScreen');
                }}
            />
        </View>
      </SafeAreaView>
     
    )}
  

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
        })

  
  export default ReservationDetailScreen;