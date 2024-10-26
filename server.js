const express = require('express');
const multer = require('multer');
const { uploadVideo, checkStatus } = require('./controllers/videoController');

const app = express();
const upload = multer(); // Use multer's memory storage for files

app.use(express.json());

// Define the route for video upload
app.post('/upload', upload.single('video'), uploadVideo);
app.get('/check-status', checkStatus);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
