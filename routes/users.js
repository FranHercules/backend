var express = require('express');
var router = express.Router();
var userController = require('../controllers/YoutController')

/* GET users listing. */
router.get('/:nombre', userController.getOne);
router.get('/', userController.getAll);

router.post('/',userController.register);
router.put('/:nombre', userController.update);
router.delete('/:nombre',userController.delete);

module.exports = router;
