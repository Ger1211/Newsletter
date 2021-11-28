const rp = require("request-promise");

const BASE_URL = process.env.UNQFY_HOST + "/api"
// const BASE_URL = "http://localhost:8080/api"

const unqfy = (() => {
  function findArtist(artistId) {
    const options = {
      url: `${BASE_URL}/artists/${artistId}`,
      json: true,
    };
    return rp.get(options);
  }
  
  return {
    findArtist: findArtist,
  };
})();

module.exports = unqfy;