import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  ScrollView,
  LogBox,
} from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/core";
import { firebase, db } from "../firebase";
import { selectOrigin, setOrigin } from "../slices/navSlice";
import { MapScreen } from "../screens/MapScreen";
import MapView from "react-native-maps";

async function getFavourites(favesRetrieved) {
  var favsList;
  return (
    db
      .collection(`users`)
      .doc(`${await firebase.auth().currentUser.email}`)
      //.doc("jb@mail.com")
      .collection(`favourites`)
      //.doc('KjVYAx27WOPN1Ke6ygCs')
      .onSnapshot((snapshot) => {
        favsList = [];
        snapshot.forEach((doc) => {
          const favItem = doc.data();
          favsList.push({
            address: doc.data().address,
            location: doc.data().location,
            name: doc.data().name,
            docId: doc.id,
          });
        });

        favesRetrieved(favsList);
      })
  );

  //console.log(favsList);
}

async function deleteFavourite(docId) {
  //console.log(docId);
  var docRef = db
    .collection(`users`)
    .doc(`${await firebase.auth().currentUser.email}`)
    .collection(`favourites`);
  docRef
    .doc(docId)
    .delete()
    .then((result) => {
      //console.log(result);
    });
}

LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

const NavFavourites = () => {
  const [faves, setFaves] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    try {
      getFavourites(setFaves);
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  return (
    <ScrollView
      scrollEnabled={true}
      nestedScrollEnabled={true}
      style={tw`h-1/2`}
    >
      <FlatList
        scrollEnabled={true}
        scrollToOverflowEnabled={true}
        nestedScrollEnabled={true}
        data={faves}
        keyExtractor={(item, index) => index}
        ItemSeparatorComponent={() => (
          <View style={[tw`bg-gray-200`, { height: 0.5 }]} />
        )}
        renderItem={({ item: { location, name, address, docId } }) => (
          <TouchableOpacity
            style={tw`flex-1 flex-row p-3`}
            onPress={() => {
              navigation.navigate("MapScreen", {
                location: location,
                name: name,
                address: address,
              });
            }}
          >
            <Icon
              style={tw`mr-3 rounded-full bg-gray-300 p-2 mt-2 justify-start`}
              name="location"
              type="entypo"
              color="black"
              size={18}
            />
            <View style={tw`mr-5 flex-auto items-stretch self-stretch`}>
              <Text style={tw`font-semibold text-lg`}>{name}</Text>
              <Text style={tw`text-gray-500`}>{address}</Text>
            </View>
            <TouchableOpacity
              style={tw`m-1 justify-end`}
              onPress={() => {
                deleteFavourite(docId);
              }}
            >
              <Icon
                style={tw`rounded-full p-2 `}
                name="cancel"
                type="MaterialIcons"
                color="red"
                size={28}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
};

export default NavFavourites;

const styles = StyleSheet.create({});
