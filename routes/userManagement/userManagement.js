const express = require('express');
const authController = require('../../controllers/authController');
const accountController = require('../../controllers/accountController');

const router = express.Router();

router.get('/settings/:id', authController.checkAuthenticated, accountController.getUserData);
router.post('/settings/:id', authController.checkAuthenticated, accountController.changeUserData);

router.get('/settings/delete/:id', authController.checkAuthenticated, accountController.deleteAccountForm);
router.post('/settings/delete/:id', authController.checkAuthenticated, accountController.deleteAccount);

router.post('/register', authController.checkLoggedIn, accountController.createAccount);



module.exports = router;

