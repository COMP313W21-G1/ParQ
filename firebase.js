// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// expo doesn't support firebase v9 yet
// we instead use firebase@8.2.3
import firebase from 'firebase';

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

export { firebase, db }



export async function getReservations( spotsRetreived ){

  //console.log(firebase.auth().currentUser.uid);
  var reservationsList ;
  var snapshot = await 
    db.collection(`reservations`)
    .where("owner_uid", "==", `${await firebase.auth().currentUser.uid}`)
    .get()
    reservationsList = [];
  snapshot.forEach((doc) => {

    var docRef =  db.collection("parkingLots").doc(`${doc.data().parkingLotId}`);
    var LotInfo;

    docRef.get().then((lot) => {
      if (lot.exists) {

    var SpotInfo;
    var spotRef =  db.collection("parkingLots").doc(`${doc.data().parkingLotId}`)
    .collection(`parkingSpots`).doc(`${doc.data().parkingSpotId}`);
    spotRef.get()
    .then((spot) => {
      if (spot.exists) {
         
              SpotInfo = ({
                id: spot.id,
                notes: spot.data().notes,
                type: spot.data().type,
              }); 

              LotInfo = ({
                id: lot.id,
                city: lot.data().city,
                company: lot.data().company,
                feePerHour: lot.data().feePerHour, 
                occupied: lot.data().occupied, 
                parkingAddress: lot.data().parkingAddress,
                postalCode: lot.data().postalCode,
                province: lot.data().province,
                totalParkingSpots: lot.data().totalParkingSpots, 
                parkingSpots: ({ 
                  id: SpotInfo.id,
                  notes: SpotInfo.notes,
                  type: SpotInfo.type,
                }) 
              });
          
              //console.log(LotInfo);
              reservationsList.push({
                id: doc.id,
                end: doc.data().end,
                owner_uid: doc.data().owner_uid,
                parkingLotId: doc.data().parkingLotId, 
                parkingSpotId: doc.data().parkingSpotId, 
                start: doc.data().start,
                spotInfo: LotInfo,
              });  

           //console.log(reservationsList[0]);
           spotsRetreived(reservationsList);

          }});

        }});

  });  
  
}



/** 
export async function getParkingSpot(spotRetreived) {

  var spotsList ;
  var snapshot = await 
    db.collection(`parkingLots`)
    .doc(`${await firebase.auth().parkingLotId}`)
    .collection(`parkingSpots`)
    //.where("owner_uid", "==", `${await firebase.auth().currentUser.uid}`)
    .get()
    //spotsList = [];
  snapshot.forEach((doc) => {
    const spotItem = doc.data();
    spotItem.id = doc.id;
 
    console.log('Get reservations');
    console.log(firebase.auth().currentUser.uid); 
    console.log(firebase.auth().currentUser.email);    
    console.log(spotItem);


    spotsList = ({
      type: doc.data().type,
      parkingLotId: doc.data().parkingLotId, 
      notes: doc.data().notes,
    });
  });
  
  spotRetreived(spotsList);
}*/


export function convertDateTime(time) {
  if (typeof time !== "undefined") {
    const fireBaseTime = new Date(
    time.seconds * 1000 + time.nanoseconds / 1000000,
    );
    const date = fireBaseTime.toDateString();
    const atTime = fireBaseTime.toLocaleTimeString();

   // console.log(date, atTime);
    return `${date}, ${atTime}`
  }
}



