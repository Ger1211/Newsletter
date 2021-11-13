let express = require("express");
let app = express();
let router = express.Router();
let port = process.env.PORT || 3001;
app.use(express.json());

router.get("/", function (req, res) {
  res.status(200);
  res.json({ message: "hooray! welcome to our API" });
});
app.use("/", router);
app.listen(port, () => console.log(`Port ${port} listening`));
