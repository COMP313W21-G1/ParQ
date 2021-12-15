import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import tw from "tailwind-react-native-classnames";
import { selectOrigin } from "../slices/navSlice";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { useNavigation } from "@react-navigation/core";
import { firebase, db, getVendors, getVendorsFiltered } from "../firebase";
import { selectSpot, setSpot } from "../slices/spotSlice";

const Map = () => {
  const origin = useSelector(selectOrigin);
  //const destination = useSelector(selectDestination);
  const [apiResults, setApiResults] = useState([]);
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const [vendors, setVendors] = useState([]);
  const spot = useSelector(selectSpot);

  useEffect(() => {
    //   //if (!origin || !destination) return;
    const getApiResults = async () => {
      fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=parking&location=${origin.location.lat}%2C${origin.location.lng}&radius=750&key=${GOOGLE_MAPS_APIKEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          let markers = [];
          data.results.forEach((element) => {
            //console.log(element);
            let rawDesc = [];
            element.types.forEach((value) => rawDesc.push(value));
            //console.log(rawDesc);
            let result = {
              location: element.geometry.location,
              name: element.name,
              address: element.vicinity,
              description: rawDesc,
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
      getVendorsFiltered(setVendors, origin);
    } catch (error) {
      console.log(error.message);
    }
  }, [origin, GOOGLE_MAPS_APIKEY]);

  useEffect(() => {
    mapRef.current.fitToSuppliedMarkers([spot?.name], {
      edgePadding: { top: 5, right: 5, bottom: 5, left: 5 },
      animated: true,
    });
  }, [spot])

  return (
    <MapView
      ref={mapRef}
      style={tw`flex-1`}
      mapType="standard"
      zoom="zoom"
      zoomControlEnabled={true}
      center="center"
      initialRegion={{
        latitude: origin.location.lat,
        longitude: origin.location.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <MapView.Circle
        center={{
          latitude: origin.location.lat,
          longitude: origin.location.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        radius={1200}
        strokeWidth={1}
        strokeColor={"#1a66ff"}
        fillColor={"rgba(230,238,255,0.5)"}
      />

      {origin?.location && (
        <Marker
          identifier="Origin"
          mapRef={mapRef}
          coordinate={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
          }}
          title="Origin"
          onPress={() => {
            let loc = {};
            loc = { lat: origin.location.lat, lng: origin.location.lng };
            dispatch(
              setSpot({
                name: origin.name,
                address: origin.address,
                location: loc,
                description: origin.description,
                vendor: false,
              })
            );
            navigation.navigate("ParkingDetailsCard", {
              name: origin.name,
              address: origin.address,
              location: loc,
              description: origin.description,
              vendor: false,
            });
          }}
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
            identifier={result.name}
            mapRef={mapRef}
            key={index}
            coordinate={{
              latitude: result.location.lat,
              longitude: result.location.lng,
            }}
            title={result.name}
            description={result.address}
            onPress={() => {
              let loc = {};
              loc = { lat: result.location.lat, lng: result.location.lng };
              dispatch(
                setSpot({
                  name: result.name,
                  address: result.address,
                  location: loc,
                  description: result.description,
                  vendor: false,
                })
              );
              navigation.navigate("ParkingDetailsCard", {
                name: result.name,
                address: result.address,
                location: loc,
                description: result.description,
                vendor: false,
              });
            }}
          >
            <Icon name="car" type="font-awesome" color="blue" size={25} />
          </Marker>
        );
      })}
      {vendors.map((result, index) => {
        //console.log(result.totalParkingSpots);
        return (
          <Marker
            identifier={result.name}
            mapRef={mapRef}
            key={index}
            image={require("../assets/logo-marker.png")}
            //style={{ maxWidth: 5 }}
            coordinate={{
              latitude: result.latitude,
              longitude: result.longitude,
            }}
            title={result.name}
            description={`Rate: $${result.feePerHour}/Hr, #_of_Spots: ${result.totalParkingSpots}`}
            onPress={() => {
              let loc = {};
              loc = { lat: result.latitude, lng: result.longitude };
              dispatch(
                setSpot({
                  name: result.name,
                  address: result.address,
                  location: loc,
                  description: `Rate= $${result.feePerHour}/Hr, # Spots= ${result.totalParkingSpots}`,
                  vendor: true,
                })
              );
              navigation.navigate("ParkingDetailsCard", {
                name: result.name,
                address: result.address,
                location: loc,
                description: `Rate= $${result.feePerHour}/Hr, # Spots= ${result.totalParkingSpots}`,
                vendor: true,
              });
            }}
          ></Marker>
        );
      })}
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({
  vendorMarkers: { border: "1px solid black" },
});
