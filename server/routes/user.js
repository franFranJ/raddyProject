const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');



//Router
//create, find, update, delete
router.get('/', userController.view);
router.post('/', userController.find);

router.get('/adduser/', userController.addUserForm);
router.post('/adduser',userController.createUser);
router.get('/edituser/:id',userController.edit);
router.post('/edituser/:id',userController.update);

router.get('/add', userController.add);

router.get('/viewuser/:id',userController.viewall);


router.get('/:id', userController.delete); //si ponemos esta linea delante de adduser se jode la vaina
//porque parece que usa el redirect de la funcion delete y a tomar por culo dos y dos

module.exports = router;
