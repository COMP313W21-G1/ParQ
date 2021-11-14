import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import LoginForm from "../components/loginScreen/LoginForm";
// keyboard avoiding view
import KeyboardAvoidingWrapper from "./../components/KeyboardAvoidingWrapper";
const INSTAGRAM_LOGO =
  "https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Instagram_colored_svg_1-512.png";

const LoginScreen = ({ navigation }) => (
  <KeyboardAvoidingWrapper>
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={{
            width: 180,
            height: 180,
            resizeMode: "contain",
          }}
          source={require("../assets/logo.png")}
        />
      </View>
      <LoginForm navigation={navigation} />
    </View>
  </KeyboardAvoidingWrapper>
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
