//Initilize Firebase-Admin
var admin = require("firebase-admin");
var serviceAccount = require("./ditto-zone-1046a-firebase-adminsdk-ykflz-daa05be544.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ditto-zone-1046a.firebaseio.com"
});
//


//Firestore Connection
const db = admin.firestore();
//


//Express.js
const express = require('express');
const app = express();
const port = 3000;
app.listen(port);
//
//Printer Module
const printer = require('node-native-printer');
//

//Get all printers connected to PC
app.get('/get/printers',(req,res)=>{
   
    printer.listPrinters().then((e)=>{
      res.json(e);   
  });
});
//
//Print a package
app.get('/print/:package?',(req,res)=>{
var packageDetails;
var packageRef = db.collection('Packages').doc(req.params.package);
packageRef.get().then(doc=>{
  packageDetails = doc.data();
  console.log(packageDetails);
});
packageRef.collection('Files').get().then(snapshot => {
snapshot.forEach(doc=>{
let data = doc.data();
printer.print(data["location"],
{
  "collate": data["collate"] ,
  "color": data["color"],
  "copies": data["copies"],
  "duplex": data["duplex"],
  "landscape": data["landscape"],
  "paperSize": data["paperSize"],
  "fromPage": data["fromPage"],
  "toPage": data["toPage"]
},
 packageDetails.printer);
});
}).then(()=>res.send("Added all documents to queue!!!"));
});
//


