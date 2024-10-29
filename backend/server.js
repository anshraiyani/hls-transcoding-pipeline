const express = require("express");
const multer = require("multer");
const { uploadVideo, checkStatus } = require("./controllers/videoController");
const cors = require("cors");

const app = express();
const upload = multer(); // Use multer's memory storage for files

app.use(cors());
app.options("*", cors());

app.use(express.json());

app.get("/api", (req, res) => {
    return res.status(200).json({
        message: "health check",
    });
});
app.post("/api/upload", upload.single("video"), uploadVideo);
app.get("/api/check-status", checkStatus);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
