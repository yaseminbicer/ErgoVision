const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const authMiddleware = require('../middleware/authMiddleware');

// Tüm kullanıcıları getir - KORUMAL
router.get('/', authMiddleware, async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Kullanıcı oluştur
router.post('/', async (req, res) => {
  const { email, full_name } = req.body;
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, full_name }])
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Tek kullanıcı getir - KORUMALI
router.get('/:id', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  res.json(data);
});

module.exports = router;