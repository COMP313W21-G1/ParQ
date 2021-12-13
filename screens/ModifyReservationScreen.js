
/** 

import { StyleSheet, Button, Text, View, SafeAreaView, Image, TouchableWithoutFeedback, FlatList, StatusBar } from 'react-native'

import React, {   useEffect, useState} from 'react';

import tw from 'tailwind-react-native-classnames';

import { convertDateTime, getReservations } from "../firebase";




const ModifyReservationScreen = (props) => {
    const { reservationItem } = props.route.params;
  
    return (
   
      //display the reservation details
      //add buttons to edit the spot, start and end time or cancel the reservation
      //to edit the start and end time make sure you check if the spot, lot, date and time is already reerved

      <SafeAreaView style={styles.container}>                  
        <View style={styles.textContainer}>
            <Text style={styles.emptyTitle}>Modify Reservation </Text>   
            <Text style={tw`font-semibold text-lg`}>Spot Id: {reservationItem.parkingSpotId}</Text>
            <Text style={tw`text-gray-500`}>Start Time: {convertDateTime(reservationItem.start)}</Text>
            <Text style={tw`text-gray-500`}>End time: {convertDateTime(reservationItem.end)}</Text>
            <Text style={tw`text-gray-500`}>Address: {reservationItem.spotInfo.parkingAddress}</Text>
            <Text style={tw`text-gray-500`}>Type: {reservationItem.spotInfo.parkingSpots.type}</Text>
            <Text style={tw`text-gray-500`}>Cost: ${reservationItem.spotInfo.feePerHour}</Text>

            <Button
              title="Submit"
              onPress={() => console.log('submitted')}
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

  
  export default ModifyReservationScreen;
  */

import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  TextInput,
  Alert,
  
} from 'react-native';

import {  modifyReservation, convertDateTime, getTimeStamp, getParkingSpots } from '../firebase';


export default function AddItem(props) {
  const { reservationItem } = props.route.params;
  const [res, setRes] = useState(reservationItem);
  const [start, setStart] = useState(convertDateTime(reservationItem.start));
  const [end, setEnd] = useState(convertDateTime(reservationItem.end));
  const [spotsList, setSpotsList] = useState([]);


  //drop list items
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(spotsList);   

  function handleChangeStart(startTxt) {
    setStart(startTxt);
  }

  function handleChangeEnd(endTxt) {
    setEnd(endTxt);
  }

  function handleSubmit() {
    setRes({ 
        id: reservationItem.id,
        end: getTimeStamp(end),
        owner_uid: reservationItem.owner_uid, 
        parkingLotId: reservationItem.parkingLotId, 
        parkingSpotId: reservationItem.parkingSpotId, 
        start: getTimeStamp(start),
    }); 
    modifyReservation(res);
    Alert.alert('Item saved successfully');
  } 

  useEffect(() => {
    getParkingSpots(reservationItem, setSpotsList); 
    setItems(setSpotsList);
    console.log(spotsList);
  }, []);

  return (      
    <View style={styles.main}>
      <Text style={styles.title}>Modify Reservation</Text>
      <View> 
           <Text>Res Id</Text>          
            <TextInput
            autoFocus={true}
            style={styles.itemInput}  
            editable = {false}
            value={reservationItem.id}
            />
    </View>
    <View> 
           <Text>Choose a spot</Text>          
            {/*  */}
            
            <DropDownPicker
            open={open}
            key={value} 
            value={value}
            items={items}
            //spotsList={spotsList}
            //setSpotsList={setSpotsList}
            setOpen={setOpen}  
            setValue={setValue}
            setItems={setItems}
            /> 

    </View>
       <View> 
           <Text>Start</Text>                 
            <TextInput
            //placeholderTextColor="#444"
            //placeholder="start" 
            //autoCapitalize="none"
            autoFocus={true}
            style={styles.itemInput}
            onChangeText={handleChangeStart} 
            //onBlur={handleBlur}
            value={start}
            />
    </View>

    <View> 
           <Text>End</Text>          
            <TextInput
            //placeholderTextColor="#444"
            //placeholder="start"
            //autoCapitalize="none"
            autoFocus={true}
            style={styles.itemInput}
            onChangeText={handleChangeEnd} 
            //onBlur={handleBlur}
            value={end}
            />
    </View>


      <TouchableHighlight
        style={styles.button} 
        underlayColor="white"
        onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#6565fc',
  },
  title: {
    marginBottom: 20,
    fontSize: 25,
    textAlign: 'center',
  },
  itemInput: {
    height: 50,
    padding: 4,
    marginRight: 5,
    fontSize: 23,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    color: 'white',
  },
  buttonText: {
    fontSize: 18,
    color: '#111',
    alignSelf: 'center',
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});
