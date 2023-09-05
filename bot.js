const { log } = require("console");
var pandoc = require("node-pandoc");
const fs = require("fs")

var config = JSON.parse(fs.readFileSync('config.json'));

var src = config.src
var args = "-f docx -t html5";
var outputString = "";


var callback = function (err, result) {
  if (err) {
    console.error("Oh Nos: ", err);
    return;
  }

  // Regular expressions to match ul, li, h1, h2, h3 tags
  var ulLiRegex = /<ul>[\s\S]*?<\/ul>|<li>[\s\S]*?<\/li>/g;
  var h1H2H3Regex = /<h[1-3][^>]*>[\s\S]*?<\/h[1-3]>/g;

  // Extract ul, li, h1, h2, h3 matches
  var ulLiMatches = result.match(ulLiRegex);
  var h1H2H3Matches = result.match(h1H2H3Regex);

  // Concatenate matches into a single string
  outputString = ulLiMatches.join("") + " " + h1H2H3Matches.join("");

  // Remove whitespace characters and line breaks
  outputString = outputString.replace(/\s+/g, "");

  // Remove id attributes from the output string
  outputString = outputString.replace(/id="[^"]*"/g, "");

  // Print the cleaned output
  console.log(outputString);

  // Call the second pandoc inside this callback
  var args2 = "-f html -t docx -o word1.docx";
  var callback2 = function (err2, result2) {
    if (err2) console.error("Oh Nos: ", err2);
    // Without the -o arg, the converted value will be returned.
    console.log(result2);
  };

  pandoc(outputString, args2, callback2);
};

// Call the first pandoc
pandoc(src, args, callback);













var cheerio = require("cheerio");

var src = "./word1.docx";
var args = "-f docx -t html5";

// Set your callback function
var callback = function (err, result) {
  if (err) {
    console.error("Oh Nos: ", err);
  } else {
    // Call the function to process the result
    processHtml(result);
  }
};

// Call pandoc
pandoc(src, args, callback);


var cheerio = require("cheerio");
const PPTX = require('nodejs-pptx');

var src = "./word1.docx";
var args = "-f docx -t html5";

// Set your callback function
var callback = function (err, result) {
  if (err) {
    console.error("Oh Nos: ", err);
  } else {
    // Call the function to process the result
    processHtml(result);
  }
};

// Call pandoc
pandoc(src, args, callback);

// Function to process the HTML result
function processHtml(result) {
  var $ = cheerio.load(result);

  var ulElements = [];
  $("ul").each(function () {
    var lis = [];
    $(this)
      .find("li")
      .each(function () {
        var text = $(this).find("p").text();
        lis.push(text);
      });
    ulElements.push(lis);
  });

  var h1Headings = [];
  $("h1").each(function () {
    var text = $(this).text().trim();
    if (text !== "") {
      h1Headings.push(text);
    }
  });

  // Call the function to add elements to the PowerPoint
  addElements(ulElements, h1Headings);
}

// Function to add elements to PowerPoint
async function addElements(ulElements, h1Headings){
  let pptx = new PPTX.Composer();
  await pptx.load(config.pptxTemplate);

  for(const [i, header] of h1Headings.entries()){
    await pptx.compose(async pres => {
      await pres.getSlide(i + 1).addText(text => {
        text
          .value(header)
          .x(config.x)
          .y(config.y)
          .fontFace(config.fontFace)
          .fontSize(config.fontSize)
          .textColor(config.textColor)
          .textWrap(config.textWrap)
          .textAlign(config.textAlign)
          .textVerticalAlign(config.textVerticalAlign)
          .line(config.line)
          .margin(config.margin);
      });
    });
  }

  for(const [i, body] of ulElements.entries()){
    await pptx.compose(async pres => {
      await pres.getSlide(i + 1).addText(text => {
        text
          .value(body)
          .x(config.xbody)
          .y(config.ybody)
          .fontFace(config.fontFacebody)
          .fontSize(config.fontSizebody)
          .textColor(config.textColorbody)
          .textWrap(config.textWrapbody)
          .textAlign(config.textAlignbody)
          .textVerticalAlign(config.textVerticalAlignbody)
          .line(config.linebody)
          .margin(config.marginbody);
      });
    });
  }

  await pptx.save(config.savingPath);
  console.log('New presentation with headers saved!');
}
