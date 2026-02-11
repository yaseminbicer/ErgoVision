const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Kayıt ol
router.post('/register', async (req, res) => {
  const { email, password, full_name } = req.body;

  // Supabase auth ile kayıt
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name }
    }
  });

  if (error) return res.status(400).json({ error: error.message });

  // Users tablosuna da ekle
  const { error: dbError } = await supabase
    .from('users')
    .insert([{ id: data.user.id, email, full_name }]);

  if (dbError) return res.status(400).json({ error: dbError.message });

  res.status(201).json({
    message: 'Kayıt başarılı!',
    user: {
      id: data.user.id,
      email: data.user.email,
      full_name
    }
  });
});

// Giriş yap
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return res.status(401).json({ error: 'Email veya şifre hatalı' });

  res.json({
    message: 'Giriş başarılı!',
    token: data.session.access_token,
    user: {
      id: data.user.id,
      email: data.user.email,
      full_name: data.user.user_metadata.full_name
    }
  });
});

// Çıkış yap
router.post('/logout', async (req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Çıkış başarılı!' });
});

module.exports = router;