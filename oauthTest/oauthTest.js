let id = "KtOleLnFjmFBVA";
let secret = "uE__pJB__naprJxfJPFqKHzSsfU";
let userPass64 = btoa(id+':'+secret);
fetch("https://www.reddit.com/api/v1/access_token", {
  method: "POST",
  body: `grant_type=client_credentials&` +
        `user=${id}&` +
        `password=${secret}`,
  headers: {
    "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
    "Content-Type": "application/x-www-form-urlencoded",
    "Access-Control-Allow-Origin": "https://www.reddit.com"
  }
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
    //crunch(pageData);
  })
  .catch(function(err) {
    console.log(err);
  });
