$("#search").on("click", function() {
    var city = $("city").val();
    mainWeather(city);
});

function mainWeather(search) {
    var url = "http://api.openweathermap.org/data/2.5/weather?q=" + search + "&appid=d6746b3e28e79b150c827fa250bf066e&units=imperial";
    console.log("You got clicked", search);
    $.ajax({
        method: "GET",
        url: url
    }).then(function(response) {
        console.log(response);
        console.log(response.main.temp, response.main.humidity, response.wind.speed);
        var temp = $("<h1>").text("Temperature: " + response.main.temp);
    var humidity = $("<h1>").text("Humidity: " + response.main.humidity);
    var windspeed = $("<h1>").text("Windspeed: " + response.wind.speed);
    var cityh1 = $("<h1>").text(search);
    $("#info-city").prepend(cityh1, temp, humidity, windspeed);
    fiveday(search);
  });
}

function fiveday(search) {
    var url = "http://api.openweathermap.org/data/2.5/forecast?q=" + search + "&appid=d6746b3e28e79b150c827fa250bf066e&units=imperial";
    console.log("You got clicked", search);
    $.ajax({
      method: "GET",
      url: url
    }).then(function(response) {
      console.log(response);
      var fiveDayArray = [];
      for (var i = 0; i < response.list.length; i++) {
        if (response.list[i].dt_txt.split(" ")[1] === "00:00:00"){
            console.log('WE FOUND A MATCH!!!', response.list[i])
          fiveDayArray.push(response.list[i])
        }
      }

        console.log(fiveDayArray);

    });
}
