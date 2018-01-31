var config = {
    apiKey: "AIzaSyC0p7l50eAObpZXoWWAsB1FoqlczmFzMaI",
    authDomain: "train-time-d7a00.firebaseapp.com",
    databaseURL: "https://train-time-d7a00.firebaseio.com",
    projectId: "train-time-d7a00",
    storageBucket: "train-time-d7a00.appspot.com",
    messagingSenderId: "888995665344"
};

firebase.initializeApp(config);

var firebaseData = firebase.database();


$('#add-train').on("click", function(){

    var name = $("#nameInput").val().trim();

    var destination = $("#destination").val().trim();

    var firstTrain = $("#first-train").val().trim();

    var frequency = $("#frequency").val().trim();

    var newTrain = {

        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
    };

    firebaseData.ref().push(newTrain);

    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);

    alert("Train added");

    $("#nameInput").val("");
    $("#destination").val("");
    $("#first-train").val("");
    $("#frequency").val("");


    return false;

});

firebaseData.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFrequency = childSnapshot.val().frequency;
    var tFirstTrain = childSnapshot.val().firstTrain;

    var timeArr = tFirstTrain.split(":");
    var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
    var maxMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrival;

    //If the first train is later than the current time, sent arrival to the first train time
    if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
    } else {

        // Calculate the minutes until arrival using hardcore math
        // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
        // and find the modulus between the difference and the frequency.
        var differenceTimes = moment().diff(trainTime, "minutes");
        var tRemainder = differenceTimes % tFrequency;
        tMinutes = tFrequency - tRemainder;
        // To calculate the arrival time, add the tMinutes to the currrent time
        tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    }
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);

    // Add each train's data into the table
    $("#time-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" +
        tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
});