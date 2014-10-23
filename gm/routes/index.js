
/*
 * GET home page.
 */
var fs=require("fs");
var path=require("path");
var child_process=require("child_process");

exports.route=function(app){
    app.get("/",function(req,res){
        res.render('index', { title: '文件上传' });
    });

//    文件上传
    app.post('/upload.action', function(req, res) {
        console.log(req.files);
        for (var i in req.files) {
            if (req.files[i].size == 0){
                fs.unlinkSync(req.files[i].path);
                console.log('Successfully removed an empty file!');
            } else {
                var target_path = 'public/DFS/' + req.files[i].name;
                console.log(target_path);
                console.log(req.files[i].path);
                fs.renameSync(req.files[i].path, target_path);
                res.render('gm', {
                    title: '文件处理',
                    src:'DFS/' + req.files[i].name
                });
            }
        }
    });

//    文件处理
    app.get("/gm",function(req,res){
        var config=[];
        for(var item in req.query){
            config.push(req.query[item]);
        }
        child_process.exec("cd gm && node gm.js"+" "+config[0]+" "+config[1]+" "+config[2]+" "+config[3],function(error, stdout, stderr){
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            else{
                res.send(config[3]);
            }
        });
    })
}
