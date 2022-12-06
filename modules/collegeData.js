const Sequelize = require('sequelize');


var sequelize = new Sequelize(
    "rlvbllsl",
    "rlvbllsl",
    "wYM_RbOZOYJRu2-0rNNiPHeJ4t0BknCD",
    {
      host: "babar.db.elephantsql.com",
      dialect: "postgres",
      port: 5432,
      dialectOptions: {
        ssl: { rejectUnauthorized: false },
      },
      query: { raw: true },
    }
  );


  //-----------------------------------------------
  let Student = sequelize.define("Student", {
    studentNum: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING,
  });
  
  let Course = sequelize.define("Course", {
    courseId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING,
  });
  
  Course.hasMany(Student, { foreignKey: "course" });
  //-----------------------------------------------
const fs = require("fs");

class Data{
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
      sequelize
        .sync()
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject("unable to sync the database");
        });
    });
  };

    
    


module.exports.getAllStudents = function () {
    return new Promise(function(resolve, reject) {
            Student.findAll()
            .then(function(students) {
                resolve(students);
            })
            .catch(() => {
                reject("no results returned");
            });
    });
}

module.exports.getCourses = function(){
    return new Promise(function(resolve, reject) {
        Course.findAll()
        .then(function(cources) {
            resolve(cources);
        })
        .catch(() => {
            reject("no results returned");
        });
});
};

module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where:
            {
                studentNum : num
            }
        })
            .then(function (students) {
                resolve(students);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where:
            {
                courseCode: course
            }
        })
            .then(function (courses) {
                resolve(courses);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
};

module.exports.getCourseById = function (id) {
    return new Promise((resolve, reject) => {
        Course.findAll({
            where:
            {
                scourseId : id
            }
        })
            .then(function (cources) {
                resolve(cources);
            })
            .catch((err) => {
                reject("no results returned");
            });
    });
};



module.exports.updateStudent = function (StudentData) {
    return new Promise(function(resolve, reject)  {
        StudentData.TA = (StudentData.TA) ? true : false;
        for (var i in StudentData) {
            if (StudentData[i] == "") {
                StudentData[i] = null;
            }
        }
        Student.update({
            studentNum :StudentData.studentNum,
            firstName: StudentData.firstName,
            lastName: StudentData.lastName,
            email: StudentData.email,
            addressStreet: StudentData.addressStreet,
            addressCity: StudentData.addressCity,
            addressProvince: StudentData.addressProvince,
            TA: StudentData.TA,
            status: StudentData.status,
            course: StudentData.course,
        }

        
        )
        .then((students) => {
            resolve(students);
          })
          .catch(() => {
              reject("unable to updte student");
          });
    });

};
module.exports.updateCourse = function (CourseData) {
    return new Promise((resolve, reject) => {
       
        for (var i in CourseData) {
            if (CourseData[i] == "") {
                CourseData[i] = null;
            }
        }
        Course.update(
            {
                CourseId: CourseData.CourseId,
                CourseCode: CourseData.CourseCode,
                courseDescription: CourseData.courseDescription,
            },

          )
            .then(() => {
              resolve();
            })
            .catch(() => {
                reject("unable to update Course");
            })
    });
    
};
module.exports.deleteStudentByNum = function (studentNum) {
    return new Promise(function (resolve, reject) {
      Student.destroy({
        where: { studentNum: studentNum },
      })
        .then(() => {
          resolve("Destroyed");
        })
        .catch(() => {
          reject("Was rejected");
        });
    });
  };

//---------------------------------------------------------------------------------------

module.exports.addStudent = function (StudentData) {
    return new Promise(function(resolve, reject)  {
        StudentData.TA = (StudentData.TA) ? true : false;
        for (var i in StudentData) {
            if (StudentData[i] == "") {
                StudentData[i] = null;
            }
        }
        Student.create({
            studentNum :StudentData.studentNum,
            firstName: StudentData.firstName,
            lastName: StudentData.lastName,
            email: StudentData.email,
            addressStreet: StudentData.addressStreet,
            addressCity: StudentData.addressCity,
            addressProvince: StudentData.addressProvince,
            TA: StudentData.TA,
            status: StudentData.status,
            course: StudentData.course,
        },
        
        



        )
        .then((students) => {
            resolve(students);
          })
          .catch(() => {
              reject("unable to create student");
          });
    });
};

module.exports.addCourse = function (CourseData) {
    return new Promise(function(resolve, reject)  {
        for (var i in CourseData) {
            if (CourseData[i] == "") {
                CourseData[i] = null;
            }
        }
        Course.create({
            CourseId: CourseData.CourseId,
            CourseCode: CourseData.CourseCode,
            courseDescription: CourseData.courseDescription,
        })
            .then(() =>{ resolve();})
            .catch(() => reject("unable to create Course"));
    });
};
module.exports. deleteCourseById = function (id) {
    return new Promise((resolve, reject) => {
        Course.destroy({
            where: {
                programId: id
            }
        }).then(function (program) {
            resolve("destroyed");
        }).catch((err) => {
            reject(" error!");
        })
    });
}
