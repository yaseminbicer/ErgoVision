const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const authMiddleware = require('../middleware/authMiddleware');

// Kullanıcının tüm oturumlarını getir - KORUMALI
router.get('/user/:userId', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', req.params.userId)
    .order('started_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Yeni oturum başlat - KORUMALI
router.post('/', authMiddleware, async (req, res) => {
  const { user_id } = req.body;
  const { data, error } = await supabase
    .from('sessions')
    .insert([{ user_id }])
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Oturumu bitir - KORUMALI
router.patch('/:id/end', authMiddleware, async (req, res) => {
  const { duration_seconds } = req.body;
  const { data, error } = await supabase
    .from('sessions')
    .update({
      ended_at: new Date().toISOString(),
      duration_seconds
    })
    .eq('id', req.params.id)
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

module.exports = router;