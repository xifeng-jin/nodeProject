let express = require('express')
let path = require('path')
let sqlQuery = require('./zlMsql')
let app = express()
//使用模版渲染页面
let ejs = require('ejs')

//设置配置项 将模版引擎与express应用相关联
app.set('views',"views")
app.set('view engine','ejs');
app.engine('ejs',ejs.__express);

//静态目录文件
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',async (req,res) => {
    let strSql = "select id,bookname,bookImg,author,cate,IDbook from book2 limit 0,8"
    let result = await sqlQuery(strSql)

    //获取信息
    let sql_str = "select * from category"
    let cat_res = await sqlQuery(sql_str)

    let page = 1
    let key = 1

    
    //总页数的获取
    let strSql2 = 'SELECT count(id) as num FROM book2'
    let result1 = await sqlQuery(strSql2)
    let pageAll = Math.ceil(result1[0].num / 8)
    let startPage = (page - 4) < 1 ? 1 : (page - 4)
    let endPage = (page + 5) > pageAll ? pageAll : (page + 5)

    let options = {
        book: Array.from(result),
        category: Array.from(cat_res),
        pageAll:pageAll,
        page,
        key,
        startPage,
        endPage
    }

    
    res.render('book.ejs',options)

})

app.get('/:bookid',async (req,res) => {
    let strSql = "select * from book2 where IDbook = ?"
    let bookid = '/' + req.params.bookid + '/'

    let result = await sqlQuery(strSql,[bookid])
    // console.log(bookid,result)
   
    //获取信息
    let sql_str = "select * from category"
    let cat_res = await sqlQuery(sql_str)

    let options = {
        book: result[0],
        category: Array.from(cat_res)
    }
    //  res.send(bookid)
    // // res.send(bookid)
    res.render('bookInfo.ejs',options)
})


//分类页面的路由
app.get('/category/:id',async (req,res) => {
    let strSql = 'SELECT * FROM book2 WHERE cate in (SELECT category FROM category WHERE id = ?) limit 0,8'
    let id = req.params.id

    let result = await sqlQuery(strSql,[id])
  

    //获取信息
    let sql_str = "select * from category"
    let cat_res = await sqlQuery(sql_str)

    //总页数的获取
    let page = 1
    let key1 = id
    let strSql2 = "SELECT count(id) as num FROM book2 WHERE cate  in (SELECT category FROM category WHERE id = ?)"
    let result1 = await sqlQuery(strSql2,[id])
    let pageAll = Math.ceil(result1[0].num / 8)
    let startPage = (page - 4) < 1 ? 1 : (page - 4)
    let endPage = (page + 5) > pageAll ? pageAll : (page + 5)

    let options = {
        book: Array.from(result),
        category: Array.from(cat_res),
        pageAll:pageAll,
        page:page,
        key:key1,
        startPage:startPage,
        endPage:endPage
    }
  

    res.render('book.ejs',options)
 
})

//搜索路由
app.get('/search/:key',async (req,res) => {
    let key = req.params.key
    let strSql = "SELECT * FROM book2 WHERE bookname like '%" + key+ "%'"
    let result = await sqlQuery(strSql)
    // console.log(result,id)

    //获取信息
    let sql_str = "select * from category"
    let cat_res = await sqlQuery(sql_str)


     //总页数的获取
     let page = 1
     let key1 = 1
     let strSql2 = "SELECT count(id) as num FROM book2 WHERE bookname like '%" + key+ "%'"
     let result1 = await sqlQuery(strSql2)
     let pageAll = Math.ceil(result1[0].num / 8)
     let startPage = (page - 4) < 1 ? 1 : (page - 4)
     let endPage = (page + 5) > pageAll ? pageAll : (page + 5)
 
     let options = {
         book: Array.from(result),
         category: Array.from(cat_res),
         pageAll:pageAll,
         page:page,
         key:key1,
         startPage:startPage,
         endPage:endPage
     }
    
    res.render('book.ejs',options)
})

//分页路由
app.get('/c/:cid/page/:pid',async (req,res) => {
    let key = parseInt( req.params.cid)
    let page = parseInt(req.params.pid)
    let strSql = 'SELECT * FROM book2 WHERE cate in (SELECT category FROM category WHERE id = ?) limit ?,8'
    let arr = [key,(page - 1)*8 ]

    let result = await sqlQuery(strSql,arr)
    // console.log(result,id)

    //获取category信息
    let sql_str = "select * from category"
    let cat_res = await sqlQuery(sql_str)

    //总页数的获取
    let strSql2 = 'SELECT count(id) as num FROM book2 WHERE cate in (SELECT category FROM category WHERE id = ?)'
    let result1 = await sqlQuery(strSql2,key)
    let pageAll = Math.ceil(result1[0].num / 8)
    let startPage = (page - 4) < 1 ? 1 : (page - 4)
    let endPage = (page + 5) > pageAll ? pageAll : (page + 5)

    let options = {
        book: Array.from(result),
        category: Array.from(cat_res),
        pageAll:pageAll,
        page:page,
        key:key,
        startPage:startPage,
        endPage:endPage
    }
    // console.log(options.category)
    // console.log(result)
    // console.log(options.book[0].IDbook)
    res.render('book.ejs',options)
})


module.exports = app;