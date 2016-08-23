
//使用express需要将express还引入进来
var express = require('./express');
//express 是一个函数我们可以执行express函数会返回一个监听函数
var app = express();
app.listen(3000);

//get方法我们访问页面时发送的都是get请求
//param1 是请求的路径
//param2 是匹配到路径执行的回调函数

//中间件是放在路由前面的
//他的req和res 和路由中的是同一个
//中间件可以决定是否继续向下传递 next 如果不调用next方法就不继续向下执行
//中间件和路由存放在同一个数组里
//中间件可以进行模糊匹配 /user/add   /user   /u (中间件可以不写路径相当于全部匹配  /)
app.use(function (req,res,next) {
    //中间件中有三个参数 req res next
    console.log('石头');
    next();//如果不调用是不会继续向下执行的
    //如果next方法传递字符 就会触发我们的错误中间件
});
//匹配路径参数
'/book/1/2/person/3'
app.get('/book/:id/:name/person/:address',function (req,res) {
    //end方法必须放入字符串或者buffer
    res.end(JSON.stringify(req.params));//req.params装载着我们所有的路径参数组成的对象
    //{id:1,name:2,address:3}

    //params  当我们把理由放入到数组之前
    //1.我们要查看当前path是否有查询参数
    //2.如果有我们要将参数组成为一个数组，放到我们的路由对象上['id','name','address'],
    //3.要将我们的path转换为正则
    //4.当我们放问路由时取出我们的参数对应的值，与参数数组组成一个对象


})

app.get('/user/add',function (req,res) {
    res.end('zfpx home');
});


app.get('/user',function (req,res) {
    res.end('zfpx student');
});
//http动词 delete put post get options
app.post('/user',function (req,res) {
    res.end('post zfpx stundet');
});
//有时需要对所有的路径进行捕获 是用*
app.get('*',function (req,res) {
    res.end('*');
});
//如果当前是all方法，会全部的匹配
app.all('/user',function (req,res) {
    res.end('all user');
})
//可以使用命令行curl -X POST http://localhost:8080/user
//require('http').createServer(app).listen(8080);

//声明一个错误中间件，当next函数中有内容会触发，错误中间件有四个参数,一旦遇到错误会跳过所有路由和中间件
app.use(function (err,req,res,next) {
    res.end(err);
});
