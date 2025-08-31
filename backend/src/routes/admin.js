import express from 'express';
const router = express.Router();

// Placeholder para admin
router.get('/status', (req, res) => {
  res.json({ status: 'Admin service running' });
});

export default router;
