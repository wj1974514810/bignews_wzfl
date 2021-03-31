const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors())

const jwt = require('express-jwt')
app.use('/uploads', express.static('uploads'))
// app.use(jwt().unless());
// jwt() 用于解析token，并将 token 中保存的数据 赋值给 req.user
// unless() 约定某个接口不需要身份认证
app.use(jwt({
    secret: 'gz61', // 生成token时的 钥匙，必须统一
    algorithms: ['HS256'] // 必填，加密算法，无需了解
}).unless({
    path: ['/api/reguser', '/api/login', /^\/uploads\/.*/] // 除了这两个接口，其他都需要认证
}));

app.use("*", (req, res, next) => {
    next();
})

//路由中间件
const userRouter = require('./router/user_router');
const articleRouter = require('./router/article_router')
const myRouter = require('./router/myRouter')
app.use('/api', userRouter);
app.use('/my', articleRouter);
app.use('/my', myRouter);

// 错误处理中间件
app.use((err, req, res, next) => {
    console.log('有错误', err)
    if (err.name === 'UnauthorizedError') {
        // res.status(401).send('invalid token...');
        res.status(401).send({ code: 1, message: '身份认证失败！' });
    }
});


app.listen(3000, () => {
    console.log("您的服务器已在3000端口就绪");
})


