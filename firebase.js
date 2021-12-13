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

export async function getCurrentUser(){
  var user = await firebase.auth().currentUser.uid;
  //console.log(user);
  return user;
}


export async function getReservations( spotsRetreived ){

  var startTimestamp = firebase.firestore.Timestamp.fromDate(new Date('December 31, 2021 20:10:00'));
  var endTimestamp = firebase.firestore.Timestamp.fromDate(new Date('Janurary 1, 2022 17:13:00'));   
  //console.log(startTimestamp);

  var resItem = {
    "end": endTimestamp,
    "owner_uid": `${await firebase.auth().currentUser.uid}`,
    "parkingLotId": 'OdtpARL4PSmPTBmqXtIP',
    "parkingSpotId": '1',
    "start": startTimestamp,
  }
  
  addReservation(resItem);

  //console.log(firebase.auth().currentUser.uid);
  //console.log(firebase.auth().currentUser.email); 
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
       // console.log(doc.data().parkingLotId);

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
export async function checkSpotAvailability(reservationItem){

//checks if the spot is available by looking at all reservations date, time, spot and lot ids

  var spotAvailable = true;
    var snapshot = await 
      db.collection(`reservations`)
      .get();
    snapshot.forEach((doc) => {

     if(
        reservationItem.parkingLotId === doc.data().parkingLotId &&
        reservationItem.parkingSpotId === doc.data().parkingSpotId &&
        //ensure start and end times are not conflicting 
      ( new Date(convertDateTime(reservationItem.start)) >= new Date(convertDateTime(doc.data().start)) && 
        new Date(convertDateTime(reservationItem.start)) <= new Date(convertDateTime(doc.data().end)) ) ||

        (new Date(convertDateTime(reservationItem.end)) >= new Date(convertDateTime(doc.data().start)) &&
        new Date(convertDateTime(reservationItem.end)) <= new Date(convertDateTime(doc.data().end)))
        
        ){  
            
        spotAvailable = false;      
        console.log("Spot taken for that time ");
        return spotAvailable;
      }
  });
  return spotAvailable;
  }
*/

export async function addReservation(reservationItem){
  // Add a new document in collection "reservations"
  // Add a new document with a generated id.
    //console.log(reservationItem);

    
    //var spotAvailable = await checkSpotAvailability(reservationItem);
    if (new Date(convertDateTime(reservationItem.end)) > new Date(convertDateTime(reservationItem.start)) )
    {
      //var spotAvailable = checkSpotAvailability(reservationItem);

      var spotAvailable = true;
      var snapshot = await 
        db.collection(`reservations`)
        .get();
      snapshot.forEach((doc) => {
  
       if(
          reservationItem.parkingLotId === doc.data().parkingLotId &&
          reservationItem.parkingSpotId === doc.data().parkingSpotId &&
          //ensure start and end times are not conflicting 
        ( new Date(convertDateTime(reservationItem.start)) >= new Date(convertDateTime(doc.data().start)) && 
          new Date(convertDateTime(reservationItem.start)) <= new Date(convertDateTime(doc.data().end)) ) ||
  
          (new Date(convertDateTime(reservationItem.end)) >= new Date(convertDateTime(doc.data().start)) &&
          new Date(convertDateTime(reservationItem.end)) <= new Date(convertDateTime(doc.data().end)))
          
          ){  
              
          spotAvailable = false;      
          console.log("Spot taken for that time ");
        }
    });
      console.log(spotAvailable);
      if (spotAvailable){
         
        console.log("Spot available for that time ");
        /**  */
          db.collection("reservations").add({  
          end: reservationItem.end,
          owner_uid: firebase.auth().currentUser.uid, 
          parkingLotId: reservationItem.parkingLotId, 
          parkingSpotId: reservationItem.parkingSpotId, 
          start: reservationItem.start,
        })
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
      }
    } else{
      console.log("start time is greater than ending time")
    }

}

export async function getParkingSpots(reservationItem, setSpotsList){
  var allSpots = [];
  var docRef =  await db.collection("parkingLots")
  .doc(`${reservationItem.parkingLotId}`)
  .collection('parkingSpots').get();
  docRef.forEach((spot) => {
    if (spot.exists) { 
      //console.log('parking spots: ');
      
      allSpots.push({
        id: spot.id,
        notes: spot.data().notes,
        type: spot.data().type,
        //label: spot.id,
        //value: `${reservationItem.parkingLotId} - ${spot.id}`,
      });
      console.log(spot.data()); 
      setSpotsList(allSpots);
    }
  });
}   

export async function modifyReservation(reservationItem){
  // Set a new document in collection "reservations"
  if (new Date(convertDateTime(reservationItem.end)) > new Date(convertDateTime(reservationItem.start)) )  {
    

    var spotAvailable = true;
    var snapshot = await 
      db.collection(`reservations`)
      .where("id", "!=", `${reservationItem.id}`)
      .get();
    snapshot.forEach((doc) => {
      console.log(reservationItem.id == doc.data().id);
        if(
          reservationItem.parkingLotId === doc.data().parkingLotId &&
          reservationItem.parkingSpotId === doc.data().parkingSpotId &&
          //ensure start and end times are not conflicting 
        ( new Date(convertDateTime(reservationItem.start)) >= new Date(convertDateTime(doc.data().start)) && 
          new Date(convertDateTime(reservationItem.start)) <= new Date(convertDateTime(doc.data().end)) ) ||

          (new Date(convertDateTime(reservationItem.end)) >= new Date(convertDateTime(doc.data().start)) &&
          new Date(convertDateTime(reservationItem.end)) <= new Date(convertDateTime(doc.data().end)))
          
          ){  
          
              spotAvailable = false;      
              console.log("Spot taken for that time -- no modifications ");
          }

        
    });

    if(spotAvailable){
      db.collection("reservations").doc(reservationItem.id).set({
      //id: reservationItem.id,
      end: reservationItem.end,
      owner_uid: firebase.auth().currentUser.uid,
      parkingLotId: reservationItem.parkingLotId, 
      parkingSpotId: reservationItem.parkingSpotId, 
      start: reservationItem.start,
    })
    .then(() => {
      console.log("Document successfully modified!"); 
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });}
    }
  } 

export function deleteReservation(reservationId){
  db.collection("reservations").doc(reservationId).delete().then(() => {
    console.log("Document successfully deleted!");
  }).catch((error) => {
      console.error("Error removing document: ", error);
  });
}

export function convertDateTime(time) {
  if (typeof time !== "undefined") {
    const fireBaseTime = new Date(
    time.seconds * 1000 + time.nanoseconds / 1000000,
    );
    const date = fireBaseTime.toDateString();
    const atTime = fireBaseTime.toLocaleTimeString();

   // console.log(date, atTime);
    return `${date} ${atTime}`
  }
}

export function getTimeStamp( time ){

  var timestamp = firebase.firestore.Timestamp.fromDate(new Date(time));
  return timestamp;   
}



