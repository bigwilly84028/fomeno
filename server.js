const http = require('http'),
    fs = require('fs'),
    path = require("path"),
    express = require("express"),
    app = express(),
    httpServer = http.createServer(app),
    port = process.env.PORT || 3000,
    multer = require("multer");

// server setup
httpServer.listen(port, () => {
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
        const tempTargetPartial = "/assets/uploads/";
        var tempFileName = "blob_" + Date.now() + path.extname(req.file.originalname).toLowerCase();
        const targetPath = path.join(__dirname, tempTargetPartial + tempFileName);

        if (path.extname(req.file.originalname).toLowerCase() === ".png" || path.extname(req.file.originalname).toLowerCase() === ".jpg") {
            // clean out uploads dir
            //cleanDir(tempTargetPartial);

            fs.rename(tempPath, targetPath, err => {
                if (err) return handleError(err, res);

                res
                    .status(200)
                    .contentType("text/plain")
                    .end("uploads/" + tempFileName);
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

//TODO: Doesn't currently work - FIX IT YO!
function cleanDir(dirPath) {
    try { var files = fs.readdirSync(dirPath); }
    catch (e) { return; }
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + files[i];
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
            else
                rmDir(filePath);
        }
    fs.rmdirSync(dirPath);
};