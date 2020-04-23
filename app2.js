let express = require('express')
let sqlQuery = require('./zlMsql')
let app = express()
//使用模版渲染页面
let ejs = require('ejs')

//设置配置项 将模版引擎与express应用相关联
app.set('views',"views")
app.set('view engine','ejs');
app.engine('ejs',ejs.__express);


app.get('/',async (req,res) => {
    //数据库前14本
    let strSql = "select id,bookname,bookimg,author from book limit 0,28"
    let result = await sqlQuery(strSql)
    // res.json(Array.from(result))
    res.render('index.ejs',{title: 'zlbook首页'})
})
app.get('/xiaoshuowenxue',async (req,res) => {
    let options = {
        stars: ['成龙','李连杰','甄子丹','刘德华']
    }
    res.render('xh.ejs',options)
})
app.get('/books/:bookid',async (req,res) => {
    let strSql = "select * from book where page = ?"
    let bookid = req.params.bookid
    let result = await sqlQuery(strSql,[bookid])
    res.json(Array.from(result))
})


module.exports = app;