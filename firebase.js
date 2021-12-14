// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// expo doesn't support firebase v9 yet
// we instead use firebase@8.2.3
import firebase from "firebase";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcyN96SIznchdstM6WPHanTz4LcTSPBes",
  authDomain: "rn-parq-comp313.firebaseapp.com",
  projectId: "rn-parq-comp313",
  storageBucket: "rn-parq-comp313.appspot.com",
  messagingSenderId: "82167954376",
  appId: "1:82167954376:web:9bcc96bcd629d4a5bcdefd",
};

// Initialize Firebase
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const db = firebase.firestore();

export { firebase, db };

export async function getBookedSpots(spotsRetreived) {
  var spotsList;
  return db
    .collection(`bookedSpots`)
    .where("owner_uid", "==", `${await firebase.auth().currentUser.uid}`)
    .onSnapshot((snapshot) => {
      spotsList = [];
      snapshot.forEach((doc) => {
        const spotItem = doc.data();
        spotItem.id = doc.id;
        //console.log(spotItem);
        spotsList.push({
          end: doc.data().end,
          location: doc.data().location,
          name: doc.data().name,
          owner_uid: doc.data().owner_uid,
          parkingLotId: doc.data().parkingLotId,
          parkingSpotId: doc.data().parkingLotId,
          start: doc.data().start,
          docId: doc.id,
        });
      });
      spotsRetreived(spotsList);
    });
  // return snapshot;
}

// export async function getBookedSpots(spotsRetreived) {
//   var spotsList;
//   var snapshot = await db
//     .collection(`bookedSpots`)
//     .where("owner_uid", "==", `${await firebase.auth().currentUser.uid}`)
//     .get();
//   spotsList = [];
//   snapshot.forEach((doc) => {
//     const spotItem = doc.data();
//     spotItem.id = doc.id;
//     //console.log(spotItem);
//     spotsList.push({
//       end: doc.data().end,
//       location: doc.data().location,
//       name: doc.data().name,
//       owner_uid: doc.data().owner_uid,
//       parkingLotId: doc.data().parkingLotId,
//       parkingSpotId: doc.data().parkingLotId,
//       start: doc.data().start,
//       docId: doc.id,
//     });
//   });

//   spotsRetreived(spotsList);
// }

export async function deleteBookedSpot(docId) {
  db.collection("bookedSpots")
    .doc(docId)
    .delete()
    .then((result) => {
      //console.log(result);
    });
}

export async function getVendors(vendorsRetrieved) {
  var vendorList;
  return (
    db
      .collection(`parkingLots`)
      //.doc("jb@mail.com")
      //.doc('KjVYAx27WOPN1Ke6ygCs')
      .onSnapshot((snapshot) => {
        vendorList = [];
        snapshot.forEach((doc) => {
          //const favItem = doc.data();
          //console.log(doc.data());
          vendorList.push({
            address: doc.data().parkingAddress,
            latitude: doc.data().location.latitude,
            longitude: doc.data().location.longitude,
            name: doc.data().company,
            feePerHour: doc.data().feePerHour,
            docId: doc.id,
            totalParkingSpots: doc.data().totalParkingSpots,
          });
        });
        vendorsRetrieved(vendorList);
        //console.log(vendorList);
      })
  );
}

export function convertDateTime(time) {
  if (typeof time !== "undefined") {
    const fireBaseTime = new Date(
      time.seconds * 1000 + time.nanoseconds / 1000000
    );
    const date = fireBaseTime.toDateString();
    const atTime = fireBaseTime.toLocaleTimeString();

    // console.log(date, atTime);
    return `${date}, ${atTime}`;
  }
}

export async function getUser(userRetrieved) {
  var user;
  return db
    .collection(`users`)
    .where("email", "==", `${await firebase.auth().currentUser.email}`)
    .onSnapshot((snapshot) => {
      snapshot.forEach((doc) => {
        //console.log(doc.data());
        user = {
          address: doc.data().address,
          email: doc.data().email,
          firstname: doc.data().firstname,
          lastname: doc.data().lastname,
          feePerHour: doc.data().owner_uid,
          phone: doc.data().phone,
          type: doc.data().type,
          city: doc.data().city,
          province: doc.data().province,
          postalcode: doc.data().postalcode,
          profile_picture: doc.data().profile_picture,
          owner_uid: doc.data().owner_uid,
        };
      });
      userRetrieved(user);
      // console.log("Firebase => ",user);
    });
}
