const express = require('express')
const router = express.Router();
const conn = require('../units/sql')
const multer = require('multer');
const jwt = require('express-jwt');

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

router.post('/api/reguser', (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    let sqlstr = `insert into users (username, password) values ("${username}","${password}")`
    conn.query(sqlstr, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 1, msg: "注册失败！" })
            return;
        }
        res.json({ status: 0, msg: "注册成功！" })
    })
})

router.post('/api/login', (req, res) => {
    console.log(req.body);
    const { username, password } = req.body
    let sqlStr = `select * from users where username="${username}" and password="${password}"`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ status: 1, msg: "登录失败！" })
        }
        if (result.length > 0) {
            console.log(result);
            const token = 'Bearer ' + jwt.sign(
                { username: username },
                'gz61',
                { expiresIn: 2 * 60 * 60 }
            )
            res.json({ status: 0, msg: "登录成功！", token })
        } else {
            res.json({ status: 1, msg: "用户名密码不对！" })
        }

    })
})

router.get('/my/userinfo', (req, res) => {
    // console.log("获取用户信息：", req.query);
    const { username } = req.body;
    let sqlstr = `select * from users`
    if (username) {
        sql += ` where username="${username}"`
    }
    // console.log('sql', sqlstr);
    conn.query(sqlstr, (err, result) => {
        if (err) {
            res.json({ status: 1, msg: "获取用户信息失败！" })
        } else {
            res.json({ status: 0, msg: "获取用户信息成功！", data: result })
            console.log(result[0].password);
            oldId = result[0].password
            console.log(typeof oldId);
        }
    })
})

router.post('/my/userinfo', (req, res) => {
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
            res.json({ status: 1, msg: "更新用户信息失败！" })
        } else {
            res.json({ status: 0, msg: "更新用户信息成功！" })
        }
    })
})

router.post('/my/uploadPic', upload.single('file_data'), (req, res) => {
    console.log('本次上传的文件是', req.file)
    res.json({ status: 0, msg: "上传成功", "src": "http://127.0.0.1:6666/uploads/" + req.file.filename })
})


router.post('/my/updatepwd', (req, res) => {
    console.log(req.body);
    const { id, oldPwd, newPwd } = req.body;
    let sqlSTR = `select * from users where id=${id} and password="${oldPwd}"`;
    conn.query(sqlSTR, (err, result) => {
        if (err) {
            res.json({ status: 1, msg: "获取原密码失败！" })
        }
        console.log(result);
        if (result.length > 0) {
            let sqlStr = `update users set password="${newPwd}" where id=${id}`;
            console.log(oldPwd);
            conn.query(sqlStr, (err, result) => {
                if (err) {
                    res.json({ status: 1, msg: "修改密码失败！" })
                } else {
                    // console.log(result);
                    res.json({ status: 0, msg: "修改原密码成功！" })
                }
            })
        } else {
            res.json({ status: 1, msg: "修改密码失败！" })
        }


    })
})


module.exports = router