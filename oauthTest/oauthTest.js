fetch("https://www.reddit.com/api/v1/authorize", {
  method: "POST",

})
  //----------------------------------------------------//
  //Fetches the JSON data from Reddit                   //
  //then sends the data to be cleaned                   //
  //----------------------------------------------------//

  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
    pageData = myJson;
    crunch(pageData);
  });
