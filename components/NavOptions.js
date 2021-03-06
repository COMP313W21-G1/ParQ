import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { useSelector } from 'react-redux'
import tw from 'tailwind-react-native-classnames'
import { selectOrigin } from '../slices/navSlice'
import { selectVendor } from '../slices/vendorSlice'

const data = [
  {
    id: "123",
    title: "Find Parking",
    image: "https://links.papareact.com/3pn",
    screen: "MapScreen",
  },
  {
    id: "456",
    title: "Reservations",
    image: "https://links.papareact.com/28w",
    screen: "ReservationScreen", 
  },
  {
    id: "789",
    title: "Profile",
    image: "https://www.gardeningknowhow.com/wp-content/uploads/2021/07/sulfur-cosmos-mexican-aster-flowers.jpg",
    screen: "ProfileScreen", // change in future
  }
]

const dataVendor = [
  {
    id: "789",
    title: "Profile",
    image: "https://www.gardeningknowhow.com/wp-content/uploads/2021/07/sulfur-cosmos-mexican-aster-flowers.jpg",
    screen: "ProfileScreen", // change in future
  },
  {
    id: "012",
    title: "Add  vendor parking Lot",
    image: "https://www.gardeningknowhow.com/wp-content/uploads/2021/07/sulfur-cosmos-mexican-aster-flowers.jpg",
    screen: "AddLotScreen", // change in future
  },
  {
    id: "345",
    title: "View my parking spots",
    image: "https://www.gardeningknowhow.com/wp-content/uploads/2021/07/sulfur-cosmos-mexican-aster-flowers.jpg",
    screen: "parkingSpotsScreen", // change in future
  },
]

const NavOptions = () => {
  const navigation = useNavigation();
  const origin = useSelector(selectOrigin);
  const vendor = useSelector(selectVendor);

  return (
    <FlatList 
      data={!vendor ? data : dataVendor}
      horizontal
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate(item.screen)}
          style={tw`p-2 pl-6 pb-8 pt-4 bg-gray-200 m-2 w-40`}
          disabled={item.screen === "MapScreen" ? !origin : false}
        >
          <View style={tw`${(item.screen === "MapScreen" ? !origin : false) && "opacity-20"}`}>
            <Image 
              style={{ width: 120, height: 120, resizeMode: "contain" }}
              source={{uri: item.image}}
            />
            <Text style={tw`mt-2 text-lg font-semibold`}>{ item.title }</Text>
            <Icon 
              style={tw`p-2 bg-black rounded-full w-10 mt-4`}
              name="arrowright"
              color="white" 
              type="antdesign" 
            />
          </View>
        </TouchableOpacity>
      )}
    />
  )
}

export default NavOptions