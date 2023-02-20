const express = require('express');
const authController = require('../../controllers/authController');
const carController = require('../../controllers/carManagementController');
const router = express.Router();


router.get('/', authController.checkAuthenticated, carController.viewAll);
router.post('/', authController.checkAuthenticated, carController.viewFiltered);

router.get('/info/:registration_number', authController.checkAuthenticated, carController.carInfo);

router.get('/add', authController.checkAuthenticated, (req, res) => {
    res.render('./carManagement/addCar', {
        username: req.user.authenticated_user.name,
        id: req.user.authenticated_user.id
    });
});
router.post('/add', authController.checkAuthenticated, carController.addCar);

router.get('/edit/:registration_number', authController.checkAuthenticated, carController.editCar);
router.post('/edit/:registration_number', authController.checkAuthenticated, carController.updateCar);

router.get('/rent/:registration_number', authController.checkAuthenticated, carController.rentCarForm);
router.post('/rent/:registration_number', authController.checkAuthenticated, carController.rentCar);

router.get('/rentList', authController.checkAuthenticated, carController.rentList);
router.post('/rentList', authController.checkAuthenticated, carController.rentListFiltered);
router.post('/rentList/return/:registration_number', authController.checkAuthenticated, carController.returnCar);
router.post('/rentList/delete/:registration_number', authController.checkAuthenticated, carController.deleteRent);

router.get('/history/:registration_number', authController.checkAuthenticated, carController.carHistory);

module.exports = router;
