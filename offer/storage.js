var multer = require('multer');
var path = require('path');
var fs = require('fs');
var shell = require('shelljs');

var rootFolder = path.dirname(require.main.filename);

module.exports = function(fullFolderPath) {
    try {
        var storage = multer.diskStorage({
            destination: function(req, file, cb) {

                if (req.params.user_id) {
                    fullFolderPath = path.join(rootFolder, "/uploads/users/" + req.params.user_id + "/" + req.params.offer_id)
                }

                if (!fs.existsSync(fullFolderPath)) {
                    shell.mkdir('-p', fullFolderPath);
                }

                cb(null, fullFolderPath); // Absolute path. Folder must exist, will not be created for you.

            },
            filename: function(req, file, cb) {
                cb(null, file.originalname);
            }
        })
        return storage;
    } catch (ex) {
        console.log("Error :\n" + ex);
    }
}