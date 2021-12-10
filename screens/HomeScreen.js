import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import SafeViewAndroid from "../components/SafeViewAndroid";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/core";
import tw from "tailwind-react-native-classnames";
import NavOptions from "../components/NavOptions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch } from "react-redux";
//import { setDestination, setOrigin } from "../slices/navSlice";
import { setOrigin } from "../slices/navSlice";
import NavFavourites from "../components/NavFavourites";
import { firebase } from "../firebase";
// keyboard avoiding view
import KeyboardAvoidingWrapper from "./../components/KeyboardAvoidingWrapper";
import * as Location from "expo-location";

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      //console.log(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    //text = JSON.stringify(location);
  }

  const handleSignout = async () => {
    try {
      await firebase
        .auth()
        .signOut()
        .then(() => console.log("Signed Out"));
      console.log("Signed out successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView
      style={[SafeViewAndroid.AndroidSafeAreaTop, tw`bg-white h-full`]}
    >
      <View style={tw`p-5`}>
        <View style={tw`flex-row justify-between`}>
          <TouchableOpacity
            onPress={handleSignout}
            style={{ height: 120, width: 150 }}
          >
            <Image
              style={{
                width: 150,
                height: 150,
                resizeMode: "contain",
              }}
              source={require("../assets/logo.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!location ? true : false}
            onPress={() => {
              if (!location) {
                return;
              }
              if (location) {
                const loc = { lat: location.latitude, lng: location.longitude };
                dispatch(
                  setOrigin({
                    location: loc,
                    description: "Current Location",
                    name: "Current Location",
                    address: null,
                  })
                );
                navigation.navigate("MapScreen");
                //console.log(location.latitude);
              }
            }}
          >
            <Icon
              style={tw`m-5 rounded-full bg-gray-300 p-2 mt-16`}
              name="near-me"
              type="MaterialIcons"
              color="black"
              size={24}
            />
          </TouchableOpacity>
        </View>
        <View>
          <GooglePlacesAutocomplete
            placeholder="Park Where?"
            styles={{
              container: {
                flex: 0,
              },
              textInput: {
                fontSize: 18,
              },
            }}
            onPress={(data, details = null) => {
              //console.log(details.formatted_address);
              dispatch(
                setOrigin({
                  location: details.geometry.location,
                  description: data.description,
                  name: details.name,
                  address: details.formatted_address,
                })
              );
            }}
            fetchDetails={true}
            returnKeyType={"search"}
            enablePoweredByContainer={false}
            minLength={2}
            query={{
              key: GOOGLE_MAPS_APIKEY,
              language: "en",
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
          />
        </View>

        <NavOptions style={tw``} />
      </View>
      <NavFavourites style={tw`p-1`} />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  text: {
    color: "blue",
  },
});
