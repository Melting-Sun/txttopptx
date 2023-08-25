var cheerio = require("cheerio");
var htmlString = `<ul>
<li><p>Salam</p></li>
<li><p>khooobi</p></li>
</ul>
<h1 id="heading">heading</h1>
<h1 id="section"></h1>`;

// Load the HTML string into cheerio
var $ = cheerio.load(htmlString);

// Extract ul elements with their li contents
var ulElements = [];
$("ul").each(function () {
  var lis = [];
  $(this).find("li").each(function () {
    var text = $(this).find("p").text();
    lis.push(text);
  });
  ulElements.push(lis);
});

// Extract h1 headings
var h1Headings = [];
$("h1").each(function () {
  var text = $(this).text().trim();
  if (text !== "") {
    h1Headings.push(text);
  }
});

console.log("UL Elements:", ulElements);
console.log("H1 Headings:", h1Headings);
