const express = require('express')
const router = express.Router();
const conn = require('../units/sql')
const { Router } = require('express');

router.use(express.urlencoded())

router.get('/list', (req, res) => {
    // console.log(req.query);
    let sqlStr = `select * from articles`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 1, msg: "获取文章列表失败" });
            return;
        } else {
            // console.log(result);
            res.json({ status: 0, msg: "获取文章列表成功", data: result });
        }
    })
})
router.get('/cates', (req, res) => {
    // console.log(req.query);
    let sqlStr = `select name from categories`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 1, msg: "获取文章分类失败" });
            return;
        } else {
            // console.log(result);
            res.json({ status: 0, msg: "获取文章分类成功", data: result });
        }
    })
})


module.exports = router