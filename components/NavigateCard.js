import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import SafeViewAndroid from "./SafeViewAndroid";
import {
  selectDestination,
  selectOrigin,
  setTravelTimeInformation,
} from "../slices/navSlice";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch } from "react-redux";
import { setOrigin } from "../slices/navSlice";
import { useNavigation } from "@react-navigation/core";
import NavFavourites from "./NavFavourites";
import { Icon } from "react-native-elements";
import { useSelector } from "react-redux";
import { DatePickerIOS } from "react-native";

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
      <Text style={tw`text-center py-5 text-xl`}>Good Morning</Text>
      <View style={tw`border-t border-gray-200 flex-shrink`}>
        <View>
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
                })
              );
              //navigation.navigate("MapScreen");
            }}
            enablePoweredByContainer={false}
            query={{
              key: GOOGLE_MAPS_APIKEY,
              language: "en",
              type: "establishment",
              components: "country:can",
              radius: 5,
              location: `${origin.location.lat}, ${origin.location.lng}`,
              rankby: "distance",
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
          />
        </View>
        {/* <NavFavourites /> */}
      </View>
      <View
        style={tw`flex-row bg-white justify-evenly py-2 mt-auto border-t border-gray-100`}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("RideOptionsCard")}
          style={tw`flex flex-row justify-between bg-black w-36 px-4 py-3 rounded-full`}
        >
          <Icon name="car" type="font-awesome" color="white" size={16} />
          <Text style={tw`text-white text-center`}>Reserve Spot</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`flex flex-row justify-between w-36 px-1 py-1 rounded-full`}
        >
          <Icon name="favorite" type="MaterialIcons" color="red" size={16} />
          <Text style={tw`text-center`}>Add to favourites</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NavigateCard;

const toInputBoxStyles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingTop: 20,
    flex: 0,
  },
  textInput: {
    backgroundColor: "#DDDDDF",
    borderRadius: 0,
    fontSize: 18,
  },
  textInputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
});
