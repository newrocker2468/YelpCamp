const request = require("request");

function getQuote() {
  return new Promise((resolve, reject) => {
    var category = "computers";
    request.get(
      {
        url: "https://api.api-ninjas.com/v1/quotes?category=" + category,
        headers: {
          "X-Api-Key": "GfUehh3ZBZOC0ib1ngcH5w==6tyaEfLIgCUc0KWu",
        },
      },

      function (error, response, body) {
        if (error) reject("Request failed:", error);
        else if (response.statusCode != 200)
          reject("Error:", response.statusCode, body.toString("utf8"));
        else resolve(JSON.parse(body));
      }
    );
  });
}

module.exports.getQuote = getQuote;
