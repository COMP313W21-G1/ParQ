import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/core";
import { firebase, db } from "../firebase";
import { selectOrigin, setOrigin } from "../slices/navSlice";
import { MapScreen } from "../screens/MapScreen";
import MapView from "react-native-maps";

const data1 = [
  {
    id: "123",
    icon: "home",
    location: "Home",
    destination: "Roy Thomson Hall, ON",
    latitude: "43.6466",
    longitude: "-79.3864",
  },
  {
    id: "456",
    icon: "briefcase",
    location: "Work",
    destination: "Centennial College",
    latitude: "43.7863",
    longitude: "-79.2264",
  },
];

function onError(error) {
  console.error(error);
}

async function getFavourites(favesRetrieved) {
  var favsList;
  var snapshot = await db
    .collection(`users`)
    .doc(`${await firebase.auth().currentUser.email}`)
    //.doc("jb@mail.com")
    .collection(`favourites`)
    //.doc('KjVYAx27WOPN1Ke6ygCs')
    .get();

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
  //console.log(favsList);
  favesRetrieved(favsList);
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

const NavFavourites = () => {
  const [faves, setFaves] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    try {
      //const authUser = firebase.auth();
      //getFavourites(setFaves);
      const unsub = getFavourites(setFaves);
      return () => {
        unsub();
      };
      //console.log(result);
    } catch (error) {
      console.log(error.message);
    }
    // setFaves(getFavorites());
  }, []);

  return (
    <SafeAreaView>
      <FlatList
        data={faves}
        keyExtractor={(item) => item.name}
        ItemSeparatorComponent={() => (
          <View style={[tw`bg-gray-200`, { height: 0.5 }]} />
        )}
        renderItem={({ item: { location, name, address, docId } }) => (
          <TouchableOpacity
            style={tw`flex-1 flex-row p-3`}
            onPress={() => {
              navigation.navigate("MapScreen", {
                location: location,
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
    </SafeAreaView>
  );
};

export default NavFavourites;

const styles = StyleSheet.create({});
