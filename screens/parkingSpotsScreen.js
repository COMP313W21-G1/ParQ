import React, { useState, useEffect } from "react";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/core";
import { Text, View, StyleSheet,FlatList,StatusBar,Alert,Platform, TouchableOpacity,Image } from "react-native";
import { getParkingLots,deleteParkingLots } from "../firebase";
import { useIsFocused } from '@react-navigation/native';

const parkingSpotsScreen = () => {
    const isFocused = useIsFocused(true);
    const [data, setData] = useState([]);
    useEffect(()=>{
        isFocused && getParkingLots(setData);
    },[isFocused]);
    const navigation = useNavigation();
   
     
 
return(
    
    <View style={styles.AndroidSafeArea}>
        <View>
            <Text>List of vendor parking</Text>
        </View>
        <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => (
          <View style={styles.container} />
        )}
        renderItem={({ item }) => (
          <>
              <View
          style={{
            backgroundColor: "white",
            padding: 10,
            margin: 5,
            borderRadius: 10,
          }}
        >
          <Text>City: {item.city}</Text>
          <Text>Company: {item.company}</Text>
          <Text>Fee per hour: {item.feePerHour}</Text>
          <Text>Occupied parking Spots: {item.occupied}</Text>
          <Text>Parking Address: {item.parkingAddress}</Text>
          <Text>Postal Code: {item.postalCode}</Text>
          <Text>Province: {item.province}</Text>
          <Text>Total Parking Spots: {item.totalParkingSpots}</Text>
          <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "Delete Parking Lot ?",
              "Are you sure you want to Delete your Parking lot?",
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
                    deleteParkingLots(item.id);
                    Alert.alert("Your Parking Lot has been deleted");
                    navigation.navigate("HomeScreen");
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
           
            
          </>
        )}
      />
    </View>

    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ecf0f1",
      padding: 8,
      backgroundColor: "lightblue",
    },

        AndroidSafeArea: {
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
          }
    
  });
export default parkingSpotsScreen;
