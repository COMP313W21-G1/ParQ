
  import React, { useState, useEffect } from 'react';
  //import DropDownPicker from 'react-native-dropdown-picker';
  import SelectDropdown from 'react-native-select-dropdown'


  import {
    View,
    Text,
    TouchableHighlight,
    StyleSheet,
    TextInput,
    Alert,
    Button, Platform, 
  } from 'react-native';

  
  import DateTimePicker from '@react-native-community/datetimepicker';
  import {  modifyReservation, convertDateTime, getTimeStamp, getParkingSpots } from '../firebase';
  import { useIsFocused } from '@react-navigation/native';
  
  
  export default function AddItem(props) {
    //const DateTimePicker = require('@react-native-community/datetimepicker');
    const { reservationItem } = props.route.params;
    const [res, setRes] = useState(reservationItem);
    const [start, setStart] = useState(convertDateTime(reservationItem.start));
    const [end, setEnd] = useState(convertDateTime(reservationItem.end));
    const [spotsList, setSpotsList] = useState([]);
    const [spotsSelected, setSpotSelected] = useState(reservationItem.parkingSpotId);
    const [updateStatus, setupdateStatus] = useState('Updated!');
    const isFocused = useIsFocused();
  

  
    function handleChangeStart(startTxt) {
      setStart(startTxt);
    }
  
    function handleChangeEnd(endTxt) {
      setEnd(endTxt);
    }
  
    async function handleSubmit() {
      console.log('submit button pressed...');
       setRes({ 
          id: reservationItem.id,
          end: getTimeStamp(end),
          owner_uid: reservationItem.owner_uid, 
          parkingLotId: reservationItem.parkingLotId, 
          parkingSpotId: spotsSelected, 
          start: getTimeStamp(start),
      }); 
      try{
          await modifyReservation(res, setupdateStatus);
          
          //Alert.alert( await updateStatus);
          //props.navigation.navigate('ReservationScreen');
      }
      catch (e){
        Alert.alert('Something went wrong');
      }
      
    } 
    

    const [startDate, setStartDate] = useState(new Date(start));
    const [modeStart, setModeStart] = useState('date');
    const [showStart, setShowStart] = useState(false);

    const onChangeStart = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setShowStart(Platform.OS === 'ios');
        setStartDate(currentDate);
        handleChangeStart(currentDate)
      };
    
      const showModeStart = (currentMode) => {
        setShowStart(true);
        setModeStart(currentMode);
      };
    
      const showDatepickerStart = () => {
        showModeStart('date');
      };
    
      const showTimepickerStart = () => {
        showModeStart('time');
      };
      
    const [endDate, setEndDate] = useState(new Date(end));
    const [modeEnd, setModeEnd] = useState('date');
    const [showEnd, setShowEnd] = useState(false);
  
    const onChangeEnd = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setShowEnd(Platform.OS === 'ios');
        setEndDate(currentDate);
        handleChangeEnd(currentDate)
      };
    
      const showModeEnd = (currentMode) => {
        setShowEnd(true);
        setModeEnd(currentMode);
      };
    
      const showDatepickerEnd = () => {
        showModeEnd('date');
      };
    
      const showTimepickerEnd = () => {
        showModeEnd('time');
      };

      /***/
      function fetchSpotsListData ()  {
        //fetch some data and set state here
        try {      
            setSpotSelected(reservationItem.parkingSpotId)  ;
            getParkingSpots(reservationItem, setSpotsList);
            console.log(spotsList); 
        } catch (error) {
          console.log(error.message);
        } 
      }
    
      useEffect(() => {
        isFocused &&  fetchSpotsListData()      
      }, [isFocused]);  

       

    return (      
      <View style={styles.main}>
        <Text style={styles.title}>Modify Reservation</Text>
        <View> 
             <Text>Reservation Id</Text>          
              <TextInput
              autoFocus={true}
              style={styles.itemInput}  
              editable = {false}
              value={reservationItem.id}
              />
      </View>

      <View> 
             <Text>Current Parking Spot</Text>          

             <TextInput
                autoFocus={true}
                style={styles.itemInput}  
                editable = {false}
                value={reservationItem.parkingSpotId} 
                />
                <SelectDropdown 
                    //style={styles.viewStyle}
                    style={styles.dropdown}
                    containerStyle={styles.shadow}
                    data={spotsList}
                    defaultButtonText={'Select a different spot'}
                    defaultValue={spotsSelected}
                    onSelect={(selectedItem, index) => { 
                        console.log(selectedItem, index)
                        setSpotSelected(selectedItem);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item
                    }}
                />
               
                 {/*         
                 <View style={{minHeight: 75}}>
                    <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                    /> 
                </View>



                <TextInput
                autoFocus={true}
                style={styles.itemInput}  
                editable = {false}
                value={reservationItem.parkingSpotId} 
                />*/}

      </View>

         <View> 
             <Text>Start</Text> 
             {/**               
              <TextInput
              //placeholderTextColor="#444"
              //placeholder="start" 
              //autoCapitalize="none"
              autoFocus={true}
              style={styles.itemInput}
              onChangeText={handleChangeStart} 
              //onBlur={handleBlur}
              value={start}
              />*/}  
                <View>
                    <View>
                        <Button onPress={showDatepickerStart} title="Choose a start date!" />
                    </View>
                    <View>
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
      </View>
  
      <View> 
             <Text>End</Text> 
             {/**          
              <TextInput
              //placeholderTextColor="#444"
              //placeholder="start"
              //autoCapitalize="none"
              autoFocus={true}
              style={styles.itemInput}
              onChangeText={handleChangeEnd} 
              //onBlur={handleBlur}
              value={end}
              />*/}
                              <View>
                    <View>
                        <Button onPress={showDatepickerEnd} title="Choose an end date!" />
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
  
        
        <TouchableHighlight
          style={styles.button} 
          underlayColor="white"
          onPress={handleSubmit}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableHighlight>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    main: {
      flex: 1,
      padding: 30,
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: '#6565fc',
    },
    title: {
      marginBottom: 20,
      fontSize: 25,
      textAlign: 'center',
    },
    itemInput: {
      height: 50,
      padding: 4,
      marginRight: 5,
      fontSize: 23,
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 8,
      color: 'white',
    },
    buttonText: {
      fontSize: 18,
      color: '#111',
      alignSelf: 'center',
    },
    button: {
      height: 45,
      flexDirection: 'row',
      backgroundColor: 'white',
      borderColor: 'white',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 10,
      marginTop: 10,
      alignSelf: 'stretch',
      justifyContent: 'center',
    },
    dropdown: {
        backgroundColor: 'white',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        marginTop: 20,
        width: 95,
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },

  });
  