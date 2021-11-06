import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";

import { firebase, db } from "../../firebase";

import { Formik } from "formik";
import * as Yup from "yup";
import Validator from "email-validator";
import { useNavigation } from "@react-navigation/core";

//import phone input
import PhoneInput from "react-native-phone-number-input";
//import { Colors } from "react-native/Libraries/NewAppScreen";

// keyboard avoiding view
import KeyboardAvoidingWrapper from './../KeyboardAvoidingWrapper';



//adddress stuff
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_APIKEY } from '@env';
import { useDispatch } from 'react-redux';
import { setDestination, setOrigin } from './../../slices/navSlice';

// icon
import { Octicons, Ionicons } from '@expo/vector-icons';
import { FlatList } from "react-native-gesture-handler";

const SignupForm = () => {

  //phone use cases
  const phoneInput = useRef<PhoneInput>(null);
  const [hidePassword, setHidePassword] = useState(true);
  const [hidePassword2, setHidePassword2] = useState(true);


  const navigation = useNavigation();
  const SignupFormSchema = Yup.object().shape({
    email: Yup.string().email().required("An email is required"),
    firstname: Yup.string().required().min(2, "A first name is required"),
    lastname: Yup.string().required().min(2, "A last name is required"),
    username: Yup.string().required().min(2, "A username is required"),
    address: Yup.string().required().min(2, "An address is required"),
    //streetaddress: Yup.string().required().min(2, "A street address is required"),
    //city: Yup.string().required().min(2, "A city is required"),
    //province: Yup.string().required().min(2, "A province is required"),
    phone: Yup.string().required().min(7, "A phone number is required"),
    password: Yup.string()
      .required()
      .min(6, "Your password has to have at least 6 characters"),
    confirmpassword: Yup.string()
      .required()
      .min(6, "Your password has to have at least 6 characters"),
  });

  const getRandomProfilePicture = async () => {
    const response = await fetch("https://randomuser.me/api");
    const data = await response.json();
    return data.results[0].picture.large;
  };

  //const onSignup = async (email, password,firstname, lastname, streetaddress, city, province, postalcode, username, phone) => {
  const onSignup = async ( firstname, lastname, username, email, phone, address, password, confirmpassword) => {

    // perform all neccassary validations
    if (password !== confirmpassword) {
        alert("Passwords don't match");
    } 
    else {

      try {
        const authUser = await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password);
        console.log("Firebase User Created Successfully!");

        db.collection("users")
        .doc(authUser.user.email)
        .set({ 
          owner_uid: authUser.user.uid,           
          firstname: firstname,
          lastname: lastname,
          username: username,
          email: authUser.user.email,
          phone: phone,  
          address: address,
          profile_picture: await getRandomProfilePicture(),
        });
      } catch (error) {
        Alert.alert("Attention!", error.message);
      }
    }

  };

  return (
    
    <View 
    style={styles.wrapper}>
      <Formik
        initialValues={{firstname: "", lastname: "",  username: "", email: "",   phone: "", address: "", password: "",  confirmpassword: ""}}
        onSubmit={(values) => {
          onSignup( values.firstname, values.lastname, values.username,  values.email, values.phone, values.address, values.password, values.confirmpassword );
        }}
        validationSchema={SignupFormSchema}
        validateOnMount={true}
      >
        {({ handleChange, handleBlur, handleSubmit, values, isValid }) => (
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
                placeholderTextColor="#444"
                placeholder="First Name"
                autoCapitalize="words"
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
                placeholderTextColor="#444"
                placeholder="Last name"
                autoCapitalize="words"
                onChangeText={handleChange("lastname")}
                onBlur={handleBlur("lastname")}
                value={values.lastname}
              />
            </View>


            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    1 > values.username.length || values.username.length >= 2
                      ? "#CCC"
                      : "red",
                },
              ]}
            >
              <TextInput
                placeholderTextColor="#444"
                placeholder="Username"
                autoCapitalize="words"
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                value={values.username}
              />
            </View>

            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    values.email.length < 1 || Validator.validate(values.email)
                      ? "#CCC"
                      : "red",
                },
              ]}
            >
              <TextInput
                placeholderTextColor="#444"
                placeholder="Email"
                autoCapitalize="none"
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
                  //1 > values.phone.length || (values.phone.length < 7 && values.phone.length > 1)
                   values.phone.length >= 10 || values.phone.length <= 1
                      ? "#CCC"
                      : "red",
                },
              ]}
            >
              <PhoneInput
                refs={phoneInput}
                value={values.phone}
                //set default country to canada
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
              {/* 
              <GooglePlacesAutocomplete
                
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
                  language: "en"
                }}
                nearbyPlacesAPI="GooglePlacesSearch"
                debounce={400}
              />*/}

               {/*  <GooglePlacesAutocomplete
                placeholderTextColor="#444"
                placeholder="Home Address"
                autoCapitalize="none"
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
                value={values.address}
                //noScroll={true}
                scrollEnabled={true}
                query={{
                  key: GOOGLE_MAPS_APIKEY,
                  language: "en", // language of the results
                }}
                onPress={(data, details = null) => {
                  console.log(details);
                  console.log(data);
                  console.log("data.description",data.description.split(','));

                }}
                onFail={(error) => console.error(error)}
                listViewDisplayed="auto"
                requestUrl={{
                  url:
                    "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api",
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
              />*/}
               
           <TextInput
                placeholderTextColor="#444"
                placeholder="Home Address"
                autoCapitalize="none"
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
                value={values.address}
              />
            </View>

            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    1 > values.password.length || values.password.length >= 6
                      ? "#CCC"
                      : "red",
                },
              ]}
            >
              <TextInput
                placeholderTextColor="#444"
                placeholder="Password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={hidePassword}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                style={styles.passwordInput}
                hidePassword={hidePassword}
                setHidePassword={setHidePassword}
              />

              
              <TouchableOpacity 
                style={styles.rightIcon}
                onPress={() => {
                  setHidePassword(!hidePassword);
                }} >
                <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={25}  />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    1 > values.confirmpassword.length || values.confirmpassword.length >= 6
                      ? "#CCC"
                      : "red",
                },
              ]}
            >
              <TextInput
                placeholderTextColor="#444"
                placeholder="Confirm Password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={hidePassword2}
                onChangeText={handleChange("confirmpassword")}
                onBlur={handleBlur("confirmpassword")}
                style={styles.passwordInput}
                value={values.confirmpassword}
                hidePassword={hidePassword2}
                setHidePassword={setHidePassword2}
              />
              <TouchableOpacity 
                style={styles.rightIcon}
                onPress={() => {
                  setHidePassword2(!hidePassword2);
                }} >
                <Ionicons name={hidePassword2 ? 'md-eye-off' : 'md-eye'} size={25}  />
              </TouchableOpacity>
            </View>

            <Pressable
              titleSize={20}
              style={styles.button(isValid)}
              onPress={handleSubmit}
              disabled={!isValid}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>

            <View style={styles.signupContainer}>
              <Text>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={{ color: "#6BB0F5" }}> Log In</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};


export default SignupForm;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 80,
  },

  inputField: {
    borderRadius: 4,
    padding: 12,
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
    marginTop: 50,
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

  rightIcon: {    
    alignSelf: 'flex-end',
  },

  passwordInput: {    
    //alignSelf: 'flex-end',
    //left: 0,
    //padding: 10,
    //paddingLeft: 55,
    //position: "absolute",
    //zIndex: 1,  
    //flexDirection: "row",  
    width: "88%",
  }
});
