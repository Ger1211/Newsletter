let express = require("express");
let app = express();
let router = express.Router();
let port = process.env.PORT || 3001;
app.use(express.json());

router.post("/notify", function (req, res) {
  console.log("Data:", req.body);
  res.status(200).send();
});
app.use("/api", router);
app.listen(port, () => console.log(`Port ${port} listening`));
