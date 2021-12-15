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
import { useSelector, useDispatch } from "react-redux";
import { firebase, db, getVendors, getVendorsFiltered } from "../firebase";
import { FlatList } from "react-native-gesture-handler";
import { setSpot, selectSpot } from "../slices/spotSlice";
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
  const spot = useSelector(selectSpot);
  const [results, setResults] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [apiResults, setApiResults] = useState([]);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!origin) return;
    getVendorsFiltered(setVendors, origin);
    const getApiResults = async () => {
      fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=parking&location=${origin.location.lat}%2C${origin.location.lng}&radius=750&key=${GOOGLE_MAPS_APIKEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          let markers = [];
          data.results.forEach((element) => {
            let rawDesc = [];
            var loc = {};
            loc = {
              lat: element.geometry.location.lat,
              lng: element.geometry.location.lng,
            };
            //rconsole.log("LINE 48 RESULTS =>", element.geometry.location);
            element.types.forEach((value) => rawDesc.push(value));
            let result = {
              location: element.geometry.location,
              description: JSON.stringify(rawDesc),
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
      let temp = [];
      apiResults.forEach((value) => {
        temp.push(value);
      });
      vendors.forEach((value, index) => {
        temp.push(value);
      });
      //console.log("HI", temp);
      setResults(temp);
      //console.log(results);
    } catch (error) {
      console.log(error.message);
    }
  }, [apiResults, vendors]);

  return (
    <FlatList
      data={results}
      keyExtractor={(item, index) => index}
      ItemSeparatorComponent={() => (
        <View style={[tw`bg-gray-200`, { height: 0.5 }]} />
      )}
      renderItem={({ item: { name, address, location, description } }) => (
        <TouchableOpacity
          style={tw`flex-col items-center p-2 m-0`}
          onPress={() => {
            let loc = {};
            loc = { lat: location?.lat, lng: location?.lng };
            console.log("Results LINE 93inc101 =>", loc);
            dispatch(
              setSpot({
                name: name,
                address: address,
                location: loc,
                description: description,
                vendor: false,
              })
            );
            console.log("|||+++>Resultd LN 104", spot);
            navigation.navigate("ParkingDetailsCard", {
              name: name,
              address: address,
              location: loc,
              description: description,
              vendor: false,
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
