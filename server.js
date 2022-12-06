
const express = require("express");

const exphbs = require("express-handlebars");
const data = require("./modules/collegeData.js");
const app = express();

const clientSessions = require("client-sessions");
const HTTP_PORT = process.env.PORT || 8080;




app.engine('.hbs', exphbs.engine({ 
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }        
    }
}));

app.set('view engine', '.hbs');



app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});



app.use(
    clientSessions({
      cookieName: "session",
      secret: "assignment_eldar",
      duration: 25 * 60 * 1000,
      activeDuration: 15 * 60 * 1000,
    })
  );

const user = {
    username: "sampleuser",
    password: "samplepassword",
  };


  function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("login");
    } else {
      next();
    }
  }



app.get("/", (req,res) => {
    res.redirect("login");
});
app.get("/login", function(req, res) {
    res.render("login");
  });

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(username === "" || password === "") {
        // Render 'missing credentials'
        return res.render("login", { errorMsg: "Missing credentials."});
      }
      if(username === user.username && password === user.password){

        // Add the user on the session and redirect them to the dashboard page.
        req.session.user = {
          username: user.username,
        };
    
        res.redirect("home");
      }
      else {
        // render 'invalid username or password'
        res.render("login", { errorMsg: "invalid username or password!"});
      }

  });






app.get("/logout", function (req, res) {
    req.session.reset();
    res.redirect("login");
  });











  















  app.get("/home", ensureLogin, (req,res) => {
    res.render("home");
});


app.get("/about", ensureLogin, (req,res) => {
    res.render("about");
});

app.get("/htmlDemo", ensureLogin, (req,res) => {
    res.render("htmlDemo");
});

app.get("/students", ensureLogin, (req, res) => {
    if (req.query.course) {
        data.getStudentsByCourse(req.query.course).then((data) => {
            if (data.length > 0){
            res.render("students", {students: data});
            }
            else{res.render("students", {message: "no results"});}
        }).catch((err) => {res.render("students", { message: "no results" });});
    } 
    else {
        data.getAllStudents().then((data) => {
            if (data.length > 0){
            res.render("students", {students: data});
        }
        else{ res.render("students", {message: "no results"});}})    

        .catch((err) => {res.render("students", {message: "no results"});


   });
}

});



app.get("/students/add", ensureLogin, (req,res) => {
    data
    .getCourses()
    .then((data) => {
      res.render("addStudent", { courses: data });
    })
    .catch(() => {
      res.render("addStudent", { courses: [] });
    });
});


app.post("/students/add", ensureLogin, (req, res) => {
    data.addStudent(req.body).then(()=>{
      res.redirect("/students");
    });
  });

  app.get("/student/:studentNum", ensureLogin, (req, res) => {
    
    let viewData = {};
    data
      .getStudentByNum(req.params.studentNum)
      .then((data) => {
        if (data) {
          viewData.student = data; 
        } else {
          viewData.student = null;
        }
      })
      .catch(() => {
        viewData.student = null; 
      })
      .then(data.getCourses)
      .then((data) => {
        viewData.courses = data; 
      
        for (let i = 0; i < viewData.courses.length; i++) {
          if (viewData.courses[i].courseId == viewData.student.course) {
            viewData.courses[i].selected = true;
          }
        }
      })
      .catch(() => {
        viewData.courses = []; 
      })
      .then(() => {
        if (viewData.student == null) {
        
          res.status(404).send("Student Not Found");
        } else {
          res.render("student", { viewData: viewData }); 
        }
      });
  });









app.post("/student/update", ensureLogin, (req, res) => {
    data.updateStudent(req.body).then(()=>{
      res.redirect("/students");
    });
  });









app.get("/courses", ensureLogin, (req,res) => {
    data.getCourses().then((data)=>{
        res.render("courses", {courses: data});
    }).catch(err=>{
        res.render("courses", {message: "no results"});
    });
});

app.get("/course/:id", ensureLogin, (req, res) => {
    data.getCourseById(req.params.id).then((data) => {
        res.render("course", { course: data }); 
    }).catch((err) => {
        res.render("course",{message:"no results"}); 
    });
});

app.use((req,res)=>{
    res.status(404).send("Page Not Found");
});




data
  .initialize()
  .then(function () {
    app.listen(HTTP_PORT, function () {
      console.log("app listening on: " + HTTP_PORT);
    });
  })
  .catch(function (err) {
    console.log("unable to start server: " + err);
  });

  app.get("/course/delete/:id", ensureLogin, (req, res) => {
    data
      .deleteCourseById(req.params.id)
      .then(() => {
        res.redirect("/courses");
      })
      .catch(() => {
        res.status(500).send("Unable to Remove Course/Course not found");
      });
  });
  app.use((req, res) => {
    res.status(404).send("Page Not Found");
  });


//-------------------------------------------------------------------------------------------login



