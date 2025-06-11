const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/courses.db")

db.serialize(() => {
    db.run("DROP TABLE IF EXISTS courses;")

    db.run(`
        CREATE TABLE courses(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            Coursecode TEXT NOT NULL,
            Coursename TEXT NOT NULL,
            Syllabus   TEXT NOT NULL,
            Progression TEXT NOT NULL      
        );
    `)
})

db.close();