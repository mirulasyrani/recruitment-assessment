const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(candidateController.getCandidates)
    .post(candidateController.createCandidate);

router.route('/:id')
    .get(candidateController.getCandidateById)
    .put(candidateController.updateCandidate)
    .delete(candidateController.deleteCandidate);

module.exports = router;