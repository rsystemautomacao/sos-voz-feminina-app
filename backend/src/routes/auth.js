import express from 'express';
const router = express.Router();

// Placeholder para autenticação
router.get('/status', (req, res) => {
  res.json({ status: 'Auth service running' });
});

export default router;
