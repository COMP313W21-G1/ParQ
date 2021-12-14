import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { selectOrigin } from "../slices/navSlice";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch } from "react-redux";
import { setOrigin } from "../slices/navSlice";
import { useNavigation } from "@react-navigation/core";
import { Icon } from "react-native-elements";
import { useSelector } from "react-redux";
import ResultsList from "./ResultsList";

const NavigateCard = () => {
  const origin = useSelector(selectOrigin);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const ref = useRef();

  useEffect(() => {
    ref.current?.setAddressText("parking");
  }, []);
  return (
    <SafeAreaView style={[tw`bg-white flex-1`]}>
      <View style={tw`border-t border-gray-200 flex-grow flex-shrink `}>
        <KeyboardAvoidingView>
          <GooglePlacesAutocomplete
            placeholder="Search Another Address"
            styles={toInputBoxStyles}
            fetchDetails={true}
            returnKeyType={"search"}
            minLength={2}
            onPress={(data, details = null) => {
              dispatch(
                setOrigin({
                  location: details.geometry.location,
                  description: data.description,
                  name: details.name,
                  address: details.formatted_address,
                })
              );
              //navigation.navigate("MapScreen");
            }}
            enablePoweredByContainer={false}
            query={{
              key: GOOGLE_MAPS_APIKEY,
              language: "en",
              //type: "establishment",
              components: "country:can",
              radius: 5,
              location: `${origin.location.lat}, ${origin.location.lng}`,
              rankby: "distance",
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
          />
        </KeyboardAvoidingView>
        <ResultsList />
      </View>
    </SafeAreaView>
  );
};

export default NavigateCard;

const toInputBoxStyles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingTop: 10,
    flex: 0,
  },
  textInput: {
    backgroundColor: "#DDDDDF",
    borderRadius: 20,
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
  },
  textInputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
});
