import * as React from "react";
import MapView, { Callout, Circle, Marker } from "react-native-maps";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useNavigation } from "@react-navigation/core";
import { TouchableOpacity } from "react-native-gesture-handler";
import tw from "tailwind-react-native-classnames";
import { Icon } from "react-native-elements";
import { firebase, db } from "../firebase";

function detailClick(detail) {
  //console.log(detail);
}

async function addFavorites(location) {
  console.log(location);
  var snapshot = await db
    .collection(`users`)
    .doc(`${await firebase.auth().currentUser.email}`)
    //.doc("jb@mail.com")
    .collection(`favourites`)
    //.doc('KjVYAx27WOPN1Ke6ygCs')
    .add({
      location: location.coordinate,
      name: "barbados",
      address: "123 fake st",
    })
    .then((result) => {
      //console.log(result);
    });
}

export default function App(location) {
  //console.log("location = ", location);
  const faveOrigin = {
    latitude: location?.route?.params?.location
      ? location?.route?.params?.location?.latitude
      : 43.7131722,
    longitude: location?.route?.params?.location
      ? location?.route?.params?.location?.longitude
      : -79.2563805,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const [region, setRegion] = React.useState({
    latitude: 43.7131722,
    longitude: -79.2563805,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [pin, setPin] = React.useState({
    latitude:
      location.route.params === "undefined" ? 43.7131722 : faveOrigin.latitude,
    longitude:
      location.route.params === "undefined"
        ? -79.2563805
        : faveOrigin.longitude,
  });
  //console.log(faveOrigin?.location?.latitude, faveOrigin?.location?.longitude);
  console.log(pin);
  return (
    <View style={{ marginTop: 30, flex: 1 }}>
      <GooglePlacesAutocomplete
        placeholder="Search"
        fetchDetails={true}
        GooglePlacesSearchQuery={{
          rankby: "distance",
        }}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log("DEETS:", data);
          setRegion({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }}
        query={{
          key: "AIzaSyBAlXtxufpgdyf5BRDa03tLUg-xhlt9NCw",
          language: "en",
          types: "establishment",
          components: "country:can",
          radius: 5,
          location: `${region.latitude}, ${region.longitude}`,
        }}
        styles={{
          container: {
            flex: 0,
            position: "relative",
            width: "100%",
            zIndex: 1,
          },
          listView: { backgroundColor: "white" },
        }}
      />
      <MapView
        style={styles.map}
        // initialRegion={
        //   location?.route?.params?.location?.latitude === null
        //     ? region
        //     : faveOrigin
        // }
        initialRegion={
          location.route.params === undefined ? region : faveOrigin
        }
        provider="google"
      >
        <Marker
          coordinate={pin}
          pinColor="black"
          draggable={true}
          onPress={(pressedLoc) => {
            //console.log(pressedLoc.nativeEvent);
          }}
          onDragStart={(e) => {
            console.log("Drag start", e.nativeEvent.coordinate);
          }}
          onDragEnd={(e) => {
            setPin({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            });
          }}
        >
          <Callout
            style={styles.detailCard}
            onPress={(e) => {
              addFavorites(e.nativeEvent);
            }}
          >
            <Text>{location?.route?.params?.name}</Text>
            <Text>{location?.route?.params?.address}</Text>
            <TouchableOpacity
              style={tw`m-1 justify-end`}
              onPress={(e) => {
                //detailClick(("Callout::onPress", e.nativeEvent));
              }}
            >
              <Icon
                style={tw`rounded-full p-3 m-10`}
                onPress={(e) => {
                  //console.log(e);
                }}
                name="favorite"
                type="MaterialIcons"
                color="red"
                size={48}
              />
            </TouchableOpacity>
          </Callout>
        </Marker>
        <Circle center={pin} radius={1000} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  detailCard: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
});
