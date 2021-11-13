const rp = require("request-promise");
const gmail = (() => {
  function sendMail(email, subject, message) {
    const options = {
      url: ``,
      headers: {
        Authorization: `Bearer `,
      },
      json: true,
    };
    return rp.get(options).then((response) =>  console.log(response));
  }
  
  return {
    sendMail: sendMail,
  };
})();

module.exports = gmail;

