var url = '/book/1/2/person/3';
var address = '/book/([^\/]+)/([^\/]+)/person/([^\/]+)';
1,2,3
var address = '/book/:id/:name/person/:address';4
//[id,name,address] id:1 name:2 address3
req.params= {id:1,name:2,address:3}
var arr = [];
address = address.replace(/:([^\/]+)/g,function () {
    arr.push(arguments[1]);
    return '([^\/]+)';
});
console.log(address);
var arr = url.match(new RegExp(address)); //匹配到的内容是从第二项开始
console.log(arr);