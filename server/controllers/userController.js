const mysql = require('mysql');

// Connection Pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true
});




// View users
exports.view = (req, res) => {

    //Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID ' + connection.threadId);

        //Use the connection
        connection.query(['SELECT * FROM user WHERE status="active"',
            'SELECT GROUP_CONCAT(firstName) as listaName FROM user WHERE status="active"'].join(';'), (err, rowsy) => {
                //When done with the connection release it
                connection.release();
                if (!err) {
                    let paloter ="tus muelas";
                    // res.send("vamo que nos vamo");
                    res.render('home', {palote:paloter, rows: rowsy[0], names:rowsy[1][0].listaName });
                    // , rows: rows[0], names: rows[1][0].listaName });
                    //de esta forma podemos enviar multiple queries al render
                    // muy interesante
                    // para hacerlo hay que poner arriba en el connection pool la propiedad multipleStatements en true
                    // y enviar un array de queries
                    // tb ser puede hacer con funciones anidadas. ver StackOverFlow

                } else {
                    console.log(err)
                }
                console.log('The data from table: /n', rowsy);
                console.log('The data from second table: /n', rowsy[1][0].listaName );
            });
    });

};


exports.add = (req, res) => {
    console.log("fsñldkfalñkdjsf");
};


exports.addUserForm = (req, res) => {
    console.log("estamos en addUserForm");
    res.render('add-user');
};




//search Users
exports.find = (req, res) => {
    var searchText = req.body.search;

    //Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID ' + connection.threadId);

        //Use the connection
        console.log("el texto de busqueda es: ", searchText);
        let insertQuery = 'SELECT * FROM user WHERE status="active" AND (firstName LIKE ? OR lastName LIKE ?)';
        let mysqlSearch = '%' + searchText + '%';
        let query = mysql.format(insertQuery, [mysqlSearch, mysqlSearch]);
        console.log(query);

        connection.query(query, (err, rows) => {
            //When done with the connection release it
            connection.release();
            if (!err) {
                res.render('home', { rows })
            } else {
                console.log(err)
            }

        });
    });

}




//Add new User
exports.createUser = (req, res) => {
    const { firstName, lastName, email, phone, comments } = req.body;
    // res.render('add-user');
    //Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID ' + connection.threadId);

        //Use the connection

        let insertQuery = 'INSERT INTO user (firstName, lastName, email, phone, comments) VALUES (?, ?, ?, ?, ? )';

        let query = mysql.format(insertQuery, [firstName, lastName, email, phone, comments]);
        console.log(query);

        connection.query(query, (err, rows) => {
            //When done with the connection release it
            connection.release();
            if (!err) {
                res.render('add-user', { alert: "User created successfully" })
            } else {
                console.log(err)
            }

        });
    });

}

//edit user
exports.edit = (req, res) => {
        //Connect to DB

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID ' + connection.threadId);
        //Use the connection
        // console.log("el id de busqueda es: ", req.params.id);
        let insertQuery = 'SELECT * FROM user WHERE id = ?';
        let mysqlID = req.params.id;
        // let query = mysql.format(insertQuery,mysqlID);
        // console.log(query);

        connection.query(insertQuery,mysqlID, (err, rows) => {
            //When done with the connection release it
            connection.release();
            console.log(rows);
            if (!err) {
                res.render('edit-user', { rows })
            } else {
                console.log(err)
            }

        });
    });
}



//Update User
exports.update = (req, res) => {
    let id = req.params.id;
    const { firstName, lastName, email, phone, comments } = req.body;
    // res.render('add-user');
    //Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID ' + connection.threadId);

        //Use the connection



        let updateQuery = 'UPDATE user SET firstName = ? , lastName = ? , email = ?, phone = ? , comments = ? WHERE id = ? LIMIT 1 '    
        let query = mysql.format(updateQuery, [firstName, lastName, email, phone, comments, id]);
        console.log(query);

        connection.query(query, (err, rows) => {
            //When done with the connection release it
            connection.release();
            if (!err) {
               


                pool.getConnection((err, connection) => {
                    if (err) throw err;
                    console.log('Connected as ID ' + connection.threadId);
                    //Use the connection
                    // console.log("el id de busqueda es: ", req.params.id);
                    let insertQuery = 'SELECT * FROM user WHERE id = ?';
                    let mysqlID = req.params.id;
                    // let query = mysql.format(insertQuery,mysqlID);
                    // console.log(query);
            
                    connection.query(insertQuery,mysqlID, (err, rows) => {
                        //When done with the connection release it
                        connection.release();
                        console.log(rows);
                        if (!err) {
                            res.render('edit-user', { rows, alert:`${firstName} has been updated.` })
                        } else {
                            console.log(err)
                        }
            
                    });
                });






            } else {
                console.log(err)
            }

        });
    });

}




//delete user
exports.delete = (req, res) => {
    //Connect to DB

pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Connected as ID ' + connection.threadId);
    //Use the connection
    // console.log("el id de busqueda es: ", req.params.id);
    let insertQuery = 'UPDATE user SET status = ? WHERE id = ?';
    let mysqlID = ["removed", req.params.id];
    // let query = mysql.format(insertQuery,mysqlID);
    // console.log(query);

    connection.query(insertQuery,mysqlID, (err, rows) => {
        //When done with the connection release it
        connection.release();
        console.log(rows);
        if (!err) {
            res.redirect('/');
            // res.render('home', { rows })
        } else {
            console.log(err)
        }

    });
});
};



// viewall

exports.viewall = (req, res) => {

    //Connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID ' + connection.threadId);

        //Use the connection
        connection.query('SELECT * FROM user WHERE id = ?',[req.params.id], (err, rows) => {
                //When done with the connection release it
                connection.release();
                if (!err) {
                    res.render('view-user', {rows});

                } else {
                    console.log(err)
                }
                console.log('The data from table: /n', rows);
            });
    });

};