import React, { useState } from "react";
import {
  TextInput,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "tailwind-react-native-classnames";
import SafeViewAndroid from "./SafeViewAndroid";
import { Icon, Image } from "react-native-elements";
import { useNavigation } from "@react-navigation/core";
import { useSelector } from "react-redux";
import Validator from "email-validator";
import { Formik } from "formik";
import * as Yup from "yup";
import { firebase, db } from "../firebase";

async function addFavorites(location) {
  let loc = [];
  loc = [
    location.route.params.location.lat,
    location.route.params.location.lng,
  ];
  //console.log(loc);
  var snapshot = await db
    .collection(`users`)
    .doc(`${await firebase.auth().currentUser.email}`)
    //.doc("jb@mail.com")
    .collection(`favourites`)
    //.doc('KjVYAx27WOPN1Ke6ygCs')
    .add({
      location: loc,
      name: location.route.params.name,
      address: location.route.params.address,
    })
    .then((result) => {
      //console.log(result);
      Alert.alert("Added to Favourites");
    });
}

const FavouriteForm = (location) => {
  const navigation = useNavigation();
  const FavoriteFormSchema = Yup.object().shape({
    name: Yup.string()
      .required()
      .min(3, "Favorite name must be min 3 characters"),
  });
  //console.log(location);

  return (
    <SafeAreaView
      style={[SafeViewAndroid.AndroidSafeAreaBottom, tw`bg-white flex-grow`]}
    >
      <View>
        <Text style={tw`text-2xl text-center font-bold`}>Favourite Form</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack(location)}
          style={tw`absolute top-3 left-5 z-50 p-3 rounded-full`}
        >
          <Icon name="chevron-left" type="fontawesome" />
        </TouchableOpacity>
        <Formik
          initialValues={{ name: location.route.params.name }}
          onSubmit={(values) => {
            addFavorites(location);
            navigation.goBack(location);
            //onLogin(values.email, values.password);
          }}
          validationSchema={FavoriteFormSchema}
          validateOnMount={true}
        >
          {({ handleChange, handleBlur, handleSubmit, values, isValid }) => (
            <>
              <View
                style={[
                  styles.inputField,
                  {
                    borderColor:
                      values.name.length < 1 || Validator.validate(values.name)
                        ? "#CCC"
                        : "red",
                  },
                ]}
              >
                <TextInput
                  placeholderTextColor="#444"
                  placeholder="name"
                  autoCapitalize="none"
                  autoFocus={true}
                  textAlign="center"
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                />
              </View>

              <Pressable
                titleSize={20}
                style={tw`bg-red-100 w-1/4 m-auto rounded-full rounded-3xl p-3 border-2 border-gray-300`}
                onPress={handleSubmit}
                disabled={!isValid}
              >
                {/* <Text style={styles.buttonText}>Log In</Text> */}
                <Icon
                  style={tw`rounded-full`}
                  name="favorite"
                  type="MaterialIcons"
                  color="red"
                  size={48}
                />
              </Pressable>
            </>
          )}
        </Formik>
        {/* <Formik initialValues={{ name: "Enter Name" }}></Formik> */}
      </View>
    </SafeAreaView>
  );
};

export default FavouriteForm;

const styles = StyleSheet.create({
  inputField: {
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#FAFAFA",
    margin: 23,
    marginTop: 33,
    borderWidth: 1,
  },

  button: (isValid) => ({
    backgroundColor: isValid ? "#0096F6" : "#9ACAF7",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 42,
    maxWidth: "50%",
    borderRadius: 100,
  }),

  buttonText: {
    color: "#fff",
    fontSize: 20,
  },

  signupContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginTop: 50,
  },

  dropdownStyle: {
    marginLeft: -15,
    width: "100%",
    backgroundColor: "#CCC",
  },
});
