const picklify = require("picklify"); // para cargar/guarfar unqfy
const fs = require("fs"); 
const Subscriptor = require("./domain/subscriptor");

class Newsletter {
  constructor() {
    this.subscriptors = []
  }

  save(filename) {
    const serializedData = picklify.picklify(this);
    fs.writeFileSync(filename, JSON.stringify(serializedData, null, 2));
  }

  static load(filename) {
    const serializedData = fs.readFileSync(filename, { encoding: "utf-8" });
    const classes = [Newsletter, Subscriptor];
    return picklify.unpicklify(JSON.parse(serializedData), classes);
  }
}

module.exports = {
  Newsletter: Newsletter,
};
