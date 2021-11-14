import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/core";
import { firebase, db } from "../firebase";

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

// let faves = [];
// let choices = [];
// let count = 0;
function onResult(QuerySnapshot) {
  let faves = [];
  console.log(QuerySnapshot[0].data());
  //console.log(QuerySnapshot);
  QuerySnapshot.forEach((item) => {
    console.log(item.id);
    faves.push({
      address: item.data().address,
      location: item.data().location,
      name: item.data().name,
      docId: item.id,
    });

    //console.log(item.data().name);
  });
  return faves;
  //console.log(faves);
}

function onError(error) {
  console.error(error);
}
const getFavorites = async () => {
  try {
    const authUser = await firebase.auth();

    const response = db
      .collection("favorites")
      .where("owner_uid", "==", authUser.currentUser.uid)
      .onSnapshot(onResult, onError);
  } catch (error) {
    console.log(error.message);
  }
};

const deleteFavorite = async (docId) => {
  const authUser = await firebase.auth();

  //console.log(faveNAme);
  db.collection("favorites")
    .doc(docId)
    .delete()
    .then((result) => {
      //console.log(result);
    });
};

const NavFavourites = () => {
  const [faves, setFaves] = useState([]);

  useEffect(() => {
    try {
      const authUser = firebase.auth();

      const response = db
        .collection("favorites")
        //.where("owner_uid", "==", authUser.currentUser.uid)
        .onSnapshot((snapshot) => {
          let favesLocal = [];
          snapshot.forEach((item) => {
            //console.log(item.id);
            favesLocal.push({
              address: item.data().address,
              location: item.data().location,
              name: item.data().name,
              docId: item.id,
            });
            //console.log(favesLocal);
            setFaves(favesLocal);
            // let test = onResult(snapshot);
            //console.log(test);
            // setFaves();
          });
        }, onError);
    } catch (error) {
      console.log(error.message);
    }
    // setFaves(getFavorites());
  }, []);

  return (
    <FlatList
      data={faves}
      keyExtractor={(item) => item.name}
      ItemSeparatorComponent={() => (
        <View style={[tw`bg-gray-200`, { height: 0.5 }]} />
      )}
      renderItem={({ item: { location, name, address, docId } }) => (
        <TouchableOpacity style={tw`flex-row items-center p-5`}>
          <Icon
            style={tw`mr-4 rounded-full bg-gray-300 p-3`}
            name="location"
            type="entypo"
            color="black"
            size={18}
          />
          <View style={tw`flex-row`}>
            <View style={tw`justify-start`}>
              <Text style={tw`font-semibold text-lg`}>{name}</Text>
              <Text style={tw`text-gray-500`}>{address}</Text>
            </View>
            <TouchableOpacity
              style={tw`justify-start`}
              onPress={() => {
                deleteFavorite(docId);
              }}
            >
              <Icon
                style={tw`flex-row rounded-full bg-gray-100 p-3 ml-20`}
                name="erase"
                type="entypo"
                color="black"
                size={20}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default NavFavourites;

const styles = StyleSheet.create({});
