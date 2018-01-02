var express = require('express');
var router = express.Router();
var fs = require('fs')

/* GET html list. */
router.get('/', function(req, res, next) {
  var list_dir = './public/';

  var file_list = [];
  fs.readdir(list_dir,(err,list)=>{
    for(i in list){
      var f = list[i];
      var stats = fs.statSync(list_dir+f);
      if(stats.isFile() & f.split('.').pop() == 'html'){
        console.log('ok');
        file_list.push(f);
      }
    }
    res.send(file_list);
  });
});

module.exports = router;
