import {
  StyleSheet,
  Button,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";

import tw from "tailwind-react-native-classnames";

import { Icon } from "react-native-elements";
import { convertDateTime, getReservations } from "../firebase";
import React, { useEffect, useState } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";

const ReservationItem = ({ reservationItem, nav }) => (
  <SafeAreaView
    style={tw`px-4 pt-3 flex-col justify-between w-full border-4 rounded-lg border-gray-400 my-1`}
  >
    <View style={tw`flex-row justify-evenly w-9/12 m-auto px-8 pb-3`}>
      <Text style={tw`text-blue-600 font-bold`}>
        Res ID: {reservationItem.id}
      </Text>
    </View>
    <View style={tw`flex-row pt-2 justify-between w-10/12 mx-auto`}>
      <Text style={tw`font-bold`}>Start Time:</Text>
      <Text>{`${convertDateTime(reservationItem.start)}`}</Text>
    </View>
    <View style={tw`flex-row pt-2 justify-between w-10/12 mx-auto`}>
      <Text style={tw`font-bold`}>End Time: </Text>
      <Text> {`${convertDateTime(reservationItem.end)}`}</Text>
    </View>
    <View style={tw`flex-row pt-2 justify-between w-10/12 mx-auto`}>
      <Text style={tw`font-bold`}>Address:</Text>
      <Text style={tw`text-gray-500`}>
        {reservationItem.spotInfo.parkingAddress}
      </Text>
    </View>
    <View style={tw`flex-row pt-2 pb-5 justify-between w-10/12 mx-auto`}>
      <Text style={tw`font-bold`}>Parking Spot:</Text>
      <Text style={tw`text-gray-500`}>
        {reservationItem.spotInfo.parkingSpots.id}
      </Text>
    </View>

    <SafeAreaView style={tw`w-1/4 m-auto py-1`}>
      <Button
        title="Details"
        onPress={() => {
          nav.navigate("ReservationDetailScreen", { reservationItem });
        }}
      />
    </SafeAreaView>
  </SafeAreaView>
);

const ReservationScreen = (props) => {
  const isFocused = useIsFocused();
  const [reservationsList, setReservationsList] = useState([]);
  const navigation = useNavigation();
  const [status, setStatus] = useState({});
  //const { update } = props.route.params;

  fetchReservationListData = async () => {
    //fetch some data and set state here
    try {
      getReservations(setReservationsList);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    isFocused && fetchReservationListData();

    unsubscribe();
    return () => {
      setStatus({});
    };
  }, [isFocused]);
  const unsubscribe = () => setStatus({ status: "Inactive" });

  return reservationsList.length > 0 ? (
    //if spots are available, add them to the view
    <SafeAreaView style={tw`mx-auto pt-10 m-2`}>
      <TouchableOpacity
        onPress={() => navigation.navigate("HomeScreen")}
        style={tw`bg-gray-100 absolute top-8 left-4 z-50 p-2 rounded-full shadow-lg`}
      >
        <Icon name="chevron-left" type="fontawesome" size={30} />
      </TouchableOpacity>
      <Text style={tw`font-bold text-3xl text-center py-5`}>
        Reservation History
      </Text>

      <FlatList
        //extraData={reservationsList}
        data={reservationsList}
        style={tw`  `}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => (
          <View style={[tw`bg-gray-200`, { height: 1 }]} />
        )}
        renderItem={({ item }) => (
          <>
            {
              //console.log(item.id)
            }
            <ReservationItem
              //extraData={props.update}
              key={item.id}
              id={item.id}
              reservationItem={item}
              nav={props.navigation}
            />
          </>
        )}
      />
    </SafeAreaView>
  ) : (
    //if no spots are  booked, display a message
    <View style={styles.textContainer}>
      <Text style={styles.emptyTitle}>No Reservations Found! </Text>
      <Text style={styles.emptySubtitle}>
        Add a new reservation from the map screen
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ADD8E6",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  listItem: {
    marginTop: 8,
    marginBottom: 8,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleStyle: {
    fontSize: 30,
  },
  subtitleStyle: {
    fontSize: 18,
  },
  emptyTitle: {
    fontSize: 32,
    marginBottom: 16,
  },
  emptySubtitle: {
    fontSize: 18,
    fontStyle: "italic",
  },
});

export default ReservationScreen;
