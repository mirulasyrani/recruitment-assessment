const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { protect } = require('../middleware/authMiddleware');

// Apply protection middleware to all candidate routes
router.use(protect);

// @route   GET /api/candidates
// @desc    Get all candidates for the recruiter
// @access  Private
router.get('/', candidateController.getCandidates);

// @route   POST /api/candidates
// @desc    Create a new candidate
// @access  Private
router.post('/', candidateController.createCandidate);

// @route   GET /api/candidates/:id
// @desc    Get a specific candidate by ID
// @access  Private
router.get('/:id', candidateController.getCandidateById);

// @route   PUT /api/candidates/:id
// @desc    Update a candidate by ID
// @access  Private
router.put('/:id', candidateController.updateCandidate);

// @route   DELETE /api/candidates/:id
// @desc    Delete a candidate by ID
// @access  Private
router.delete('/:id', candidateController.deleteCandidate);

module.exports = router;
