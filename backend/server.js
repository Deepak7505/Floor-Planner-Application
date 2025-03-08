const express = require("express");
const cors = require("cors");
const { dataObject } = require("./constant");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());


app.get("/api/floorplan", (req, res) => {
  try {
    res.status(200).json(dataObject);
  } catch (error) {
    res.status(500).json({"error": "internal server error!"});
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
