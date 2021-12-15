import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import SafeViewAndroid from "../components/SafeViewAndroid";
import { useNavigation } from "@react-navigation/core";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import { firebase, db, getUser } from "../firebase";
import { Icon } from "react-native-elements";
import NavFavourites from "../components/NavFavourites";
import UserForm from "../components/UserForm";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState([]);
  const [editing, setEditing] = useState(false);
  const Stack = createNativeStackNavigator();

  const setEdit = () => setEditing(true);
  const cancelEdit = () => setEditing(false);
  useEffect(() => {
    try {
      getUser(setUser);
      //console.log("Screen => ", user);
    } catch (error) {
      //
    }
  }, []);

  return editing ? (
    <SafeAreaView style={tw` h-full flex-1 flex-col`}>
      <TouchableOpacity
        onPress={cancelEdit}
        style={tw`bg-gray-100 absolute top-10 right-0 z-50 p-2 rounded-full shadow-lg`}
      >
        <Icon name="cancel" type="fontawesome" color="red" size={30} />
      </TouchableOpacity>
      <UserForm person={user} style={tw`justify-end`} />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={tw`h-full flex-1 flex-col`}>
      <TouchableOpacity
        onPress={() => navigation.navigate("HomeScreen")}
        style={tw`bg-gray-100 absolute top-8 left-5 z-50 p-2 rounded-full shadow-lg`}
      >
        <Icon name="chevron-left" type="fontawesome" size={32} />
      </TouchableOpacity>
      <View style={tw`p-5 flex flex-row justify-between h-1/4 pb-1 mb-2`}>
        <View style={tw`flex-1 flex-wrap w-1/3`}>
          <Text style={tw` pt-16 text-3xl font-bold`}>
            {user.firstname} {user.lastname}
          </Text>
          <Text style={tw`text-lg`}>{user.email}</Text>
        </View>
        <Image
          style={tw`w-1/2 h-full rounded-full`}
          source={{
            uri: user.profile_picture,
          }}
        />
      </View>
      <View
        style={[tw`bg-black mx-3 mt-1 flex-initial flex-shrink`, { height: 1 }]}
      />
      <View style={tw`flex-initial m-0 p-0 h-1/3`}>
        <View style={tw`flex-row justify-around m-2`}>
          <Text style={tw`text-lg font-bold`}>Phone:</Text>
          <Text style={tw`text-lg`}>{user.phone}</Text>
        </View>
        <View style={tw`flex-row justify-around`}>
          <Text style={tw`text-lg font-bold`}>Address:</Text>
          <Text style={tw`text-lg`}>{user.address}</Text>
        </View>
        <View style={tw`flex-row justify-around`}>
          <Text style={tw`text-lg`}></Text>
          <Text style={tw`text-lg`}>
            {user.city}, {user.province}
          </Text>
        </View>
        <View style={tw`flex-row justify-around`}>
          <Text style={tw`text-lg`}></Text>
          <Text style={tw`text-lg`}>{user.postalcode}</Text>
        </View>
        <View style={tw`flex-row justify-start`}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert("Logout ?", "Are You sure you want to Logout?", [
                {
                  text: "Cancel",
                  onPress: () => {
                    return;
                  },
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => {
                    Alert.alert("You Have logged out"),
                      firebase
                        .auth()
                        .signOut()
                        .then(() => navigation.navigate("SignupScreen"));
                  },
                  style: "ok",
                },
              ]);
            }}
            style={tw`bg-red-900 p-2 rounded-lg border-4 border-red-500 mx-1`}
          >
            <Text style={tw`text-yellow-100 text-lg font-bold`}>LOGOUT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setEdit();
            }}
            style={tw`bg-gray-300 p-1 rounded-lg border-8 border-gray-500 mx-1`}
          >
            <Text style={tw`text-gray-900 text-lg font-bold`}>EDIT</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[tw`bg-black  mx-3 m-0`, { height: 2 }]} />

      <SafeAreaView nestedScrollEnabled={true} style={tw`h-2/5 px-2 mx-1`}>
        <NavFavourites />
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  text: {
    color: "blue",
  },
});
