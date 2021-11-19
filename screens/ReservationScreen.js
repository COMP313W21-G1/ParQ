
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableWithoutFeedback, FlatList, StatusBar } from 'react-native'

import tw from 'tailwind-react-native-classnames';

import { getReservedParkingSpotInfo, convertDateTime, getReservations } from "../firebase";
import React, {   useEffect, useState} from 'react';



const ReservationItem = ({ item }) => (
  <View> 
      <View style={tw`flex-row`}>
            <View style={tw`justify-start`}>
              <Text style={tw`font-semibold text-lg`}>Spot Id: {item.parkingSpotId}</Text>
              <Text style={tw`text-gray-500`}>Start Time: {convertDateTime(item.start)}</Text>
              <Text style={tw`text-gray-500`}>End time: {convertDateTime(item.end)}</Text>
              <Text style={tw`text-gray-500`}>Address: {item.spotInfo.parkingAddress}</Text>
              <Text style={tw`text-gray-500`}>Type: {item.spotInfo.parkingSpots.type}</Text>
            </View> 
        </View>  
  </View> 
);  

function actionOnRow(item) {
  console.log('Selected Item :',item);
};
 
const ReservationScreen = () => {

  const [reservationsList, setReservationsList] = useState([]);

  useEffect(() => {
      try {        
        getReservations(setReservationsList);
      } catch (error) {
        console.log(error.message);
      }           
  }, []);
  
  return (reservationsList.length > 0 ) ?
 
  //if spots are available, add them to the view
    <SafeAreaView style={styles.container}>
      <Text style={tw`font-semibold text-lg`}>Reservation History</Text>

      <FlatList
        data={reservationsList} 
        keyExtractor={item => item.id}
            ItemSeparatorComponent={() => (
          <View style={[tw`bg-gray-200`, { height: 0.5 }]} />
        )}
         renderItem={({ item })  => (
          <>
            <TouchableWithoutFeedback onPress={ () => {console.log('Selected Item :',item);}}>
                <ReservationItem
                  key= {id}
                  id = {id}
                  item = {item}
                />  
              </TouchableWithoutFeedback>
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


