const { Router } = require('express');
const { getStatus, getStats } = require('../controllers/AppController');
const { getConnect, getDisconnect } = require('../controllers/AuthController');
const { postNew, getMe } = require('../controllers/UsersController');

const router = new Router();

router.get('/status', getStatus);
router.get('/stats', getStats);
router.post('/users', postNew);
router.get('/connect', getConnect);
router.get('/disconnect', getDisconnect);
router.get('/users/me', getMe);

module.exports = router;
