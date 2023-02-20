const mysql = require('mysql2');
require('dotenv').config()

var connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
});


connection.connect(function (err) {
    if (err) throw err;
    connection.query("CREATE TABLE IF NOT EXISTS `user` (`user_id` INT NOT NULL AUTO_INCREMENT,`user_name` VARCHAR(45) NOT NULL,`user_surname` VARCHAR(45) NOT NULL,`user_email` VARCHAR(50) NOT NULL,`user_password` VARCHAR(32) NOT NULL, PRIMARY KEY (`user_id`))", function (err, result) {
        if (err) throw err;
    });

    connection.query("CREATE TABLE IF NOT EXISTS `car` (\n" +
        "        `registration_number` VARCHAR(45) NOT NULL,\n" +
        "        `name` VARCHAR(45) NOT NULL,\n" +
        "        `category` VARCHAR(45) NOT NULL,\n" +
        "        `number_of_passengers` TINYINT(2) NOT NULL,\n" +
        "        `price` TINYINT(2) NOT NULL,\n" +
        "        `description` INT NULL,\n" +
        "        `status` VARCHAR(45) NOT NULL DEFAULT 'available',\n" +
        "        PRIMARY KEY (`registration_number`))", function (err, result) {
        if (err) throw err;
    });
    connection.query("CREATE TABLE IF NOT EXISTS `rents` (`id` INT NOT NULL AUTO_INCREMENT,`start_date` DATE NOT NULL,`end_date` DATE NOT NULL,`first_name` VARCHAR(45) NOT NULL,`last_name` VARCHAR(45) NOT NULL,`document_number` VARCHAR(45) NOT NULL,`registration_number` VARCHAR(45) NOT NULL,`active` TINYINT NOT NULL DEFAULT 1,PRIMARY KEY (`id`) )", function (err, result) {
        if (err) throw err;
    });
});

module.exports = connection;

