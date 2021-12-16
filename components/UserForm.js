import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { firebase, db } from "../firebase";
import ModalDropdown from "react-native-modal-dropdown";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import Validator from "email-validator";
import { useNavigation } from "@react-navigation/core";
import { GOOGLE_MAPS_APIKEY } from "@env";

//import phone input
import PhoneInput from "react-native-phone-number-input";

// icon
import { Octicons, Ionicons } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const UserForm = (person, cancelEdit) => {
  if (!person) {
    return;
  }
  //phone use cases
  const phoneInput = useRef < PhoneInput > null;
  const persona = useRef(person);

  useEffect(() => {
    try {
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const navigation = useNavigation();
  const UserFormSchema = Yup.object().shape({
    type: Yup.string().required("An account type is required"),
    email: Yup.string().email().required("An email is required"),
    firstname: Yup.string().required().min(2, "A first name is required"),
    lastname: Yup.string().required().min(2, "A last name is required"),
    address: Yup.string().required().min(2, "An address is required"),
    phone: Yup.string().required().min(7, "A phone number is required"),
  });

  const getRandomProfilePicture = async () => {
    const response = await fetch("https://picsum.photos/200");
    const data = await response.json();
    ///return data.results[0].picture.large;
    return "https://picsum.photos/200";
  };

  //const onSignup = async (email, firstname, lastname, streetaddress, city, province, postalcode, profile_picture, phone) => {
  const onSignup = async (
    type,
    firstname,
    lastname,
    email,
    phone,
    address,
    owner_uid
  ) => {
    try {
      //type = type == "driver" ? "driver" : "driver1";
      const authUser = await firebase.auth().currentUser;
      // console.log("LINE 79 UserForm===>", type);
      // console.log(
      //   `${type} ${firstname} ${lastname} ${email} ${address} ${owner_uid}`
      // );
      db.collection("users")
        .doc(authUser.email)
        .update({
          email: email,
          phone: phone,
          address: address,
        })
        .then((result) =>
          Alert.alert(
            "Update Complete",
            `Your account has been updated ${firstname} ${lastname}`
          )
        );
    } catch (error) {
      console.log(error.message);
      Alert.alert("Attention!", error);
    }
  };

  return (
    <View style={tw`px-14 mb-0 pt-20`}>
      <Formik
        style={tw`flex-1`}
        initialValues={{
          type: person.person.type,
          firstname: person.person.firstname,
          lastname: person.person.lastname,
          email: person.person.email,
          phone: person.person.phone,
          address: person.person.address,
          owner_uid: firebase.auth().currentUser.uid,
        }}
        onSubmit={(values) => {
          //console.log(values);
          onSignup(
            values.type,
            values.firstname,
            values.lastname,
            values.email,
            values.phone,
            values.address,
            values.owner_uid
          );
        }}
        validationSchema={UserFormSchema}
        validateOnMount={true}
      >
        {({
          setFieldValue,
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          isValid,
        }) => (
          <>
            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    1 > values.firstname.length || values.firstname.length >= 2
                      ? "#CCC"
                      : "red",
                },
              ]}
            >
              <TextInput
                editable={false}
                selectTextOnFocus={false}
                placeholderTextColor="#444"
                placeholder="First Name"
                autoCapitalize="words"
                style={tw`w-4/5 m-auto text-center font-bold text-lg`}
                onChangeText={handleChange("firstname")}
                onBlur={handleBlur("firstname")}
                value={values.firstname}
              />
            </View>

            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    1 > values.lastname.length || values.lastname.length >= 2
                      ? "#CCC"
                      : "red",
                },
              ]}
            >
              <TextInput
                editable={false}
                selectTextOnFocus={false}
                placeholderTextColor="#444"
                placeholder="Last Name"
                autoCapitalize="words"
                style={tw`w-4/5 m-auto text-center font-bold text-lg`}
                onChangeText={handleChange("lastname")}
                onBlur={handleBlur("lastname")}
                value={values.lastname}
              />
            </View>

            <View style={[styles.inputField, tw`bg-gray-200`]}>
              <TextInput
                editable={false}
                selectTextOnFocus={false}
                placeholderTextColor="#444"
                disabled
                placeholder="Email"
                autoCapitalize="none"
                style={tw`w-4/5 m-auto text-center font-bold text-lg`}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoFocus={true}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
              />
            </View>

            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    values.phone.length >= 10 || values.phone.length <= 1
                      ? "#CCC"
                      : "red",
                },
                tw`py-0 px-1 pl-0`,
              ]}
            >
              <PhoneInput
                refs={phoneInput}
                value={values.phone}
                //set default country to canada
                containerStyle={{ width: "100%" }}
                placeholder="1234567890"
                defaultCode="CA"
                layout="first"
                textContentType="phone"
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                onChangeFormattedText={handleChange("phone")}
                withDarkTheme
                withShadow
                autoFocus
              />
            </View>

            <View style={[styles.inputField, tw`bg-gray-200`]}>
              <TextInput
                multiline={true}
                editable={false}
                selectTextOnFocus={false}
                placeholderTextColor="#444"
                disabled
                autoCapitalize="none"
                style={tw`w-4/5 m-auto text-center font-bold text-lg`}
                autoFocus={true}
                value={person.person.address}
              />
            </View>

            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    1 > values.address.length || values.address.length >= 2
                      ? "#CCC"
                      : "red",
                },
              ]}
            >
              <GooglePlacesAutocomplete
                placeholderTextColor="#444"
                placeholder="New Home Address"
                autoCapitalize="none"
                textInputProps={{
                  // Any props put in here will go directly onto the TextInput
                  value: values?.address,
                  onChangeText: handleChange("address"),
                }}
                //noScroll={true}
                scrollEnabled={true}
                query={{
                  key: GOOGLE_MAPS_APIKEY,
                  language: "en", // language of the results
                  components: "country:ca",
                }}
                onPress={(data, details = null) => {
                  setFieldValue(
                    "address",
                    data.description ? data.description : ""
                  );
                }}
                onFail={(error) => console.error(error)}
                listViewDisplayed="auto"
                requestUrl={{
                  url: "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api",
                  useOnPlatform: "web",
                }} // this in only required for use on the web. See https://git.io/JflFv    more for details.
                styles={{
                  textInputContainer: {
                    backgroundColor: "rgba(0,0,0,0)",
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                  },
                  textInput: {
                    marginLeft: 0,
                    marginRight: 0,
                    height: 38,
                    color: "#5d5d5d",
                    fontSize: 16,
                  },
                  predefinedPlacesDescription: {
                    color: "#1faadb",
                  },
                  listView: {
                    scrollEnabled: false,
                  },
                }}
              />
            </View>
            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    1 > values.type.length || values.type.length >= 2
                      ? "#CCC"
                      : "red",
                },
                tw`bg-gray-200`,
              ]}
            >
              <ModalDropdown
                defaultValue={"Account Type: " + values.type}
                disabled
                textStyle={tw`text-lg font-bold m-auto`}
                dropdownStyle={tw`w-1/3 `}
                style={tw`w-4/5 m-auto m-auto font-bold text-lg`}
                options={["driver", "vendor"]}
                dropdownTextStyle={tw`text-lg font-bold text-center`}
                renderSeparator={() => (
                  <View style={[tw`bg-gray-200`, { height: 2 }]} />
                )}
                onSelect={(index, value) => {
                  values.type = value;
                }}
              />
            </View>

            <View style={tw`w-3/4 m-auto mt-0 pt-0`}>
              <Pressable
                titleSize={20}
                style={[styles.button(isValid), tw`rounded-full`]}
                onPress={handleSubmit}
                disabled={!isValid}
              >
                <Text style={styles.buttonText}>Update</Text>
              </Pressable>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

export default UserForm;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 30,
  },

  inputField: {
    borderRadius: 4,
    padding: 7,
    backgroundColor: "#FAFAFA",
    marginBottom: 10,
    borderWidth: 1,
    flexDirection: "row",
  },

  button: (isValid) => ({
    backgroundColor: isValid ? "#0096F6" : "#9ACAF7",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 42,
    borderRadius: 4,
    marginTop: 30,
  }),

  buttonText: {
    color: "#fff",
    fontSize: 20,
  },

  signupContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 50,
  },

  rightIcon: {
    alignSelf: "flex-end",
  },

  dropdown: {
    fontSize: 18,
    height: 70,
  },
});
