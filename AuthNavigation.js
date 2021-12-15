import { useGestureHandlerRef } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { SignedInStack, SignedOutStack } from './navigation'
import { firebase, isVendor } from './firebase'
import { useDispatch } from 'react-redux'
import { setVendor } from './slices/vendorSlice'

const AuthNavigation = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const dispatch = useDispatch();

  const userHandler = user => 
    user ? setCurrentUser(user) : setCurrentUser(null);

  useEffect(
    () => 
    firebase.auth().onAuthStateChanged(user => userHandler(user)),
  []
  )

  useEffect(() => {
    if (currentUser) {
      isVendor(currentUser?.email)
        .then(result => dispatch(setVendor(result)))
        .catch(error => console.log(error))
    }
  }, [currentUser])

  return <>{currentUser ? <SignedInStack /> : <SignedOutStack />}</>
}

export default AuthNavigation
