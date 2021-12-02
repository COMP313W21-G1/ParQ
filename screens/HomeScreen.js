import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import SafeViewAndroid from "../components/SafeViewAndroid";
import tw from "tailwind-react-native-classnames";
import NavOptions from "../components/NavOptions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch } from "react-redux";
import { setDestination, setOrigin } from "../slices/navSlice";
import NavFavourites from "../components/NavFavourites";
import { firebase } from "../firebase";
// keyboard avoiding view
import KeyboardAvoidingWrapper from "./../components/KeyboardAvoidingWrapper";

const HomeScreen = () => {
  const dispatch = useDispatch();

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
        <TouchableOpacity
          onPress={handleSignout}
          style={{ height: 150, width: 150, marginBottom: 20 }}
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

        <GooglePlacesAutocomplete
          placeholder="Current Location?"
          styles={{
            container: {
              flex: 0,
            },
            textInput: {
              fontSize: 18,
            },
          }}
          onPress={(data, details = null) => {
            dispatch(setOrigin({
              location: details.geometry.location,
              description: data.description
            }));

            dispatch(setDestination(null));
          }}
          fetchDetails={true}
          returnKeyType={"search"}
          enablePoweredByContainer={false}
          minLength={2}
          query={{
            key: GOOGLE_MAPS_APIKEY,
            language: "en",
            components: "country:can"
          }}
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={400}
        />

        <NavOptions />
        <NavFavourites />
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
