import React from "react";
import tw from "tailwind-react-native-classnames";
import {
  StyleSheet,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import LoginForm from "../components/loginScreen/LoginForm";
// keyboard avoiding view
import KeyboardAvoidingWrapper from "./../components/KeyboardAvoidingWrapper";
const INSTAGRAM_LOGO =
  "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Instagram_colored_svg_1-512.png";

const LoginScreen = () => (
  <View style={[styles.container, tw`flex-1 flex-col`]}>
    <View style={[styles.logoContainer, tw`  h-1/4`]}>
      <Image
        style={{
          width: 180,
          height: 180,
          resizeMode: "contain",
        }}
        source={require("../assets/logo.png")}
      />
    </View>

    <View style={tw``}>
      <KeyboardAvoidingView style={tw`flex-shrink flex-grow h-3/4`}>
        <LoginForm />
      </KeyboardAvoidingView>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 50,
    paddingHorizontal: 12,
  },

  logoContainer: {
    alignItems: "center",
    marginTop: 60,
  },
});

export default LoginScreen;
