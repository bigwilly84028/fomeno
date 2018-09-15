const http = require('http'),
    fs = require('fs'),
    path = require("path"),
    express = require("express"),
    app = express(),
    httpServer = http.createServer(app),
    port = process.env.PORT || 3000,
    multer = require("multer");

// server setup
httpServer.listen(3000, () => {
    console.log(`Server is listening on port ${port}`);
});

//routes
app.get("/", express.static(path.join(__dirname, "./")));
app.use("/js", express.static(__dirname + '/js'));
app.use("/assets", express.static(__dirname + '/assets'));
app.use("/uploads", express.static(__dirname + '/uploads'));

//error handler
const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

const upload = multer({
    dest: "assets"
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
}); 

app.post(
    "/assets",
    upload.single("file" /* name attribute of <file> element in your form */),
    (req, res) => {
      const tempPath = req.file.path;
      const targetPath = path.join(__dirname, "./assets/uploadedbgimage.png");
  
      if (path.extname(req.file.originalname).toLowerCase() === ".png") {
        fs.rename(tempPath, targetPath, err => {
          if (err) return handleError(err, res);
  
          res
            .status(200)
            .contentType("text/plain")
            .end("File uploaded!");
        });
      } else {
        fs.unlink(tempPath, err => {
          if (err) return handleError(err, res);
  
          res
            .status(403)
            .contentType("text/plain")
            .end("Only .png files are allowed!");
        });
      }
    }
  ); 