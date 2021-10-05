
var express = require('express');
var path = require('path');
var fs = require('fs');
const { json } = require('body-parser');
const { table } = require('console');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
var app = express();
var session = require('express-session');

var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;



// session creation
app.use(session({
secret: 'BOOKS_SECRET',
resave: false,
saveUninitialized: true,
cookie: { secure: true }
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// get methods
var ssn;
app.get('/',function(req,res){
  ssn=req.session;
  var { session_username } = ssn; 
  res.render('login',{ invalid_login:"", empty:""})
});

app.get('/home',function(req,res){
  res.render('home')
});

app.get('/dune',function(req,res){
  res.render('dune',{Book_added:""})
});

app.get('/fiction',function(req,res){
  res.render('fiction')
});

app.get('/flies',function(req,res){
  res.render('flies',{Book_added:""})
});

app.get('/grapes',function(req,res){
  res.render('grapes',{Book_added:""})
});

app.get('/leaves',function(req,res){
  res.render('leaves',{Book_added:""})
});

app.get('/mockingbird',function(req,res){
  res.render('mockingbird',{Book_added:""})
});

app.get('/novel',function(req,res){
  res.render('novel')
});

app.get('/poetry',function(req,res){
  res.render('poetry')
});



app.get('/registration',function(req,res){
  res.render('registration',{ invalid_username:"", empty:""});
});


app.get('/searchresults',function(req,res){
  res.render('searchresults',{data:ssn.session_searchlist,noSearchResult:""});
});

app.get('/search',function(req,res){
  res.render('searchresults',{data:ssn.session_searchlist,noSearchResult:""})
});

app.get('/sun',function(req,res){
  res.render('sun',{Book_added:""})
});

app.get('/ReadListFlies',function(req,res){
  res.render('flies',{Book_added:""})
});

app.get('/ReadListDune',function(req,res){
  res.render('dune',{Book_added:""})
});

app.get('/ReadListGrapes',function(req,res){
  res.render('grapes',{Book_added:""})
});

app.get('/ReadListLeaves',function(req,res){
  res.render('leaves',{Book_added:""})
});

app.get('/ReadListMockingbird',function(req,res){
  res.render('mockingbird',{Book_added:""})
});

app.get('/ReadListSun',function(req,res){
  res.render('sun',{Book_added:""})
});

// ----------------------

//post methods :

//post of login
app.post('/',function(req,res){
  var data = fs.readFileSync("users.json");
  var users_obj = JSON.parse(data);
  var username = req.body.username;
  var password = req.body.password;
  var search_list = new Array();
  var flag = 0;

  if(username.length==0 || password.length==0){
    res.render('login',{invalid_login:"", empty:"Please enter both username and password"})
  }
  else{
    for(var i = 0; i<users_obj.users.length; i++){
      if(users_obj.users[i].username == username && users_obj.users[i].password == password){
        flag = 1;
        var readlist = users_obj.users[i].read_list;
        break;
      }
    }
    if(flag == 1){
      // assigning variables in the session
      ssn.session_username = username;
      ssn.session_readlist = readlist;
      ssn.session_searchlist = search_list;
      res.redirect('home');
    }
    else{
      res.render('login',{invalid_login:"Username or password is incorrect", empty:""})
    }
  }
});


// post of registeration 
app.post('/register', function(req, res){
  var data = fs.readFileSync("users.json");
  var users_obj = JSON.parse(data);
  var username = req.body.username;
  var password = req.body.password;
  var read_list = new Array();
  var flag = 0;
  if(username.length==0 || password.length==0){
    res.render('registration',{invalid_username:"", empty:"Empty username or password"})
  }
  else{
  for(var i = 0; i<users_obj.users.length; i++){
    if(users_obj.users[i].username == username){
      res.render('registration',{invalid_username:"This username is already taken", empty:""})
      flag = 1;
      break;
    }
  }
  if(flag == 0){
    users_obj.users.push({username: username, password: password, read_list: read_list});
    var user_str = JSON.stringify(users_obj);
    fs.writeFileSync("users.json", user_str);
    res.redirect('/');
  }
}
});

// get of Read List
app.get('/readList',function(req,res){
  // if session expired redirect to login
  if(ssn == undefined){
    res.redirect('/')
  }
  else{

  var data = fs.readFileSync("users.json");
  var users_obj = JSON.parse(data);
  var flag=true;
  for(var i = 0; i<users_obj.users.length; i++){
    if(users_obj.users[i].username === ssn.session_username){ 
      var arr = users_obj.users[i].read_list;  
      console.log(arr);
      res.render('readlist', {data:arr})
      flag=false;
      }

    }
    if(flag){
      res.render('readlist', {data:[]})
    }
    
  }
});


// post of flies
app.post('/ReadListFlies',function(req,res){
   // if session expired redirect to login
   if(ssn == undefined){
    res.redirect('/')
  }
  else{

  var data = fs.readFileSync("users.json");
  var users_obj = JSON.parse(data);
  var flag = 0 ;
  for(var i = 0; i<users_obj.users.length; i++){
    if(users_obj.users[i].username == ssn.session_username){
      for(var j=0; j<users_obj.users[i].read_list.length ; j++){
        if(users_obj.users[i].read_list[j]=='flies'){
          flag=1;
          break
        }
      }
      if(flag==0){
        users_obj.users[i].read_list.push('flies');
        var user_str = JSON.stringify(users_obj);
        fs.writeFileSync("users.json", user_str);
        res.render('flies',{Book_added:"Book Added Successfully"})
      }
      else{
        // add error message to user
        res.render('flies',{Book_added:"Book already added"})
        
      }
    }
  }
  }
});

// post of grapes
app.post('/ReadListGrapes',function(req,res){
  // if session expired redirect to login
  if(ssn == undefined){
    res.redirect('/')
  }
  else{

  var data = fs.readFileSync("users.json");
  var users_obj = JSON.parse(data);
  var flag = 0 ;
  for(var i = 0; i<users_obj.users.length; i++){
    if(users_obj.users[i].username == ssn.session_username){
      for(var j=0; j<users_obj.users[i].read_list.length ; j++){
        if(users_obj.users[i].read_list[j]=='grapes'){
          flag=1;
          break
        }
      }
      if(flag==0){
        users_obj.users[i].read_list.push('grapes');
        var user_str = JSON.stringify(users_obj);
        fs.writeFileSync("users.json", user_str);
        res.render('grapes',{Book_added:"Book Added Successfully"})
      }
      else{
        res.render('grapes',{Book_added:"Book already added"})
      }
    }
  }
}
});

// post of leaves
app.post('/ReadListLeaves',function(req,res){
  // if session expired redirect to login
  if(ssn == undefined){
    res.redirect('/')
  }
  else{

  var data = fs.readFileSync("users.json");
  var users_obj = JSON.parse(data);
  var flag = 0 ;
  for(var i = 0; i<users_obj.users.length; i++){
    if(users_obj.users[i].username == ssn.session_username){
      for(var j=0; j<users_obj.users[i].read_list.length ; j++){
        if(users_obj.users[i].read_list[j]=='leaves'){
          flag=1;
          break
        }
      }
      if(flag==0){
        users_obj.users[i].read_list.push('leaves');
        var user_str = JSON.stringify(users_obj);
        fs.writeFileSync("users.json", user_str);
        res.render('leaves',{Book_added:"Book Added Successfully"})
      }
      else{

        res.render('leaves',{Book_added:"Book already added"})
      }
    }
  }
}
});

// post of Sun
app.post('/ReadListSun',function(req,res){
  // if session expired redirect to login
  if(ssn == undefined){
    res.redirect('/')
  }
  else{

  var data = fs.readFileSync("users.json");
  var users_obj = JSON.parse(data);
  var flag = 0 ;
  for(var i = 0; i<users_obj.users.length; i++){
    if(users_obj.users[i].username == ssn.session_username){
      for(var j=0; j<users_obj.users[i].read_list.length ; j++){
        if(users_obj.users[i].read_list[j]=='sun'){
          flag=1;
          break
        }
      }
      if(flag==0){
        users_obj.users[i].read_list.push('sun');
        var user_str = JSON.stringify(users_obj);
        fs.writeFileSync("users.json", user_str);
        res.render('sun',{Book_added:"Book Added Successfully"})
      }
      else{
        res.render('sun',{Book_added:"Book already added"})
      }
    }
  }
}
});

// post of Dune
app.post('/ReadListDune',function(req,res){
  // if session expired redirect to login
  if(ssn == undefined){
    res.redirect('/')
  }
  else{

  var data = fs.readFileSync("users.json");
  var users_obj = JSON.parse(data);
  var flag = 0 ;
  for(var i = 0; i<users_obj.users.length; i++){
    if(users_obj.users[i].username == ssn.session_username){
      for(var j=0; j<users_obj.users[i].read_list.length ; j++){
        if(users_obj.users[i].read_list[j]=='dune'){
          flag=1;
          break
        }
      }
      if(flag==0){
        users_obj.users[i].read_list.push('dune');
        var user_str = JSON.stringify(users_obj);
        fs.writeFileSync("users.json", user_str);
        res.render('dune',{Book_added:"Book Added Successfully"})
      }
      else{
        res.render('dune',{Book_added:"Book already added"})
      }
    }
  }
}
});

// post of Mockingbird
app.post('/ReadListMockingbird',function(req,res){
  // if session expired redirect to login
  if(ssn == undefined){
    res.redirect('/')
  }
  else{

  var data = fs.readFileSync("users.json");
  var users_obj = JSON.parse(data);
  var flag = 0 ;
  for(var i = 0; i<users_obj.users.length; i++){
    if(users_obj.users[i].username == ssn.session_username){
      for(var j=0; j<users_obj.users[i].read_list.length ; j++){
        if(users_obj.users[i].read_list[j]=='mockingbird'){
          flag=1;
          break
        }
      }
      if(flag==0){
        users_obj.users[i].read_list.push('mockingbird');
        var user_str = JSON.stringify(users_obj);
        fs.writeFileSync("users.json", user_str);
        res.render('mockingbird',{Book_added:"Book Added Successfully"})
      }
      else{
        res.render('mockingbird',{Book_added:"Book already added"})
      }
    }
  }
}
});

// post of search
app.post('/search',function(req,res){
   // if session expired redirect to login
   if(ssn == undefined){
    res.redirect('/')
  }
  else{
    ssn.session_searchlist = [];
    console.log(ssn);

  var user_input = req.body.Search;
  user_input = user_input.toLowerCase();
  var str1 = "lord of the flies";
  var str2 = "the grapes of wrath"
  var str3 = "leaves of grass"
  var str4 = "the sun of her flowers"
  var str5 = "dune"
  var str6 = "to kill a mockingbird"
  
  if(str1.includes(user_input)){
    ssn.session_searchlist.push(str1);
  }

  if(str2.includes(user_input)){
     ssn.session_searchlist.push(str2);
  }

  if(str3.includes(user_input)){
    ssn.session_searchlist.push(str3);
  }

  if(str4.includes(user_input)){
    ssn.session_searchlist.push(str4);
  }

  if(str5.includes(user_input)){
    ssn.session_searchlist.push(str5);
  }

  if(str6.includes(user_input)){
    ssn.session_searchlist.push(str6);
  }

  if(ssn.session_searchlist.length==0){
    res.render('searchresults',{data:ssn.session_searchlist,noSearchResult:"No Search Result"});
    
  }
  else{
    res.render('searchresults',{data:ssn.session_searchlist,noSearchResult:""});
  }


  }
});


if (process.env.PORT) {
  app.listen (process.env.PORT, function () {console.log ('Server started')});
}

else {
  app.listen (3000, function () {console.log ('Server started on port 3000')});
}

