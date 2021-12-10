import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import {
  selectFavorite,
  //selectDestination,
  selectOrigin,
  setOrigin,
  //setTravelTimeInformation,
} from "../slices/navSlice";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { useNavigation } from "@react-navigation/core";
import { firebase, db, getVendors } from "../firebase";

const Map = () => {
  const origin = useSelector(selectOrigin);
  const fave = useSelector(selectFavorite);
  //const destination = useSelector(selectDestination);
  const [apiResults, setApiResults] = useState([]);
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    //   //if (!origin || !destination) return;
    const getApiResults = async () => {
      fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=parking&location=${origin.location.lat}%2C${origin.location.lng}&radius=1500&key=${GOOGLE_MAPS_APIKEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          let markers = [];
          data.results.forEach((element) => {
            let result = {
              latitude: element.geometry.location.lat,
              longitude: element.geometry.location.lng,
              name: element.name,
              address: element.vicinity,
            };
            markers.push(result);
            //console.log(element.geometry.location.lat);
          });
          setApiResults(markers);
          //console.log(markers);
          //dispatch(setTravelTimeInformation(data.rows[0].elements[0]));
        });
    };
    getApiResults();
    //Zoom & fit to markers
    mapRef.current.fitToSuppliedMarkers(["origin"], {
      edgePadding: { top: 5, right: 5, bottom: 5, left: 5 },
      animated: true,
    });
  }, [origin, GOOGLE_MAPS_APIKEY]);

  useEffect(() => {
    try {
      getVendors(setVendors);
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  return (
    <MapView
      ref={mapRef}
      style={tw`flex-1`}
      mapType="standard"
      zoom="zoom"
      center="center"
      initialRegion={{
        latitude: origin.location.lat,
        longitude: origin.location.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      {/* <MapView.Circle
        center={{
          latitude: origin.location.lat,
          longitude: origin.location.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        radius={300}
        strokeWidth={1}
        strokeColor={"#1a66ff"}
        fillColor={"rgba(230,238,255,0.5)"}
      /> */}

      {origin?.location && (
        <Marker
          coordinate={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
          }}
          title="Origin"
          description={origin.description}
          identifier="origin"
          onCalloutPress={() => {
            return;
          }}
        />
      )}
      {apiResults.map((result, index) => {
        //console.log(result);
        return (
          <Marker
            key={index}
            coordinate={{
              latitude: result.latitude,
              longitude: result.longitude,
            }}
            title={result.name}
            description={result.address}
            onPress={() => {
              navigation.navigate("ParkingDetailsCard", {
                name: result.name,
                address: result.address,
                latitude: result.latitude,
                longitude: result.longitude,
              });
            }}
          >
            <Icon name="car" type="font-awesome" color="green" size={25} />
          </Marker>
        );
      })}
      {vendors.map((result, index) => {
        //console.log(result);
        return (
          <Marker
            key={index}
            image={require("../assets/logo.png")}
            style={{ maxWidth: 5 }}
            coordinate={{
              latitude: result.latitude,
              longitude: result.longitude,
            }}
            title={result.name}
            description={`${result.address}\nRate: ${result.feePerHour}\n# Spots: ${result.totalParkingSpots}`}
            onPress={() => {
              navigation.navigate("ParkingDetailsCard", {
                name: result.name,
                address: result.address,
                latitude: result.latitude,
                longitude: result.longitude,
              });
            }}
          ></Marker>
        );
      })}

      {/* {origin && destination && (
        <MapViewDirections
          lineDashPattern={[0]}
          origin={origin.description}
          destination={destination.description}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="black"
        />
      )} 
       {destination?.location && (
        <Marker
          coordinate={{
            latitude: destination.location.lat,
            longitude: destination.location.lng,
          }}
          title="Destination"
          description={destination.description}
          identifier="destination"
        />
      )} */}
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({
  vendorMarkers: { border: "1px solid black" },
});
