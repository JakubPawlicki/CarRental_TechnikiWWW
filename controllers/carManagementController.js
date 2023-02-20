const connection = require("../database");

exports.viewAll = (req, res) => {
    connection.query("SELECT * FROM car WHERE status='available'", async (error, result) => {
        if (error)
            console.log(error);
        else {
            res.render('../views/homePage', {
                result,
                username: req.user.authenticated_user.name,
                id: req.user.authenticated_user.id
            });
            // console.log(result);
        }
    });
};

exports.viewFiltered = (req, res) => {
    console.log(req.body)
    const {category, number_of_passengers, max_price, all} = req.body;

    if (all) {
        var query = "SELECT * FROM car WHERE status='available' and price <= ? and number_of_passengers = ? and category = ?";
    } else {
        var query = "SELECT * FROM car WHERE status='available' and (price <= ? or number_of_passengers = ? or category = ?)";
    }

    connection.query(query, [max_price, number_of_passengers, category], async (error, result) => {
        if (error)
            console.log(error);
        else {
            res.render('../views/homePage', {
                result,
                username: req.user.authenticated_user.name,
                id: req.user.authenticated_user.id
            });
            // console.log(result);
        }
    });
};

exports.addCar = (req, res) => {
    console.log(req.body)
    const {registration_number, name, category, number_of_passengers, price, description} = req.body;

    const re = new RegExp("[a-zA-Z]{2,3}-\\d{5}$");

    if (!re.test(registration_number)) {
        return res.render('../views/carManagement/editCar', {
            result,
            error: "Wprowadzony numer rejestracyjny ma nieprawidłowy format",
            username: req.user.authenticated_user.name,
            id: req.user.authenticated_user.id
        })
    }

    if (name.length < 3) {
        return res.render('../views/carManagement/editCar', {
            result,
            error: "Nazwa jest za krótka",
            username: req.user.authenticated_user.name,
            id: req.user.authenticated_user.id
        })
    }

    if (number_of_passengers < 1 || number_of_passengers > 8) {
        return res.render('../views/carManagement/editCar', {
            result,
            error: "Nieprawidłowa liczba pasażerów",
            username: req.user.authenticated_user.name,
            id: req.user.authenticated_user.id
        })
    }

    if (price < 1) {
        return res.render('../views/carManagement/editCar', {
            result,
            error: "Cena nie może być ujemna",
            username: req.user.authenticated_user.name,
            id: req.user.authenticated_user.id
        })
    }

    if (category != "Normal" && category != "Premium" && category != "Luxury") {
        return res.render('../views/carManagement/editCar', {
            result,
            error: "Nieprawidłowa klasa",
            username: req.user.authenticated_user.name,
            id: req.user.authenticated_user.id
        })
    }

    connection.query("SELECT * FROM car WHERE registration_number=?", [registration_number], async (error, result) => {
        if (error)
            console.log(error);
        else if (result.length > 0) {
            return res.render('../views/carManagement/addCar', {
                error: "Samchód o podanym nr rejestracyjnym już istnieje",
                username: req.user.authenticated_user.name,
                id: req.user.authenticated_user.id
            });
        } else {
            connection.query("INSERT INTO car (registration_number, name, category, number_of_passengers,price,description) values (?,?,?,?,?,?)", [registration_number, name, category, number_of_passengers, price, description], async (error, result) => {
                if (error)
                    console.log(error);
                else {
                    res.render('../views/carManagement/addCar', {
                        message: "Pomyślnie dodano auto",
                        username: req.user.authenticated_user.name,
                        id: req.user.authenticated_user.id
                    });
                    // console.log(result);
                }
            });
        }
    });
};

exports.editCar = (req, res) => {

    connection.query("SELECT * FROM car WHERE registration_number = ?", [req.params.registration_number], async (error, result) => {
        if (error)
            console.log(error);
        else {
            res.render('../views/carManagement/editCar', {
                result,
                username: req.user.authenticated_user.name,
                id: req.user.authenticated_user.id
            });
            // console.log(result);
        }
    });
};

exports.updateCar = async (req, res) => {
    const {registration_number, name, category, number_of_passengers, price, description} = req.body;
    var rows;

    await connection.promise().query("SELECT * FROM car WHERE registration_number=?", registration_number)
        .then(([rows_r, fields]) => {
            rows = rows_r
            return;
        })
        .catch(console.log)

    const re = new RegExp("[a-zA-Z]{2,3}-\\d{5}$");

    if (!re.test(registration_number)) {
        return res.render('../views/carManagement/editCar', {
            result: rows,
            error: "Wprowadzony numer rejestracyjny ma nieprawidłowy format",
            username: req.user.authenticated_user.name,
            id: req.user.authenticated_user.id
        })
    }

    if (name.length < 3) {
        return res.render('../views/carManagement/editCar', {
            result: rows,
            error: "Nazwa jest za krótka",
            username: req.user.authenticated_user.name,
            id: req.user.authenticated_user.id
        })
    }

    if (number_of_passengers < 1 || number_of_passengers > 8) {
        return res.render('../views/carManagement/editCar', {
            result: rows,
            error: "Nieprawidłowa liczba pasażerów",
            username: req.user.authenticated_user.name,
            id: req.user.authenticated_user.id
        })
    }

    if (price < 1) {
        return res.render('../views/carManagement/editCar', {
            result: rows,
            error: "Cena nie może być ujemna",
            username: req.user.authenticated_user.name,
            id: req.user.authenticated_user.id
        })
    }

    if (category != "Normal" && category != "Premium" && category != "Luxury") {
        return res.render('../views/carManagement/editCar', {
            result: rows,
            error: "Nieprawidłowa klasa",
            username: req.user.authenticated_user.name,
            id: req.user.authenticated_user.id
        })
    }

    connection.query("UPDATE car SET registration_number=?, name = ?, category=?, number_of_passengers = ?, price = ?,description = ? WHERE registration_number = ?", [registration_number, name, category, number_of_passengers, price, description, req.params.registration_number], async (error, result) => {
        if (error)
            console.log(error);
        else {
            connection.query("SELECT * FROM car WHERE registration_number = ?", [req.params.registration_number], async (error, result) => {
                if (error)
                    console.log(error);
                else {
                    res.render('../views/carManagement/editCar', {
                        result,
                        message: "Pomyślnie edytowano samochód",
                        username: req.user.authenticated_user.name,
                        id: req.user.authenticated_user.id
                    });
                }
            });
        }
    });
};

exports.rentCarForm = (req, res) => {
    res.render('../views/carManagement/rentCar', {
        username: req.user.authenticated_user.name,
        id: req.user.authenticated_user.id
    })
};

exports.rentCar = (req, res) => {
    const {end_date, first_name, last_name, document_number} = req.body;

    if (first_name.length < 3) {
        return res.render('../views/carManagement/rentCar', {
            error: "Imię jest za krótkie",
            username: req.user.authenticated_user.name,
            id: req.user.authenticated_user.id
        })
    }

    if (last_name.length < 3) {
        return res.render('../views/carManagement/rentCar', {
            error: "Nazwisko jest za krótkie",
            username: req.user.authenticated_user.name,
            id: req.user.authenticated_user.id
        })
    }

    const re = new RegExp("[a-zA-Z]{3}\\d{3}$");

    if (!re.test(document_number)) {
        return res.render('../views/carManagement/rentCar', {
            error: "Wprowadzona seria dowodu osobistego ma nieprawidłowy format",
            username: req.user.authenticated_user.name,
            id: req.user.authenticated_user.id
        })
    }

    const date = new Date();

    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();

    let currentDate = `${year}-${month}-${day}`;


    connection.beginTransaction((err) => {
        if (err) {
            throw err;
        }

        connection.query("SELECT * FROM rents WHERE registration_number = ? and active=1", [req.params.registration_number], async (error, result) => {
            if (error)
                console.log(error);
            else if (result.length > 0) {
                connection.rollback(function () {
                });

                return res.render('../views/carManagement/rentCar', {
                    error: "Ten samochód jest już wypożyczony",
                    username: req.user.authenticated_user.name,
                    id: req.user.authenticated_user.id
                });
            }
        });

        connection.query("INSERT INTO rents (start_date,end_date,first_name,last_name,document_number,registration_number) values (?,?,?,?,?,?)", [currentDate, end_date, first_name, last_name, document_number, req.params.registration_number], (err, result) => function (err, result) {
            if (err) {
                connection.rollback(function () {
                    throw err;
                });
            }
        });

        connection.query('UPDATE car SET status="inaccessible" WHERE registration_number=? ', req.params.registration_number, (err, result) => {
            if (err) {
                connection.rollback(function () {
                    throw err;
                });
            }
            connection.commit(function (err) {
                if (err) {
                    connection.rollback(function () {
                        throw err;
                    });
                }
                res.render('../views/carManagement/rentCar', {
                    message: "Pomyślnie wypożyczono auto",
                    username: req.user.authenticated_user.name,
                    id: req.user.authenticated_user.id
                });
            });
        });
    });
};

exports.rentList = (req, res) => {

    connection.query("SELECT * FROM car NATURAL JOIN rents WHERE active=1", async (error, result) => {
        if (error)
            console.log(error);
        else {
            res.render('../views/carManagement/rentList', {
                result,
                username: req.user.authenticated_user.name,
                id: req.user.authenticated_user.id
            });
            // console.log(result);
        }
    });
};

exports.rentListFiltered = (req, res) => {
    const {registration_number} = req.body;

    const re = new RegExp("[a-zA-Z]{2,3}-\\d{5}$");

    if (!re.test(registration_number)) {
        return res.render('../views/carManagement/rentList', {
            error: "Wprowadzony numer rejestracyjny ma nieprawidłowy format",
            username: req.user.authenticated_user.name,
            id: req.user.authenticated_user.id
        })
    }

    connection.query("SELECT * FROM car NATURAL JOIN rents WHERE active=1 and registration_number=?", [registration_number], async (error, result) => {
        if (error)
            console.log(error);
        else {
            res.render('../views/carManagement/rentList', {
                result,
                username: req.user.authenticated_user.name,
                id: req.user.authenticated_user.id
            });
            // console.log(result);
        }
    });
};

exports.returnCar = (req, res) => {
    connection.beginTransaction((err) => {
        if (err) {
            throw err;
        }
        connection.query('UPDATE car SET status="available" WHERE registration_number=?', [req.params.registration_number], (err, result) => function (err, result) {
            if (err) {
                connection.rollback(function () {
                    throw err;
                });
            }
        });

        connection.query('UPDATE rents SET active=0 WHERE registration_number=? and active=1 ', req.params.registration_number, (err, result) => {
            if (err) {
                connection.rollback(function () {
                    throw err;
                });
            }
            connection.commit(function (err) {
                if (err) {
                    connection.rollback(function () {
                        throw err;
                    });
                }
                connection.query("SELECT * FROM car NATURAL JOIN rents WHERE active=1", async (error, result) => {
                    if (error)
                        console.log(error);
                    else {
                        res.render('../views/carManagement/rentList', {
                            result,
                            message: "Pomyślnie zwrócono samochód",
                            username: req.user.authenticated_user.name,
                            id: req.user.authenticated_user.id
                        });
                        // console.log(result);
                    }
                });
            });
        });
    });
};

exports.deleteRent = (req, res) => {
    connection.query('SELECT id FROM rents WHERE registration_number=? and active=1', [req.params.registration_number], async (error, result) => {
        if (error)
            console.log(error);
        else if (result.length == 0) {
            connection.query("SELECT * FROM car NATURAL JOIN rents WHERE active=1", async (error, result) => {
                if (error)
                    console.log(error);
                else {
                    res.render('../views/carManagement/rentList', {
                        result,
                        error: "Nie istnieje takie wypożyczenie",
                        username: req.user.authenticated_user.name,
                        id: req.user.authenticated_user.id
                    });
                    // console.log(result);
                }
            });
        } else {
            const id_to_delete = result.at(-1).id;

            connection.beginTransaction((err) => {
                if (err) {
                    throw err;
                }
                connection.query("DELETE FROM rents WHERE id=? ", [id_to_delete], (err, result) => function (err, result) {
                    if (err) {
                        connection.rollback(function () {
                            throw err;
                        });
                    }
                });

                connection.query('UPDATE car SET status="available" WHERE registration_number=? ', req.params.registration_number, (err, result) => {
                    if (err) {
                        connection.rollback(function () {
                            throw err;
                        });
                    }
                    connection.commit(function (err) {
                        if (err) {
                            connection.rollback(function () {
                                throw err;
                            });
                        }
                        connection.query("SELECT * FROM car NATURAL JOIN rents WHERE active=1", async (error, result) => {
                            if (error)
                                console.log(error);
                            else {
                                res.render('../views/carManagement/rentList', {
                                    result,
                                    message: "Pomyślnie anulowano wypożyczenie",
                                    username: req.user.authenticated_user.name,
                                    id: req.user.authenticated_user.id
                                });
                                // console.log(result);
                            }
                        });
                    });
                });
            });
        }
    });
};

exports.carHistory = (req, res) => {
    connection.query("SELECT * FROM car NATURAL JOIN rents WHERE registration_number=?", [req.params.registration_number], async (error, result) => {
        if (error)
            console.log(error);
        else {
            res.render('../views/carManagement/carHistory', {
                result,
                username: req.user.authenticated_user.name,
                id: req.user.authenticated_user.id
            });
            // console.log(result);
        }
    });
};

exports.carInfo = (req, res) => {

    connection.query("SELECT * FROM car WHERE registration_number = ?", [req.params.registration_number], async (error, result) => {
        if (error)
            console.log(error);
        else {
            res.render('../views/carManagement/carInfo', {
                result,
                username: req.user.authenticated_user.name,
                id: req.user.authenticated_user.id
            });
            // console.log(result);
        }
    });
};