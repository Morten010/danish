import express from "express";

import cors from "cors";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const port = process.env.PORT || 3001
const app = express();

// Send html page on default route
app.get("/", (_, res) => {
    res.sendFile(path.join(__dirname, '/pages/index.html'))
});


// api routes

const upload = multer({ dest: 'uploads/' });

// Image compression route
app.post('/compress', upload.single('image'), async (req, res) => {
    try {
      const { compressionLevel, format, width, height } = req.body;
      const outputPath = `optimized/${Date.now()}_optimized.${format}`;
      console.log(req.file?.path);
      console.log(req.file);
      
      // @ts-ignore
      await sharp(req.file.path)
      .resize(parseInt(width), parseInt(height)) // Resize
      .toFormat(format) // Convert to the selected format
      .jpeg({ quality: parseInt(compressionLevel) }) // Compress image
      .toFile(outputPath);
      
      // Remove original uploaded fil
      // @ts-ignore
      fs.unlinkSync(req.file.path);
      
      // Return download link
      res.json({ downloadLink: `/${outputPath}` });
    } catch (error) {
        console.log(error);
        
      res.status(500).json({ message: 'Error compressing image' });
    }
  });




app.listen(port, () => {
    console.log(`Express server started on port ${port}: http://localhost:${port}`);
});

