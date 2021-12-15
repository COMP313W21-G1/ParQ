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
import { useDispatch, useSelector } from "react-redux";
//import { setDestination, setOrigin } from "../slices/navSlice";
import { setOrigin } from "../slices/navSlice";
import NavFavourites from "../components/NavFavourites";
import { firebase } from "../firebase";
import * as Location from "expo-location";
import { selectVendor } from "../slices/vendorSlice";

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const vendor = useSelector(selectVendor);

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
      <View style={tw`px-2 flex flex-col justify-start`}>
        <View style={tw`flex-row justify-between px-1`}>
          <TouchableOpacity
            disabled
            style={[{ height: 120, width: 150 }, tw``]}
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
          <>
          {!vendor && <TouchableOpacity
            disabled={!location}
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
                    address: "",
                  })
                );
                navigation.navigate("MapScreen");
                //console.log(location.latitude);
              }
            }}
          >
            <Icon
              style={tw`m-5 rounded-full bg-gray-300 p-3 mt-12`}
              name="near-me"
              type="MaterialIcons"
              color="black"
              size={24}
            />
          </TouchableOpacity>
          }
          </>
        </View>
        
        <View style={tw`${vendor ? "m-6" : ""}`}>
          <>
          {!vendor &&
          <GooglePlacesAutocomplete
            placeholder="Get Parking..."
            styles={{
              container: {
                flex: 0,
              },
              textInput: {
                fontSize: 16,
                textAlign: "center",
                fontWeight: "bold",
                textDecorationLine: "none",
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
              components: 'country:ca',
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
          />
        }</>
        </View>

        <NavOptions style={tw`h-1/3 mb-0`} />
        <SafeAreaView style={tw`h-1/3 px-1 m-0`}>
          <NavFavourites />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  text: {
    color: "blue",
  },
});
