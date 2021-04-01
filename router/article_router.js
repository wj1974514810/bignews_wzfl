const express = require('express')
const router = express.Router();
const conn = require('../units/sql')
const multer = require('multer');
const { Router } = require('express');

router.use(express.urlencoded())

router.get("/cates", (req, res) => {
    let sqlStr = `select * from categories`;
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                "status": 1,
                "message": "获取文章分类列表失败！",
            })
        } else {
            console.log(result);
            res.json({
                "status": 0,
                "message": "获取文章分类列表成功！",
                "data": result
            })
        }
    })
})

router.post('/addcates', (req, res) => {
    const { name, slug } = req.body;
    let sqlStr = `insert into categories (name,slug) values ("${name}","${slug}")`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ status: 1, msg: '新增文章分类失败！' })
        } else {
            console.log(result);
            res.json({ status: 0, msg: '新增文章分类成功！' })
        }
    })
})

router.get('/deletecate', (req, res) => {
    const { id } = req.query;
    let sqlStr = `delete from categories where id=${id}`;
    conn.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 1, msg: '删除文章分类失败！' })
        } else {
            console.log(result);
            res.json({ status: 0, msg: '删除文章分类成功！' })
        }
    })
})


router.get('/getCatesById', (req, res) => {
    const { id } = req.query;
    let sqlStr = `select * from categories where id=${id}`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ status: 1, msg: '获取文章分类数据失败！' })
        } else {
            console.log(result);
            res.json({ status: 0, msg: '获取文章分类数据成功！' })
        }
    })
})


router.post('/updatecate', (req, res) => {
    const { id, name, slug } = req.body;
    let sqlStr = `update categories set name="${name}",slug="${slug}" where id=${id}`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 1, msg: '更新文章分类数据失败！' })
            return
        } else {
            console.log(result);
            res.json({ status: 0, msg: '更新文章分类数据成功！' })
        }
    })
})
module.exports = router