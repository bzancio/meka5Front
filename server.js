import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

app.post("/login", (req, res) => {
  fs.writeFileSync("users.json", JSON.stringify(req.body, null, 2));
  res.send({ ok: true });
});

app.post("/newUser", (req, res) => {
  fs.writeFileSync("users.json", JSON.stringify(req.body, null, 2));
  res.send({ ok: true });
});

app.listen(3000, () => console.log("Backend at http://localhost:3000"));
