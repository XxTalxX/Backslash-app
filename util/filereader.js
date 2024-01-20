const fs = require("fs");

const nodes = [];
const links = [];

async function readFile() {
  return new Promise((resolve) => {
  fs.readFile("train-ticket-be.json", "utf8", (err, data) => {
    if (err) {
      const error = new Error(err);
      console.log(error);
      error.httpStatusCode = 500;
      resolve(error);
    }
     jsonData = JSON.parse(data);
     jsonData.nodes.map((element, index) => {
        nodes.push({id: index, ...element})
      });
     jsonData.edges.map(edge => {
        const currentNode = nodes.filter((obj) => { return obj.name === edge.from })[0];
        edge.to.forEach((element) => {
        const currentEdge = nodes.filter((obj) => { return obj.name === element})[0];
        links.push({source: currentNode.id, target: currentEdge.id});
        });
     });

  });
});
}
readFile();
exports.readFile = readFile;
exports.nodes = nodes;
exports.links = links;