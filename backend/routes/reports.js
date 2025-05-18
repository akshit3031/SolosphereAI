const express = require('express');
const router = express.Router();
const { postReport, getReports, filterReports,machineHistory } = require('../controllers/reportsController');

router.post('/', postReport);
router.get('/', getReports);
router.get('/filter', filterReports);
router.get('/:machineId/history',machineHistory);
module.exports = router;
