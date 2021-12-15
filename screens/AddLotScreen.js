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

import { firebase, db } from "../firebase";
import ModalDropdown from 'react-native-modal-dropdown';
import { Formik } from "formik";
import * as Yup from "yup";
import Validator from "email-validator";
import { useNavigation } from "@react-navigation/core";

//import phone input
import PhoneInput from "react-native-phone-number-input";
//import { Colors } from "react-native/Libraries/NewAppScreen";







// icon
import { Octicons, Ionicons } from '@expo/vector-icons';
import { FlatList } from "react-native-gesture-handler";

const AddLotScreen = () => {

  //phone use cases
  const phoneInput = useRef<PhoneInput>(null);
  const [hidePassword, setHidePassword] = useState(true);
  const [hidePassword2, setHidePassword2] = useState(true);


  const navigation = useNavigation();
  const SignupFormSchema = Yup.object().shape({
    city: Yup.string().required("A city is required"),
    company: Yup.string().required().min(2, "A company is required"),
    feePerHour: Yup.string().required().min(2, "A fee per hour is required"),
    location: Yup.string().required().min(2, "A location is required"),
    occupied: Yup.string().required().min(2, "How many lots are occupied"),
    parkingaddress: Yup.string().required().min(2, "A Parking address is required"),
    postalCode: Yup.string().required().min(2, "A city is required"),
    province: Yup.string().required().min(2, "A province is required"),
    totalSpots: Yup.string().required().min(7, "How many spot do you have in total")
  });

 
  //const onSignup = async (email, password,firstname, lastname, streetaddress, city, province, postalcode, username, phone) => {
  const onSignup = async (  city, company, feePerHour, location, occupied, parkingaddress, postalCode, province,totalSpots) => {

    
    

      try {
        // const authUser = await firebase
        //   .auth()
        //   .createUserWithEmailAndPassword(email, password);
        // console.log("Firebase User Created Successfully!");
        // Alert.alert("Firebase User Created Successfully!");

        db.collection("parkingLots")
          .add({
            city:city,
            company:company,
            feePerHour:feePerHour,
            location:location,
            occupied:occupied,
            parkingaddress:parkingaddress,
            postalCode:postalCode,
            province:province,
            totalSpots:totalSpots,
          });
      } catch (error) {
        console.log(error.message);
        Alert.alert("Attention!", error.message);
      }
    

  };

  return (

    <View
    style={styles.wrapper}>
      <Formik
        initialValues={{city: "", company: "",  feePerHour: "", location: "",   occupied: "", parkingaddress: "", postalCode: "",  province: "",totalSpots: ""}}
        onSubmit={(values) => {
          onSignup( values.city, values.company, values.feePerHour,  values.location, values.occupied, values.parkingaddress, values.postalCode, values.province,values.totalSpots );
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
                    1 > values.city.length || values.city.length >= 2
                      ? "#CCC"
                      : "red",
                },
              ]}
            >
              <TextInput
                placeholderTextColor="#444"
                placeholder="City"
                autoCapitalize="words"
                onChangeText={handleChange("city")}
                onBlur={handleBlur("city")}
                value={values.city}
              />
            </View>

            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    1 > values.company.length || values.company.length >= 2
                      ? "#CCC"
                      : "red",
                },
              ]}
            >
              <TextInput
                placeholderTextColor="#444"
                placeholder="Company"
                autoCapitalize="words"
                onChangeText={handleChange("company")}
                onBlur={handleBlur("company")}
                value={values.company}
              />
            </View>


            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    1 > values.feePerHour.length || values.feePerHour.length >= 2
                      ? "#CCC"
                      : "red",
                },
              ]}
            >
              <TextInput
                placeholderTextColor="#444"
                placeholder="Fee per hour"
                autoCapitalize="words"
                onChangeText={handleChange("feePerHour")}
                onBlur={handleBlur("feePerHour")}
                value={values.feePerHour}
              />
            </View>

            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    values.location.length < 1 || values.location.length >= 2
                      ? "#CCC"
                      : "red",
                },
              ]}
            >
              <TextInput
                placeholderTextColor="#444"
                placeholder="Location"
                autoCapitalize="none"
                textContentType="location"
                autoFocus={true}
                onChangeText={handleChange("location")}
                onBlur={handleBlur("location")}
                value={values.location}
              />
            </View>


            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                  //1 > values.phone.length || (values.phone.length < 7 && values.phone.length > 1)
                   values.occupied.length >= 1 || values.occupied.length <= 1
                      ? "#CCC"
                      : "red",
                },
              ]}
            >
              <TextInput
               placeholderTextColor="#444"
               placeholder="How many lots are occupied"
               autoCapitalize="none"
               textContentType="occupied"
               autoFocus={true}
               onChangeText={handleChange("occupied")}
               onBlur={handleBlur("occupied")}
               value={values.occupied}
              />
            </View>

            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    1 > values.parkingaddress.length || values.parkingaddress.length >= 2
                      ? "#CCC"
                      : "red",
                },
              ]}
            >
             

           <TextInput
                placeholderTextColor="#444"
                placeholder="Please enter the parking lot address"
                autoCapitalize="none"
                onChangeText={handleChange("parkingaddress")}
                onBlur={handleBlur("parkingaddress")}
                value={values.parkingaddress}
              />
            </View>

            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    1 > values.postalCode.length || values.postalCode.length >= 2
                      ? "#CCC"
                      : "red",
                },
              ]}
            >
             

           <TextInput
                placeholderTextColor="#444"
                placeholder="Please enter the postal address for the parking lot address"
                autoCapitalize="none"
                onChangeText={handleChange("postalCode")}
                onBlur={handleBlur("postalCode")}
                value={values.postalCode}
              />
            </View>

            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    1 > values.province.length || values.province.length >= 2
                      ? "#CCC"
                      : "red",
                },
              ]}
            >
             

           <TextInput
                placeholderTextColor="#444"
                placeholder="Please enter the province"
                autoCapitalize="none"
                onChangeText={handleChange("province")}
                onBlur={handleBlur("province")}
                value={values.province}   
              />
            </View>

   

            <View
                       style={[
                        styles.inputField,
                        {
                          borderColor:
                            1 > values.city.length || values.city.length >= 2
                              ? "#CCC"
                              : "red",
                        },
                      ]}
            >
             

           <TextInput
                placeholderTextColor="#444"
                placeholder="Please enter the total Spots"
                autoCapitalize="none"
                onChangeText={handleChange("totalSpots")}
                onBlur={handleBlur("totalSpots")}
                value={values.totalSpots}   
              />
            </View>

        

            <Pressable
              titleSize={20}
              style={styles.button(isValid)}
              onPress={handleSubmit}
              disabled={!isValid}
            >
              <Text style={styles.buttonText}>Add Parking Lot</Text>
            </Pressable>
          </>
        )}
      </Formik>
    </View>
  );
};


export default AddLotScreen;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 30,
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
    alignSelf: 'flex-end',
  },

  

  dropdown: {
    fontSize: 18,
    height: 70
  },
});
