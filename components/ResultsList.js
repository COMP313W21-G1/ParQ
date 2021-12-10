import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { Icon } from "react-native-elements";
import { selectOrigin } from "../slices/navSlice";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useNavigation } from "@react-navigation/core";
import { useSelector } from "react-redux";
import { firebase, db, getVendors } from "../firebase";
import { FlatList } from "react-native-gesture-handler";
import { add } from "react-native-reanimated";

const ListItem = ({ address, name, latitude, longitude }) => (
  <View style={tw`bg-gray-100 flex-col m-1 p-3`}>
    <View style={tw`flex-1 p-1 m-0`}>
      <Text>{name}</Text>
      <Text>{address}</Text>
    </View>
  </View>
);

const ResultsList = () => {
  const origin = useSelector(selectOrigin);
  const [results, setResults] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [apiResults, setApiResults] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    //   //if (!origin || !destination) return;
    if (!origin) return;
    const getApiResults = async () => {
      fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=parking&location=${origin.location.lat}%2C${origin.location.lng}&radius=1500&key=${GOOGLE_MAPS_APIKEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          let markers = [];
          data.results.forEach((element) => {
            let result = {
              latitude: element.geometry.location.lat,
              longitude: element.geometry.location.lng,
              name: element.name,
              address: element.vicinity,
            };
            markers.push(result);
          });
          setApiResults(markers);
        });
    };
    getApiResults();
  }, [origin, GOOGLE_MAPS_APIKEY]);

  useEffect(() => {
    try {
      getVendors(setVendors);
      let temp = [];
      vendors.forEach((value, index) => {
        temp.push(value);
      });
      apiResults.forEach((value) => {
        temp.push(value);
      });
      //console.log(temp);
      setResults(temp);
      temp.forEach((value) => {
        results.push(value);
      });
      //console.log(results);
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  return (
    <FlatList
      data={results}
      keyExtractor={(item, index) => index}
      ItemSeparatorComponent={() => (
        <View style={[tw`bg-gray-200`, { height: 0.5 }]} />
      )}
      renderItem={({ item: { name, address, latitude, longitude } }) => (
        <TouchableOpacity
          style={tw`flex-col items-center p-2 m-0`}
          onPress={() => {
            navigation.navigate("ParkingDetailsCard", {
              name: name,
              address: address,
              latitude: latitude,
              longitude: longitude,
            });
          }}
        >
          {/* <ListItem name={name} address={address} /> */}
          <Text>{name}:</Text>
          <Text> {address}</Text>
          {/* <View>
            <Text style={tw`font-semibold text-lg`}>{name}</Text>
            <Text style={tw`text-gray-500`}>{address}</Text>
          </View> */}
        </TouchableOpacity>
      )}
    />
  );
};
const styles = StyleSheet.create({});
export default ResultsList;
