var express = function () {
    //app是我们的监听函数里面包含着请求和响应
    var app = function(req,res) {
        //先要获得请求的方法
        var method = req.method.toLowerCase();
        //还要获得请求的路径
        var urlObj = require('url').parse(req.url,true);
        var pathname = urlObj.pathname;
        // 当前的route就是匹配的那一项
        //find方法如果返回true就会将当前的那一项进行返回

        //现在要判断是中间件还是路由
        //我们要先取出一个路由 取出数组的第一项
        var index = 0;
        next();
        function next(err) {
            //当前的route代表数组的第一项看当前的路由是中间件还是路由

            if(index>=app.routes.length){
                return res.end(`Cannot ${method} ${pathname}`);
            }
           var route =  app.routes[index++];
            if(err){
                //如果有错误，我们需要拿出当前route看是否是中间件，并且参数是不是4个
                if(route.method=='middleware'&&route.fn.length==4){
                    route.fn(err,req,res,next);
                }else{
                    next(err);//如果有错误了 还要将错误继续向下传递，直到找到错误中间件为止
                }
            }else{
                if(route.method=='middleware'){
                    //这是中间件
                    //判断当前的路径是否可以匹配到，匹配到后执行中间件
                    if(route.path =='/'||route.path==pathname||pathname.startsWith(route.path+'/')){
                        route.fn(req,res,next);//如果用户调用next会继续向下执行
                    }else{
                        next();
                    }
                }else{
                    //这是路由
                    if(route.params){
                        //是查询的路由
                        //我们需要将当前请求路径和我们存放的路由的path进行匹配，如果匹配到表示执行当前的函数，就创建一个对象把params挂在req上
                        var arr = pathname.match(new RegExp(route.path));
                        if(arr){
                            //arr包含着所有的内容
                            var obj = {};//组成查询参数对象
                            for(var i = 0;i<route.params.length;i++){
                                obj[route.params[i]] = arr[i+1];
                            }
                            req.params = obj;
                            route.fn(req,res);
                        }else{
                            next();
                        }



                    }else{
                        if((route.path==pathname||route.path=='*')&&(route.method==method||route.method=='all')){
                            route.fn(req,res);
                        }else{
                            next();
                        }
                    }
                }
            }

        }
        
        





        /*var route = app.routes.find(function (item) {
            return (item.path==pathname||item.path=='*')&&(item.method==method||item.method=='all');
        });
        if(route){
            //找到后执行当前路由对应的函数
            route.fn(req,res);
        }else{
            //找不到相应找不到
            res.end(`Cannot ${method} ${pathname}`);
        }*/
    };
    app.listen = function (port) {
        require('http').createServer(app).listen(port);
    };

    //我们调用get方法后会添加新的路由，构造出一个数组，存放所有路由
    app.routes = []; //存放所有路由
    app.use = function (path,fn) {
        //判断path是否传递
        if(typeof fn != 'function'){
            fn = path;
            path = '/';
        }
        //自定义个method  叫middleware 就代表中间件
        var config = {method:'middleware',path:path,fn:fn};
        app.routes.push(config);
    };
    //构建一个方法的集合
    var methods = ['get','post','delete','put','all'];
    methods.forEach(function (method) {
        app[method] = function (path,fn) {
            //每调用一次get方法就会像数组中存放
            var config = {method:method,path:path,fn:fn};
            if(path.includes(':')){ //是否包含:
                //带有参数的路由
                var arr = [];
                //将path用正则进行替换
                config.path = path.replace(/:([^\/]+)/g,function () {
                    arr.push(arguments[1]);
                    return '([^\/]+)';
                });
                //增加查询数组
                config.params = arr;
            }
            app.routes.push(config);
            //当我们触发监听函数时在当前数组下查找，查找到方法和路径都匹配的执行他的对应的回调函数
        };
    });
    return app;

};




module.exports = express;