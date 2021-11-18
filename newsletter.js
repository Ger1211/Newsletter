const picklify = require("picklify");
const fs = require("fs");
const Subscriptor = require("./domain/subscriptor");
const unqfy = require("./services/unqfy");

class Newsletter {
  constructor() {
    this.subscriptors = [];
  }

  getArtist(artistId) {
    return unqfy.findArtist(artistId);
  }

  addSubscriptor(artistId, email) {
    if (!this.subscriptorExist(artistId, email)) {
      let subscriptor = new Subscriptor(artistId, email);
      this.subscriptors.push(subscriptor);
      this.save("data.json");
    }
  }

  deleteSubscriptor(artistId, email) {
    if (this.subscriptorExist(artistId, email)) {
      const indexToDelete = this.subscriptors.findIndex(
        (sub) => sub.artistId === artistId && sub.email === email
      );
      this.subscriptors.splice(indexToDelete, 1);
      this.save("data.json");
    }
  }

  subscriptorExist(artistId, email) {
    return this.subscriptors.some(
      (subscriptor) =>
        subscriptor.artistId === artistId && subscriptor.email == email
    );
  }

  sendEmail(emailData) {
    const subscriptors = this.subscriptors
      .map((sub) => {
        if (sub.artistId === emailData.artistId) {
          return sub.email;
        }
      })
      .filter((elem) => elem !== undefined);
    console.log(subscriptors);
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
