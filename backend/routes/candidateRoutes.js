const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { protect } = require('../middleware/authMiddleware');

// Apply the 'protect' middleware to all routes in this file.
// This fulfills the requirement to have an auth check on all candidate endpoints.
router.use(protect);

router.route('/')
    .get(candidateController.getCandidates)
    .post(candidateController.createCandidate);

router.route('/:id')
    .get(candidateController.getCandidateById)
    .put(candidateController.updateCandidate)
    .delete(candidateController.deleteCandidate);

// Note: Search and Filter are combined into the main GET endpoint for simplicity.
// The controller logic will handle query parameters like `?q=term` and `?status=applied`.

module.exports = router;
