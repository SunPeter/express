/**
 * Created by peter on 14-10-22.
 */
var fs = require('fs'),gm = require('gm');
var argv=process.argv;
var config={
    sourceName:argv[2],
    width:argv[3],
    height:argv[4],
    destName:argv[5]
}
console.log(config);
// resize and remove EXIF profile data
gm('../public/'+config.sourceName)
    .resize(config.width,config.height,"!")
    .noProfile()
    .write('../public/'+config.destName, function (err) {
        if (!err) console.log('done');
        else{
            console.log(err);
        }
    });