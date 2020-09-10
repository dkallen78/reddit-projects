fetch("https://www.reddit.com/r/Coins4Sale.json")
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
    pageData = myJson;
    crunch(pageData);
  });

function makeElement(type, id, ...classes) {
  //----------------------------------------------------//
  //Returns an element                                  //
  //string-> type: type of element to be returned       //
  //string-> id: id of the element                      //
  //string-> classes: classes to add to the element     //
  //----------------------------------------------------//

  let element = document.createElement(type);
  if (typeof id === "string") {element.id = id}
  classes.forEach(x => element.classList.add(classes));
  return element;
}

function makeSVG(type) {
  //----------------------------------------------------//
  //Returns an SVG element of the type indicated..      //
  //string-> type: type of SVG element to be created    //
  //string-> arguments[1]: assigned as the id of the    //
  //  new SVG element                                   //
  //----------------------------------------------------//

  let svg = document.createElementNS("http://www.w3.org/2000/svg", type);
  if (arguments.length > 1) {svg.id = arguments[1]};
  return svg;
}

function vw(v) {
  //----------------------------------------------------//
  //I found this online. It finds the pixel value of a  //
  //  CSS vw value.                                     //
  //integer-> v: the vw value to find                   //
  //----------------------------------------------------//

  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  return (v * w) / 100;
}

function fixArrows() {
  //----------------------------------------------------//
  //Resizes the navigation arrows whenever the users    //
  //  window is resized                                 //
  //----------------------------------------------------//

  let side = vw(10);

  let leftArrow = document.getElementById("leftArrow");
  let length = side - (side * .866);
  let points = `${side},0 ${side},${side} ${length},${side / 2} ${side},0`;
  leftArrow.children[0].setAttribute("points", points);

  let rightArrow = document.getElementById("rightArrow");
  length = side * .866;
  points = `0,0 0,${side} ${length},${side / 2} 0,0`;
  rightArrow.children[0].setAttribute("points", points);
}

function crunch(pageData) {
  //pageData.data.children[x]
  //pageData.data.children[x].data.title
  // /\[WTS\]/
  //pageData.data.children[x].data.selftext
  //pageData.data.children[x].data.title
  //pageData.data.children[x].data.author
  //pageData.data.children[x].data.url
  //pageData.data.children[x].data.created_utc

  let rawSale = [];
  pageData.data.children.forEach(function(post) {
    if (/\[WTS\]/.test(post.data.title)) {
      rawSale.push(post);
    }
  });

  let forSale = rawSale.map(function(post) {
    let info = {
      title: post.data.title,
      author: post.data.author,
      url: post.data.url,
      items: [],
      shipping: ""
    }

    let roughList = [];
    post.data.selftext.split(/\n/).forEach(function(line) {
      if (/\$/.test(line)) {
        let cleaner = /[~|*]/ig
        line = line.replace(cleaner, " ");
        roughList.push(line);
      }
    });

    roughList.forEach(function(item) {
      let shipping = /google|venmo|ppff|paypal|ebay|shipping/i;
      if (shipping.test(item)) {
        info.shipping = item;
      } else {
        info.items.push(item);
      }
    });

    return info;
  })

  forSale = forSale.filter(post => post.items.length > 0);

  console.log(forSale);
  display(forSale);
}

function display(forSale) {

  forSale.forEach(function(post, index) {
    let postDiv = makeElement("div", `post${index}`, "postDiv");

    let title = makeElement("h1", `title${index}`, "title");
      title.innerHTML = post.title;
    postDiv.appendChild(title);

    let sourceDiv = makeElement("nav", `src${index}`, "source");
      let author = makeElement("a");
        author.href = `https://www.reddit.com/user/${post.author}/`;
        author.innerHTML = post.author;
      sourceDiv.appendChild(author);

      let link = makeElement("a");
        link.href = post.url;
        link.innerHTML = "Original post";
      sourceDiv.appendChild(link);
    postDiv.appendChild(sourceDiv);

    let shipping = makeElement("div", `shipping${index}`, "shipping");
      shipping.innerHTML = post.shipping;
    postDiv.appendChild(shipping);

    let coinDiv = makeElement("div", `coinDiv${index}`, "coinDiv");
      post.items.forEach(function(coin) {
        if (!/sold/i.test(coin)) {
          let span = makeElement("span", "", "coin");
            span.innerHTML = coin;
          coinDiv.appendChild(span);
        }
      });
    postDiv.appendChild(coinDiv);
    document.body.appendChild(postDiv);
  });

  initialize();
}

function initialize() {

  function changeDiv(index) {

    //
    //post, 1 left
    let l1 = document.getElementById("post" + (((index + posts.length) - 1) % posts.length));
      l1.style.transform = "translate(-100%, 0%)";
      l1.style.filter = "opacity(0)";
      l1.style.zIndex = "0";
    //
    //primary post
    let primary = document.getElementById("post" + index);
      primary.style.transform = "translate(0%, 0%)";
      primary.style.filter = "opacity(1)";
      primary.style.zIndex = "1";
    //
    //post, 1 right
    let r1 = document.getElementById("post" + (((index + posts.length) + 1) % posts.length));
      r1.style.transform = "translate(100%, 0%)";
      r1.style.filter = "opacity(0)";
      r1.style.zIndex = "0";
  }

  let posts = Array.from(document.querySelectorAll(".postDiv"));
  let index = 0;
  let buttonDiv = makeElement("div", "buttonDiv");

  //
  //Makes the SVG container for the left arrow
  let leftArrow = makeSVG("svg", "leftArrow");
  leftArrow.onclick = function() {
    index = (((index + posts.length) - 1) % posts.length);
    changeDiv(index);
  };

  //
  //Defines the polygon of the left arrow
  let leftPoly = makeSVG("polygon");
    let side = vw(8);
    let length = side - (side * .866);
    let points = `${side},0 ${side},${side} ${length},${side / 2} ${side},0`;
    leftPoly.setAttribute("points", points);
  leftArrow.appendChild(leftPoly);
  //
  //Puts the arrow in a button for accessibility
  let button = document.createElement("button");
  button.appendChild(leftArrow);
  buttonDiv.appendChild(button);

  //
  //Makes the SVG container for the right arrow
  let rightArrow = makeSVG("svg", "rightArrow");
  rightArrow.onclick = function() {
    index = (((index + posts.length) + 1) % posts.length);
    changeDiv(index);
  };
  //
  //Defines the polygon of the right arrow
  let rightPoly = makeSVG("polygon");
     side = vw(8);
     length = side * .866;
     points = `0,0 0,${side} ${length},${side / 2} 0,0`;
    rightPoly.setAttribute("points", points);
  rightArrow.appendChild(rightPoly);
  //
  //Puts the arrow in a button for accessibility
  button = document.createElement("button");
  button.appendChild(rightArrow);
  buttonDiv.appendChild(button);
  document.body.appendChild(buttonDiv);

  //
  //When the window resizes, the navigation
  //  arrows resize as well.
  window.onresize = function() {
    fixArrows();
  }

  changeDiv(0);
}
