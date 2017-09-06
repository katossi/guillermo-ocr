/**
 * Created by Minhaj on 6/20/15.
 */

var tesseract = require('node-tesseract');
var multer  = require('multer');
var fs = require('fs');
var mrzTools = require('mrz');

module.exports = function(app) {
    app.use(multer(
        {
            dest: './.tmp/',
            inMemory: false
        }
    ));

    app.post("/api/ocr", process);

};

/**
 * Following steps done under this functions.
 *
 * 1. Uploads image under '.tmp' folder.
 * 2. Grab text from image using 'tesseract-ocr'.
 * 3. Delete image from hardisk.
 * 4. Return text in json format.
 *
 * @param req
 * @param res
 */
var process = function(req, res) {

    var path = req.files.file.path;


    var options = {
        //psm : 6, 
        l: 'ocrb' , 
        binary: 'C:\\Tesseract-OCR\\tesseract.exe',
       // load_system_dawg:0,
       // load_freq_dawg:0
    };
    
        // Recognize text of any language in any format
    tesseract.process(path,options,function(err, text) {
        if(err) {
            console.error(err);
        } else {
            fs.unlink(path, function (err) {
                if (err){
                    res.json(500, "Error while scanning image");
                }
                console.log('successfully deleted %s', path);
            });

            //Muestra texto escaneado
            //console.log(text);

            var lineas = text.match(/^[0-9a-zA-Z<]{30}((\r\n|\n|\r)|$)/gm);
            
            console.log("lineas");

            var cadenaFinal = lineas.join("").trim();
                
                        
            console.log(cadenaFinal);
          
            console.log(mrzTools.parse(cadenaFinal));
            
            res.json(200, mrzTools.parse(cadenaFinal));
        }
    });
};