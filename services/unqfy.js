const rp = require("request-promise");
const unqfy = (() => {
  function findArtist(artistId) {
    const options = {
      url: `http://localhost:8080/api/artists/${artistId}`,
      json: true,
    };
    return rp.get(options);
  }
  
  return {
    findArtist: findArtist,
  };
})();

module.exports = unqfy;