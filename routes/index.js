var express = require('express');
var router = express.Router();
const multer  = require('multer')
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const  db ="mongodb+srv://khactuan2312:khactuan@cluster0.dhfhw.mongodb.net/ontap?retryWrites=true&w=majority";
router.use(bodyParser.urlencoded({
  extended: true
}))
mongoose.connect(db).catch(error => {
  console.log("co loi xay ra" + error);
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* UPLOAD FILE*/
var nameImage = "";
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/')
  },
  filename: function (req, file, cb) {
    nameImage = Date.now() + ".jpg";
    cb(null, nameImage);
  },
  limits: {
    fileSize: 1024 * 200,
    files: 2,
  }
});
function fileFilter(req, file, cb) {
  if (file.mimetype === 'image/jpeg') {
    cb(null, true)
  } else {
    cb(new Error('K phai duoi jpg!'));
  }
}
// khai bao Schema
const xeModel = new mongoose.Schema({
  _id: "string", _gia: "string", _anh: "string", _soluong: "string"
});
const xe = mongoose.model("ontap2", xeModel);
var upload = multer({storage: storage, fileFilter: fileFilter});

/* GET list page. */
router.get('/List', function (req, res, next) {
  xe.find({}, function (err, data) {
    if (err == null) {
      res.render('List', {title: 'ListAll', data: data});
    } else {
      console.log(err.message);
    }
  })
});
/* GET update page. */
router.get('/update', function (req, res, next) {
  res.render('update', {title: 'Update', message: ""});
  // res.render('submit', { title: 'No' });
});

router.post("/Update", upload.array("profile_pic", 2), function (req, res,) {
  let _id = req.body.id;
  let _email = req.body.email;
  let _diaChi = req.body.diaChi;
  let _khoa = req.body.khoa;
  let _file = req.files;
  let _namefile = [];
  //
  // if (!_id) {
  //     const err = new Error("Chua nhap id!");
  //     return next(err);
  // } else if (!_email) {
  //     const err = new Error("Chua nhap email!");
  //     return next(err);
  // } else if (!_diaChi) {
  //     const err = new Error("Chua nhap dia chi!");
  //     return next(err);
  // } else if (!_khoa) {
  //     const err = new Error("Chua nhap khoa!");
  //     return next(err);
  // } else if (_file.length == 0) {
  //     const err = new Error("Chua chon file!");
  //     return next(err);
  // }
  for (let i = 0; i < _file.length; i++) {
    _namefile.push(_file[i].filename);
  }
  student.updateOne({_id: _id}, {_email: _email, _diaChi: _diaChi, _khoa: _khoa, _image: _namefile}, function (err) {
    if (err == null) {
      res.redirect("/List");
    } else {
      res.send(err.message);
      console.log("loi update1 " + err.message);
    }
  })

})

router.post("/getXe", function (req, res,) {
  let _id = req.body.id;
  xe.findOne({_id: _id}, function (err, data) {
    if (err == null) {
      res.send({
        trangThai: 0, data: data
      });
    } else {
      res.send({
        trangThai: 1
      });
      console.log(err.message);
    }
  })
})

/* GET delete page. */
router.get('/delete', function (req, res, next) {
  res.render('delete', {title: 'delete', message: ""});
  // res.render('submit', { title: 'No' });
});

router.post("/Delete", function (req, res,) {
  let _id = req.body.id;
  xe.deleteOne({_id: _id}, function (err) {
    if (err == null) {
      res.send({
        trangThai: 0
      });
    } else {
      res.send({
        trangThai: 1
      });
      console.log(err.message);
    }
  })
})




/* GET add page. */
router.get('/add', function (req, res, next) {
  res.render('add', {title: 'Update', message: ""});
  // res.render('submit', { title: 'No' });
});
router.post('/Add', upload.array("profile_pic", 2), function (req, res, next) {
  let _id = req.body.id;
  let _email = req.body.email;
  let _diaChi = req.body.diaChi;
  let _khoa = req.body.khoa;
  let _file = req.files;
  let _namefile = [];
  // console.log(_file);
  // ==========validate
  if (!_id) {
    const err = new Error("Chua nhap id!");
    return next(err);
  } else {
    student.findOne({_id: _id}, function (err, data) {
      if (data != null) {
        const err = new Error("ID da ton tai!");
        return next(err);
      }

    })
  }
  //
  if (!_email) {
    const err = new Error("Chua nhap email!");
    return next(err);
  }
  if (!_diaChi) {
    const err = new Error("Chua nhap dia chi!");
    return next(err);
  }
  if (!_khoa) {
    const err = new Error("Chua nhap khoa!");
    return next(err);
  }
  //
  for (var i = 0; i < _file.length; i++) {
    // console.log("ten: "+_file[i].filename);
    _namefile.push(_file[i].filename);
  }
  if (_file.length == 0) {
    const err = new Error("Chua chon file!");
    return next(err);
  } else {
    const data = new student({
      _id: _id, _email: _email, _diaChi: _diaChi, _khoa: _khoa, _image: _namefile
    });
    data.save(function (err) {
      if (err == null) {
        // res.render('index', {title: 'ListAll', message: mess});
        res.redirect("/List");
      } else {
        res.render("index", {title: "Add", message: err.message});
      }
    })
  }

});
router.post("/Find", function (req, res,) {
  let _id = req.body.timKiem;
  student.findOne({_id: _id}, function (err, data) {
    if (err == null) {
      if (data == null) {
        res.render("Find", {title: "Find", data: null, message: "K tim thay!"});
      } else {
        res.render("Find", {title: "Find", data: data, message: "Da tim thay!"});
      }
    } else {
      res.send({
        trangThai: 1
      });
      console.log(err.message);
    }
  })
})

module.exports = router;
