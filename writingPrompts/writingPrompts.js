fetch("https://www.reddit.com/r/WritingPrompts/new.json")
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

function makeElement(type, id, ...classes) {
  /*
  //Returns an HTML element                             //
  //----------------------------------------------------//
  //type(string): type of HTML element to create        //
  //id(string): id of the element                       //
  //classes(string): classes to add to the element      //
  //----------------------------------------------------//
  //return(element): HTML element                       //
  */

  let element = document.createElement(type);
  if (typeof id === "string") {element.id = id}
  classes.forEach(x => element.classList.add(x));
  return element;
}

function crunch(pageData) {
  //----------------------------------------------------//
  //Cleans the JSON data from Reddit to be displayed    //
  //  on the page                                       //
  //object-> pageData: JSON from Reddit                 //
  //----------------------------------------------------//

  let rawPrompts = [];
  pageData.data.children.forEach(function(post) {
    //--------------------------------------------------//
    //Extracts only the posts with "[WP]" in the title  //
    //--------------------------------------------------//

    if (/\[WP\]/.test(post.data.title)) {
      post.data.title = post.data.title.replace("[WP]", "");
      rawPrompts.push(post);
    }
  });

  rawPrompts.sort((a, b) => {
    return a.data.ups - b.data.ups;
  });

  rawPrompts.reverse();

  display(rawPrompts);
}

function display(prompts) {

  let pageTitle = makeElement("div", "pageTitle");
    pageTitle.innerHTML = "r/WritingPrompts";
  document.body.appendChild(pageTitle);

  prompts.forEach((prompt, index) => {

    let title = makeElement("div", `title${index}`, "titles");
      let span = makeElement("span");
        span.innerHTML = prompt.data.ups;
      title.appendChild(span);
      let link = makeElement("a");

        link.href = `https://www.reddit.com/${prompt.data.permalink}`;
        link.target = "_blank";
        link.innerHTML = prompt.data.title;

      title.appendChild(link);
    document.body.appendChild(title);
  });
}
