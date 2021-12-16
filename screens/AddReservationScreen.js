import React, { useState, useEffect } from "react";
//import DropDownPicker from 'react-native-dropdown-picker';
import SelectDropdown from "react-native-select-dropdown";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";

import {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Button,
  Platform,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import {
  firebase,
  addReservation,
  convertDateTime,
  getTimeStamp,
  getParkingSpots,
} from "../firebase";
import { useIsFocused, useNavigation } from "@react-navigation/native";

export default function AddItem(props) {
  //const { vendorParkingLotId } = props.route.params;

  //add 30 minutes to date
  var minutesToAdd = 30;
  const currentDate = new Date();
  var startTimestamp = getTimeStamp(currentDate);
  var endTimestamp = getTimeStamp(
    new Date(currentDate.getTime() + minutesToAdd * 60000)
  );
  const reservationItem = {
    end: endTimestamp,
    owner_uid: `${firebase.auth().currentUser.uid}`,
    parkingLotId: props.route.params,
    parkingSpotId: "",
    start: startTimestamp,
  };
  const [res, setRes] = useState(reservationItem);
  const [start, setStart] = useState(convertDateTime(reservationItem.start));
  const [end, setEnd] = useState(convertDateTime(reservationItem.end));
  const [spotsList, setSpotsList] = useState([]);
  const [spotsSelected, setSpotSelected] = useState("");
  const isFocused = useIsFocused(true);
  const navigation = useNavigation();

  function handleChangeStart(startTxt) {
    setStart(startTxt);
  }

  function handleChangeEnd(endTxt) {
    setEnd(endTxt);
  }

  async function handleSubmit() {
    console.log("submit button pressed...");
    console.log(spotsSelected == "" ? spotsList[0] : spotsSelected);
    await setRes({
      // id: reservationItem.id,
      end: getTimeStamp(end),
      owner_uid: reservationItem.owner_uid,
      parkingLotId: reservationItem.parkingLotId,
      parkingSpotId: spotsSelected == "" ? spotsList[0] : spotsSelected,
      start: getTimeStamp(start),
    });
    try {
      await addReservation(res);

      //Alert.alert( await updateStatus);
      //props.navigation.navigate('ReservationScreen');
    } catch (e) {
      Alert.alert("Something went wrong");
    }
  }

  const [startDate, setStartDate] = useState(new Date(start));
  const [modeStart, setModeStart] = useState("date");
  const [showStart, setShowStart] = useState(false);

  const onChangeStart = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStart(Platform.OS === "ios");
    setStartDate(currentDate);
    handleChangeStart(currentDate);
  };

  const showModeStart = (currentMode) => {
    setShowStart(true);
    setModeStart(currentMode);
  };

  const showDatepickerStart = () => {
    showModeStart("date");
  };

  const showTimepickerStart = () => {
    showModeStart("time");
  };

  const [endDate, setEndDate] = useState(new Date(end));
  const [modeEnd, setModeEnd] = useState("date");
  const [showEnd, setShowEnd] = useState(false);

  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEnd(Platform.OS === "ios");
    setEndDate(currentDate);
    handleChangeEnd(currentDate);
  };

  const showModeEnd = (currentMode) => {
    setShowEnd(true);
    setModeEnd(currentMode);
  };

  const showDatepickerEnd = () => {
    showModeEnd("date");
  };

  const showTimepickerEnd = () => {
    showModeEnd("time");
  };

  /***/
  function fetchSpotsListData() {
    //fetch some data and set state here
    try {
      setSpotSelected(reservationItem.parkingSpotId);
      getParkingSpots(reservationItem, setSpotsList);
      //console.log(spotsList);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    isFocused && fetchSpotsListData();
  }, [isFocused]);

  return (
    <SafeAreaView style={[styles.main, tw`h-full justify-center`]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={tw`absolute bg-white top-10 left-3 z-50 p-2 rounded-full`}
      >
        <Icon name="chevron-left" type="fontawesome" size={30} />
      </TouchableOpacity>
      <Text style={[styles.title, tw`p-0 mt-0 text-3xl font-bold`]}>
        Create Reservation
      </Text>

      <SelectDropdown
        buttonStyle={tw`w-full rounded-lg`}
        rowStyle={[styles.shadow, tw`text-center border-blue-900 border-2`]}
        data={spotsList}
        defaultButtonText={"Select a Parkin spot"}
        defaultValue={spotsSelected}
        onSelect={(selectedItem, index) => {
          console.log(selectedItem, index);
          setSpotSelected(selectedItem);
        }}
        buttonTextAfterSelection={(selectedItem, index) => {
          // text represented after item is selected
          // if data array is an array of objects then return selectedItem.property to render after item is selected
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          // text represented for each item in dropdown
          // if data array is an array of objects then return item.property to represent item in dropdown
          return item;
        }}
      />

      <View style={[styles.tdivide, tw`flex-col w-full mt-5 py-5 bg-blue-400`]}>
        <Text style={tw`text-center text-xl font-bold`}>Start</Text>
        <View style={tw`flex-row justify-around mb-2`}>
          <Button onPress={showDatepickerStart} title="Choose a start date!" />
          <Button onPress={showTimepickerStart} title="Choose a start Time!" />
        </View>
        {showStart && (
          <DateTimePicker
            testID="dateTimePicker"
            value={startDate}
            mode={modeStart}
            is24Hour={true}
            display="default"
            onChange={onChangeStart}
          />
        )}
      </View>

      <View
        style={[
          [styles.bdivide, tw`flex-col w-full  mb-2 mt-1 py-4 bg-blue-400`],
        ]}
      >
        <Text style={tw`text-center text-xl font-bold`}>End</Text>
        <View style={tw`flex-row justify-around mb-2`}>
          <View>
            <Button
              style={tw`bg-blue-700`}
              onPress={showDatepickerEnd}
              title="Choose an end date!"
            />
          </View>
          <View>
            <Button onPress={showTimepickerEnd} title="Choose and end time!" />
          </View>
          {showEnd && (
            <DateTimePicker
              testID="dateTimePicker"
              value={endDate}
              mode={modeEnd}
              is24Hour={true}
              display="default"
              onChange={onChangeEnd}
            />
          )}
        </View>
      </View>

      <View style={tw`mx-auto mt-8`}>
        <TouchableHighlight
          style={tw`w-1/3 p-4 items-center rounded-full bg-blue-700 border-blue-300 border-4 `}
          underlayColor="white"
          onPress={handleSubmit}
        >
          <Text style={tw`text-blue-300`}>Confirm</Text>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 30,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#6565fc",
  },
  title: {
    marginBottom: 20,
    fontSize: 25,
    textAlign: "center",
  },
  itemInput: {
    height: 50,
    padding: 4,
    marginRight: 5,
    fontSize: 23,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 8,
    color: "white",
  },
  buttonText: {
    fontSize: 18,
    color: "#111",
    alignSelf: "center",
  },
  button: {
    height: 45,
    flexDirection: "row",
    backgroundColor: "white",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: "stretch",
    justifyContent: "center",
  },
  dropdown: {
    backgroundColor: "white",
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    marginTop: 20,
    width: 95,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  bdivide: {
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },
  tdivide: {
    borderTopColor: "white",
    borderTopWidth: 1,
  },
});
