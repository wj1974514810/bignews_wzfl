const express = require('express')
const router = express.Router();
const conn = require('../units/sql')
const multer = require('multer');
const jwt = require('jsonwebtoken');

router.use(express.urlencoded())


router.post('/reguser', (req, res) => {
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

router.post('/login', (req, res) => {
    console.log(req.body);
    const { username, password } = req.body
    let sqlStr = `select * from users where username="${username}" and password="${password}"`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ status: 1, msg: "登录失败！" })
        }
        if (result.length > 0) {
            console.log(result);
            const token = "Bearer " + jwt.sign(
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



module.exports = router