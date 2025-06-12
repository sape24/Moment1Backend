const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/courses.db")

db.serialize(() => {                             //Kör följande databasanrop i rad, först en DROP för att ta bort tabellen courses om den redan existerar sedan skapar den tabellen med definitioner som till exempel primärnyckel på ID och text för coursecode
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