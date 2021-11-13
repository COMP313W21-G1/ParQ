
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, FlatList, StatusBar } from 'react-native'

import tw from 'tailwind-react-native-classnames';

import {  convertDateTime, getBookedSpots } from "../firebase";
import React, {   useEffect, useState} from 'react';



const ListItem = ({ location, name, start, end  }) => (
  <View>
      <View style={tw`flex-row`}>
            <View style={tw`justify-start`}>
              <Text style={tw`font-semibold text-lg`}>{name}</Text>
              <Text style={tw`text-gray-500`}>{location}</Text>
              <Text style={tw`text-gray-500`}>Start Time: {convertDateTime(start)}</Text>
              <Text style={tw`text-gray-500`}>End time: {convertDateTime(end)}</Text>
            </View>
        </View>
  </View>
);


const ReservationScreen = () => {

  const [spotsList, setSpotsList] = useState([]);

  useEffect(() => {
    try {
      getBookedSpots(setSpotsList)
    } catch (error) {
      console.log(error.message);
    }
  }, []);



  return (spotsList.length > 0 ) ?
 
  //if spots are available, add them to the view
    <SafeAreaView style={styles.container}>

      <FlatList
        data={spotsList}
        keyExtractor={item => item.name}
            ItemSeparatorComponent={() => (
          <View style={[tw`bg-gray-200`, { height: 0.5 }]} />
        )}
        renderItem={({ item: { location, name, start, end } })  => (
          <ListItem
            name={name}
            location={location}
            start={start}
            end={end}
          />
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
//}

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


