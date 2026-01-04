const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ALLOWED_IMAGE_AGE = (process.env.ALLOWED_IMAGE_AGE || 10 * 60) * 1000;
const IMAGE_SOURCE_URL = process.env.IMAGE_SOURCE_URL || 'https://picsum.photos/1200';
const IMAGE_PATH = path.join(__dirname, 'images', 'image.jpg');

const app = express();
app.set('view engine', 'ejs');

if (!fs.existsSync(path.dirname(IMAGE_PATH))) {
  fs.mkdirSync(path.dirname(IMAGE_PATH));
}

const downloadImage = () => {
  return fetch(IMAGE_SOURCE_URL)
    .then((imageRes) => {
      if (!imageRes.ok) {
        throw new Error(`Network response was not okay: ${imageRes.status}`);
      }
      return imageRes.arrayBuffer();
    })
    .then((imageBuffer) => {
      fs.writeFileSync(IMAGE_PATH, Buffer.from(imageBuffer));
    });
};

const validateImage = () => {
  return fs.promises.stat(IMAGE_PATH)
    .then((stats) => {
      const isImageOld = (Date.now() - stats.mtimeMs) > ALLOWED_IMAGE_AGE;
      if (isImageOld) {
        return downloadImage();
      }
    })
    .catch((err) => {
      if (err.code === 'ENOENT') { // File doesn't exist
        return downloadImage();
      } else {
        console.error('Error validating image:', err.message);
        throw err;
      }
    });
};

app.use('/images', express.static(path.dirname(IMAGE_PATH)));
app.get('/', async (req, res) => {
  try {
    await validateImage();
    res.render('index', { imagePath: '/images/image.jpg' });
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
