import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  LogBox,
  ScrollView,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import { setFavorite } from "../slices/navSlice";
import tw from "tailwind-react-native-classnames";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/core";
import { firebase, db } from "../firebase";
import { selectOrigin, setOrigin } from "../slices/navSlice";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      getFavourites(setFaves);
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  return (
    <SafeAreaView nestedScrollEnabled={true} style={tw``}>
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
            style={tw`flex-row px-3 py-2`}
            onPress={() => {
              let loc = {};
              loc = { lat: location[0], lng: location[1] };
              dispatch(
                setOrigin({
                  location: loc,
                  description: name,
                  name: name,
                  address: address,
                })
              );
              navigation.navigate("MapScreen");
            }}
          >
            <Icon
              style={tw`mr-3 rounded-full bg-gray-300 p-2 mt-2 justify-start`}
              name="location"
              type="entypo"
              color="black"
              size={18}
            />
            <View style={tw`mr-5 ml-2 flex-auto items-stretch self-stretch`}>
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
