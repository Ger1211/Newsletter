let express = require("express");
const fs = require("fs");
const newsletterMod = require("./newsletter");
const { InvalidBodyError } = require("./errors/exceptions");

function getNewsletter(filename = "data.json") {
  let newsletter = new newsletterMod.Newsletter();
  if (fs.existsSync(filename)) {
    newsletter = newsletterMod.Newsletter.load(filename);
  }
  return newsletter;
}

let app = express();
let router = express.Router();
let port = process.env.PORT || 3001;
app.use(express.json());

router
  .post("/notify", function (req, res, next) {
    if (req.body.artistId && req.body.subject && req.body.message) {
      getNewsletter()
        .getArtist(req.body.artistId)
        .then(() => {
          getNewsletter().sendEmail(req.body);
          res.status(200).send();
        })
        .catch((error) => res.status(error.statusCode).send(error.error));
    } else {
      next(new InvalidBodyError());
    }
  })
  .post("/subscribe", function (req, res, next) {
    if (req.body.artistId && req.body.email) {
      getNewsletter()
        .getArtist(req.body.artistId)
        .then(() => {
          getNewsletter().addSubscriptor(req.body.artistId, req.body.email);
          res.status(200).send();
        })
        .catch((error) => res.status(error.statusCode).send(error.error));
    } else {
      next(new InvalidBodyError());
    }
  })
  .post("/unsubscribe", function (req, res, next) {
    if (req.body.artistId && req.body.email) {
      getNewsletter()
        .getArtist(req.body.artistId)
        .then(() => {
          getNewsletter().deleteSubscriptor(req.body.artistId, req.body.email);
          res.status(200).send();
        })
        .catch((error) => res.status(error.statusCode).send(error.error));
    } else {
      next(new InvalidBodyError());
    }
  })
  .get("/subscriptions", function (req, res) {
    getNewsletter()
      .getArtist(parseInt(req.query.artistId))
      .then(() => {
        let subscriptions = getNewsletter().getSubscriptions(
          parseInt(req.query.artistId)
        );
        res.status(200).send(subscriptions);
      })
      .catch((error) => res.status(error.statusCode).send(error.error));
  })
  .delete("/subscriptions", function (req, res, next) {
    if (req.body.artistId) {
      getNewsletter()
        .getArtist(parseInt(req.body.artistId))
        .then(() => {
          let subscriptions = getNewsletter().deleteSubsriptions(
            parseInt(req.body.artistId)
          );
          res.status(200).send(subscriptions);
        })
        .catch((error) => res.status(error.statusCode).send(error.error));
    } else {
      next(new InvalidBodyError());
    }
  });

function errorHandler(err, req, res, next) {
  if (err instanceof SyntaxError || err instanceof InvalidBodyError) {
    return res.status(400).send({ status: 400, errorCode: "BAD_REQUEST" });
  } else {
    next(err);
  }
}

app.use("/api", router);
app.use(errorHandler);
app.listen(port, () => console.log(`Port ${port} listening`));
