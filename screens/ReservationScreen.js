import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";
import { Icon } from "react-native-elements";

import tw from "tailwind-react-native-classnames";

import { convertDateTime, getBookedSpots, deleteBookedSpot } from "../firebase";
import React, { useEffect, useState } from "react";

const ListItem = ({ location, name, start, end, docId }) => (
  <View style={tw`bg-gray-200 flex-col m-4 mb-1 p-1`}>
    <View style={tw`flex-row justify-between  p-1`}>
      <Text style={tw`font-semibold text-xl pl-10 pt-1 `}>{name}</Text>
      <TouchableOpacity
        style={tw`rounded-full p-1`}
        onPress={() => {
          deleteBookedSpot(docId);
        }}
      >
        <Icon name="cancel" type="MaterialIcons" color="red" size={32} />
      </TouchableOpacity>
    </View>
    <Text style={tw`text-gray-500 pl-10 mb-2`}>{location}</Text>
    <View style={tw`flex-row justify-between`}>
      <Text style={tw`text-gray-500 p-2 pb-0 text-base text-green-800`}>
        Start Time:
      </Text>
      <Text style={tw`text-gray-500 p-2 pb-0 text-base text-green-800`}>
        {convertDateTime(start)}
      </Text>
    </View>
    <View style={tw`flex-row justify-between`}>
      <Text style={tw`text-gray-500 p-2 pt-1 text-base text-red-800`}>
        End Time:
      </Text>
      <Text style={tw`text-gray-500 p-2 pt-1 text-base text-red-800`}>
        {convertDateTime(end)}
      </Text>
    </View>
  </View>
);

const ReservationScreen = () => {
  const [spotsList, setSpotsList] = useState([]);

  useEffect(() => {
    try {
      const unsubscribe = getBookedSpots(setSpotsList);

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  return spotsList ? (
    //if spots are available, add them to the view
    <SafeAreaView style={styles.container}>
      <Text style={tw`text-3xl text-center p-3 m-5 pb-5 font-semibold`}>
        RESERVATIONS
      </Text>
      <FlatList
        data={spotsList}
        keyExtractor={(item) => item.name}
        ItemSeparatorComponent={() => (
          <View style={{ height: 0.5, backgroundColor: "#ADD8E6" }} />
        )}
        renderItem={({ item: { location, name, start, end, docId } }) => (
          <ListItem
            name={name}
            location={location}
            start={start}
            end={end}
            docId={docId}
          />
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
//}

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
