const db = require('../db');
const { candidateSchema } = require('../validation/schemas');

// GET all candidates (with optional filters)
const getCandidates = async (req, res, next) => {
  try {
    const recruiter_id = req.user.id;
    const { q, status } = req.query;

    let queryString = 'SELECT * FROM candidates WHERE recruiter_id = $1';
    const queryParams = [recruiter_id];
    let paramIndex = 2;

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
    console.error('[getCandidates Error]', error.message);
    next(error);
  }
};

// GET candidate by ID
const getCandidateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recruiter_id = req.user.id;

    const { rows } = await db.query(
      'SELECT * FROM candidates WHERE id = $1 AND recruiter_id = $2',
      [id, recruiter_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Candidate not found or access denied' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('[getCandidateById Error]', error.message);
    next(error);
  }
};

// POST new candidate
const createCandidate = async (req, res, next) => {
  try {
    const validatedData = candidateSchema.parse(req.body);
    const recruiter_id = req.user.id;

    const {
      name, email, phone, position,
      skills, experience_years, status, notes
    } = validatedData;

    const query = `
      INSERT INTO candidates (
        recruiter_id, name, email, phone,
        position, skills, experience_years, status, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const params = [
      recruiter_id, name, email, phone,
      position, skills, experience_years, status, notes
    ];

    const { rows } = await db.query(query, params);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('[createCandidate Error]', error.message);
    next(error);
  }
};

// PUT update candidate
const updateCandidate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recruiter_id = req.user.id;
    const validatedData = candidateSchema.parse(req.body);

    const {
      name, email, phone, position,
      skills, experience_years, status, notes
    } = validatedData;

    const query = `
      UPDATE candidates SET
        name = $1, email = $2, phone = $3,
        position = $4, skills = $5, experience_years = $6,
        status = $7, notes = $8, updated_at = CURRENT_TIMESTAMP
      WHERE id = $9 AND recruiter_id = $10
      RETURNING *
    `;
    const params = [
      name, email, phone, position,
      skills, experience_years, status, notes,
      id, recruiter_id
    ];

    const { rows } = await db.query(query, params);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Candidate not found or access denied' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('[updateCandidate Error]', error.message);
    next(error);
  }
};

// DELETE candidate
const deleteCandidate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recruiter_id = req.user.id;

    const { rowCount } = await db.query(
      'DELETE FROM candidates WHERE id = $1 AND recruiter_id = $2',
      [id, recruiter_id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Candidate not found or access denied' });
    }

    res.status(200).json({ id, message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('[deleteCandidate Error]', error.message);
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
