import * as React from 'react';
import MapView, { Callout, Circle, Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"

export default function App() {

  const [pin,setPin] = React.useState({
    latitude:43.7131722,
    longitude:-79.2563805
  })
  const [ region, setRegion ] = React.useState({
		latitude: 43.7131722,
		longitude: -79.2563805,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421
	})
  return (
    <View style={{marginTop: 30, flex: 1}}>
       <GooglePlacesAutocomplete
      placeholder="Search"
      fetchDetails={true}
      GooglePlacesSearchQuery={{
        rankby: "distance"
      }}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
        setRegion({
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        })
      }}
     
      query={{
        key: 'AIzaSyBAlXtxufpgdyf5BRDa03tLUg-xhlt9NCw',
        language: 'en',
        types: "establishment",
        components:"country:can",
        radius: 5,
        location: `${region.latitude}, ${region.longitude}`
      }}
      styles={{
        container: { flex: 0, position: "relative", width: "100%", zIndex: 1 },
        listView: { backgroundColor: "white" }
      }}
    />
      <MapView style={styles.map}
      initialRegion={{
        latitude:43.7131722,
        longitude:-79.2563805,
        latitudeDelta:0.0922,
        longitudeDelta:0.0421
      }}
      provider="google"
      >
        
        <Marker coordinate={pin}
        pinColor="black"
        draggable={true}
        onDragStart={(e)=>{
          console.log("Drag start",e.nativeEvent.coordinate)
        }}
        onDragEnd={(e)=>{
          setPin({
            latitude:e.nativeEvent.coordinate.latitude,
            longitude:e.nativeEvent.coordinate.longitude
          })
        }}
        
        >
          <Callout>
            <Text>I'm here</Text>
          </Callout>
        </Marker>
        <Circle center={pin} radius={1000}/>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
