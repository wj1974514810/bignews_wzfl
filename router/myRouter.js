const express = require('express')
const router = express.Router();
const conn = require('../units/sql')
const multer = require('multer');
const jwt = require('jsonwebtoken');

router.use(express.urlencoded())
const storage = multer.diskStorage({
    // 保存在哪里
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    // 保存时，文件名叫什么
    filename: function (req, file, cb) {
        // console.log('file', file)
        // 目标： 新名字是时间戳+后缀名
        const filenameArr = file.originalname.split('.');
        // filenameArr.length-1是找到最后一个元素的下标
        const fileName = Date.now() + "." + filenameArr[filenameArr.length - 1]
        cb(null, fileName) //
    }
})

const upload = multer({ storage })
router.get('/userinfo', (req, res) => {
    // console.log("获取用户信息：", req.query);
    // const { username } = req.query;
    // console.log(req);
    const { username } = req.user;
    // console.log(req);
    // console.log(username);
    let sqlstr = `select * from users where username="${username}"`;
    // console.log(sqlstr);
    // if (username) {
    //     sqlstr += ` `
    // }
    // console.log(sqlstr);
    // console.log('sql', sqlstr);
    conn.query(sqlstr, (err, result) => {
        if (err) {
            console.log(err);
            res.status(502)
            res.json({ status: 1, msg: "获取用户信息失败！" })
            return
        } else {
            // console.log(result);
            res.json({ status: 0, msg: "获取用户信息成功！", data: result })
        }
    })
})

router.post('/userinfo', (req, res) => {
    const { id, username, nickname, email, userPic, password } = req.body;
    let arr = [];
    if (username) {
        arr.push(`username="${username}"`)
    }
    if (nickname) {
        arr.push(`nickname="${nickname}"`)
    }
    if (email) {
        arr.push(`email="${email}"`)
    }
    if (userPic) {
        arr.push(`userPic="${userPic}"`)
    }
    if (password) {
        arr.push(`password="${password}"`)
    }
    let sqlStr = `update users set ${arr} where id=${id}`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 1, msg: "更新用户信息失败！" })
            return
        } else {
            res.json({ status: 0, msg: "更新用户信息成功！" })
        }
    })
})

router.post('/uploadPic', upload.single('file_data'), (req, res) => {
    console.log('本次上传的文件是', req.file)
    res.json({ status: 0, msg: "上传成功", "src": "http://127.0.0.1:3000/uploads/" + req.file.filename })
})



// router.post('/updatepwd', (req, res) => {
//     // console.log(req.body);
//     const { id, oldPwd, newPwd } = req.body;
//     // const { username } = req.user;
//     console.log(req.user);

//     let sqlSTR = `select * from users where id=${id} and password="${oldPwd}"`;
//     console.log(sqlSTR);
//     conn.query(sqlSTR, (err, result) => {
//         if (err) {
//             res.json({ status: 1, msg: "获取原密码失败！" })
//         }
//         console.log(result);
//         if (result.length > 0) {
//             let sqlStr = `update users set password="${newPwd}" where id=${id}`;
//             console.log(oldPwd);
//             conn.query(sqlStr, (err, result) => {
//                 if (err) {
//                     res.json({ status: 1, msg: "修改密码失败！" })
//                 } else {
//                     // console.log(result);
//                     res.json({ status: 0, msg: "修改原密码成功！" })
//                 }
//             })
//         } else {
//             res.json({ status: 1, msg: "修改密码失败！" })
//         }
//     })
// })



router.post('/updatepwd', (req, res) => {
    console.log(req);
    console.log('接受到的参数是', req.body);
    const { oldPwd, newPwd, id } = req.body;
    const sqlStrSelect = `select password from users where id=${id}`;
    conn.query(sqlStrSelect, (err, result) => {
        console.log(result);
        if (err) {
            console.log(err);
            res.json({ status: 500, message: '服务器错误' })
            return
        }
        if (result[0].password !== oldPwd) {
            res.json({ status: 1, message: '旧密码输入错误' })
            return
        }
        const sqlStr = `update users set password=${newPwd} where id=${id}`;
        conn.query(sqlStr, (err, result) => {
            if (err) {
                console.log(err);
                res.json({ status: 500, message: '服务器错误' })
                return
            }
            res.json({ status: 0, message: '修改密码成功', })
        })
    })


})


module.exports = router