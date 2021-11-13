import React from 'react'
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import SafeViewAndroid from '../components/SafeViewAndroid';
import tw from 'tailwind-react-native-classnames';

import { firebase } from '../firebase';
// keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

const ProfileScreen = () => {
  
  return (

    <SafeAreaView style={[SafeViewAndroid.AndroidSafeAreaTop, tw`bg-white h-full`]}>
      <View style={tw`p-5`}>
        <Text>Profile screen</Text>     
            <Image 
                    style={{
                        width: 300, height: 300, resizeMode: "contain"
                    }}
                    source={{
                        uri: "https://live.staticflickr.com/1271/3352679765_ab5ed937af_b.jpg",
                    }}
                    />
      </View>        
   </SafeAreaView>    
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  text: {
    color: "blue"
  },
});
