let mysql = require('mysql')

let options = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '123456789',
    database: 'books'//这里不需要加s
}

//创建对象
let con = mysql.createConnection(options)
con.connect((err) => {
    if (err) {
        console.log('database connects failure')
        console.log(err)
    } else {
        console.log('databases connects success')
    }
})

function sqQuery(strSql,arr) {
    return new Promise((resolve,reject) => {
        con.query(strSql,arr,(err,results)=> {
            if (err) {
                reject()
            } else {
                resolve(results)
            }
        })
    })
}
module.exports = sqQuery;