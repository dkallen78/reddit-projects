document.onkeypress = function(event) {
  if (event.key === "Enter") {
    searchit();
  }
}

function clearElement(...elements) {
  //----------------------------------------------------//
  //Clears the innerHTML of any number of elements      //
  //  passed in as arguments                            //
  //array-> elements: elements to be cleared            //
  //----------------------------------------------------//

  elements.forEach(x => x.innerHTML = "");
}

function makeElement(type, id, ...classes) {
  //----------------------------------------------------//
  //Returns an HTML element                             //
  //string-> type: type of element to be returned       //
  //string-> id: id of the element                      //
  //array(string)-> classes: classes to add to the      //
  //  element                                           //
  //return-> element: element of [type]                 //
  //----------------------------------------------------//

  let element = document.createElement(type);
  if (typeof id === "string") {element.id = id}
  classes.forEach(x => element.classList.add(x));
  return element;
}

function makeSVG(type, id, ...classes) {
  //----------------------------------------------------//
  //Returns an SVG element of the type indicated..      //
  //string-> type: type of SVG element to be created    //
  //string-> id: id of the new SVG element              //
  //array(string)-> classes: classes to add to the SVG  //
  //  element                                           //
  //return-> element: SVG element                       //
  //----------------------------------------------------//

  let svg = document.createElementNS("http://www.w3.org/2000/svg", type);
  if(typeof id === "string") {svg.id = id}
  classes.forEach(x => svg.classList.add(x));
  return svg;
}

function searchit() {
  let textBox = document.getElementById("textBox");
  let subreddit = textBox.value;
  let sortBy = document.getElementById("sortBy");
  sortBy = sortBy.value;
  fetch(`https://www.reddit.com/r/${subreddit}${sortBy}.json`)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      console.log(myJson);
      let redditData = myJson;
      display(redditData, subreddit);
    });
}

function countWords(sub) {

  let wordArray = [];
  sub.forEach(function(x) {
    let string = x.data.title.replace(/[\|\[,.?!“”’‘"''"(&)\/\-\]]/ig, "");

    string.toUpperCase().split(/\s/).forEach(function(y) {
      let common = /\b(the|a|as|to|at|in|for|on|of|from|with|this|that|those|these|an|by|and|but|or|there|if)\b/gi;
      let pron = /\b(he|his|him|she|hers|her|it|its|my|mine|you|your|yours|our|ours|they|they|their|theirs|us|i|we|me)\b/gi;
      let tobe = /\b(be|is|are|am|was|were|youre|im|theyre|hes|shes)\b/gi;
      if(!common.test(y) && !pron.test(y) && !tobe.test(y) && !/^$/.test(y)) {
        let isIn = wordArray.findIndex(z => z[0] === y);
        if (isIn < 0) {
          wordArray.push([y, 1]);
        } else {
          wordArray[isIn][1]++;
        }
      }
    });
  });
  return wordArray;
}

function stupidSort(array) {
  array.forEach(function(x, i) {
    let maxI = i;
    for (let j = i; j < array.length; j++) {
      if (array[j][1] > array[maxI][1]) {
        maxI = j;
      }
    }
    [array[i], array[maxI]] = [array[maxI], array[i]];
  });

  return array;
}

function display(sub, title) {

  let results = document.getElementById("results");
  clearElement(results);

  let wordCounts = countWords(sub.data.children);
  wordCounts = stupidSort(wordCounts);
  let factor = 200 / wordCounts[0][1];
  wordCounts.forEach(function(word, i) {
    //let wordRank = makeElement("div", `wordRank${i}`, "wordRank");
      let wordSpan = makeElement("span", `word${i}`, "wordSpan");
        wordSpan.innerHTML = word[0];
      results.appendChild(wordSpan);

      let wordCount = makeElement("span", `wordCount${i}`, "wordCount");
        wordCount.innerHTML = word[1];
      results.appendChild(wordCount);

      let rank = makeSVG("svg", `svg${i}`, "rank");
        rank.setAttribute("width", 200);
        rank.setAttribute("height", 20);
        rank.setAttribute("viewBox", "0 0 200 20");

        let rankRect = makeSVG("rect", `rect${i}`, "rankRect");
          rankRect.setAttribute("width", factor * word[1]);
          rankRect.setAttribute("height", 20);
        rank.appendChild(rankRect);
      results.appendChild(rank);
    //results.appendChild(wordRank);
  });
  console.log(wordCounts);

}
