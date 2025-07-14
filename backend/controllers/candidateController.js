const db = require('../db');
const { candidateSchema } = require('../validation/schemas');

// @desc    Get all candidates for the logged-in recruiter, with search and filter
// @route   GET /api/candidates
// @access  Private
const getCandidates = async (req, res, next) => {
    try {
        const recruiter_id = req.user.id;
        const { q, status } = req.query;

        let queryString = 'SELECT * FROM candidates WHERE recruiter_id = $1';
        const queryParams = [recruiter_id];
        let paramIndex = 2;

        // As suggested, for a "fuzzy" search, we use ILIKE and the % wildcard.
        // ILIKE is case-insensitive.
        if (q) {
            queryString += ` AND (name ILIKE $${paramIndex} OR position ILIKE $${paramIndex} OR skills ILIKE $${paramIndex})`;
            queryParams.push(`%${q}%`);
            paramIndex++;
        }

        if (status) {
            queryString += ` AND status = $${paramIndex}`;
            queryParams.push(status);
            paramIndex++;
        }
        
        queryString += ' ORDER BY created_at DESC';

        const { rows } = await db.query(queryString, queryParams);
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single candidate by ID
// @route   GET /api/candidates/:id
// @access  Private
const getCandidateById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const recruiter_id = req.user.id;
        const { rows } = await db.query('SELECT * FROM candidates WHERE id = $1 AND recruiter_id = $2', [id, recruiter_id]);

        if (rows.length === 0) {
            res.status(404);
            throw new Error('Candidate not found or you do not have permission to view it');
        }
        res.json(rows[0]);
    } catch (error) {
        next(error);
    }
};


// @desc    Create a new candidate
// @route   POST /api/candidates
// @access  Private
const createCandidate = async (req, res, next) => {
    try {
        const validatedData = candidateSchema.parse(req.body);
        const recruiter_id = req.user.id;
        const { name, email, phone, position, skills, experience_years, status, notes } = validatedData;

        const query = 'INSERT INTO candidates (recruiter_id, name, email, phone, position, skills, experience_years, status, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
        const params = [recruiter_id, name, email, phone, position, skills, experience_years, status, notes];
        
        const { rows } = await db.query(query, params);
        res.status(201).json(rows[0]);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a candidate
// @route   PUT /api/candidates/:id
// @access  Private
const updateCandidate = async (req, res, next) => {
    try {
        const { id } = req.params;
        const recruiter_id = req.user.id;
        const validatedData = candidateSchema.parse(req.body);
        const { name, email, phone, position, skills, experience_years, status, notes } = validatedData;
        
        const query = 'UPDATE candidates SET name = $1, email = $2, phone = $3, position = $4, skills = $5, experience_years = $6, status = $7, notes = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 AND recruiter_id = $10 RETURNING *';
        const params = [name, email, phone, position, skills, experience_years, status, notes, id, recruiter_id];
        
        const { rows } = await db.query(query, params);

        if (rows.length === 0) {
            res.status(404);
            throw new Error('Candidate not found or you do not have permission to update it');
        }
        res.json(rows[0]);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a candidate
// @route   DELETE /api/candidates/:id
// @access  Private
const deleteCandidate = async (req, res, next) => {
    try {
        const { id } = req.params;
        const recruiter_id = req.user.id;

        const { rowCount } = await db.query('DELETE FROM candidates WHERE id = $1 AND recruiter_id = $2', [id, recruiter_id]);

        if (rowCount === 0) {
            res.status(404);
            throw new Error('Candidate not found or you do not have permission to delete it');
        }
        res.status(200).json({ id: id, message: 'Candidate deleted successfully' });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getCandidates,
    getCandidateById,
    createCandidate,
    updateCandidate,
    deleteCandidate,
};