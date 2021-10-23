import { StyleSheet, Platform, StatusBar, NavigationBar, Dimensions } from 'react-native';

// const screenHeight = Dimensions.get('screen').height;
// const windowHeight = Dimensions.get('window').height;
// const navbarHeight = screenHeight - windowHeight - StatusBar.currentHeight;

const navbarHeight = 0;

export default StyleSheet.create({
  AndroidSafeAreaTop: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight: 0
  },
  AndroidSafeAreaBottom: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: Platform.OS === "android" ? navbarHeight: 0
  }
});