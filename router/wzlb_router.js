const express = require('express')
const router = express.Router();
const conn = require('../units/sql')
const { Router } = require('express');

router.use(express.urlencoded())

router.get('/list', (req, res) => {
    // console.log(req.query);
    let {
        pagenum,
        pagesize,
        cate_id,
        state,
    } = req.query;
    // console.log(req.query);

    let sqlStr = `select * from articles where isdelete=0`;
    // console.log(sqlStr);
    if (cate_id) {
        sqlStr += ` and cate_id="${cate_id}"`;
        if (state) sqlStr += ` and state="${state}"`
    } else {
        if (state) sqlStr += ` and state="${state}"`
    }

    if (pagenum && pagesize) {
        pagenum = parseInt(pagenum)
        if (pagenum == 0) {
            pagenum = pagenum
        } else {
            pagenum = pagenum - 1
        }
        sqlStr += ` limit ${pagenum * pagesize},${pagesize}`
        // console.log(sqlStr);
    } else {
        res.status(202).json({
            code: 202,
            msg: "pagenum,pagesize 是必传参数"
        });
        return;
    }

    conn.query(sqlStr, (err, result) => {
        if (err) {
            // console.log(err);
            res.json({ status: 1, msg: "获取文章列表失败" });
            return;
        }
        let listArr = result;
        let sqlStr = `select count(*) as total from articles where isDelete=0`;
        console.log(sqlStr);

        conn.query(sqlStr, (err, result) => {
            if (err) {
                res.status(501).json({
                    code: 501,
                    msg: "数据库操作失败"
                });
                return;
            }
            res.json({ status: 0, msg: '获取文章列表成功！', data: listArr, total: result[0].total })

        })
    })
})


router.get('/delete', (req, res) => {
    const { id } = req.query;
    let sqlStr = `UPDATE articles SET isdelete=1 WHERE id=${id}`;
    conn.query(sqlStr, (err, results) => {
        if (results.changedRows === 1) {
            res.json({ status: 0, msg: '删除数据成功！' })
        } else {
            res.json({ status: 1, msg: '删除数据失败！' })
        }
    })
})


module.exports = router