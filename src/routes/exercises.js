const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const authMiddleware = require('../middleware/authMiddleware');

// Kullanıcının tüm egzersiz önerilerini getir
router.get('/:userId', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('exercise_recommendations')
    .select('*')
    .eq('user_id', req.params.userId)
    .order('recommended_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Yeni egzersiz önerisi ekle
router.post('/', authMiddleware, async (req, res) => {
  const { user_id, exercise_name, description } = req.body;
  const { data, error } = await supabase
    .from('exercise_recommendations')
    .insert([{ user_id, exercise_name, description }])
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Posture skoruna göre otomatik egzersiz önerisi oluştur
router.post('/auto-recommend', authMiddleware, async (req, res) => {
  const { user_id, posture_score, torso_angle, neck_angle, shoulder_angle } = req.body;

  const recommendations = [];

  if (torso_angle < 160) {
    recommendations.push({
      user_id,
      exercise_name: 'Cat-Cow Stretch',
      description: 'Sırt kaslarını gevşetmek için zemine diz çök, nefes alırken beli aşağı sark, nefes verirken yukarı kaldır. 10 tekrar yap.'
    });
  }

  if (neck_angle < 150) {
    recommendations.push({
      user_id,
      exercise_name: 'Boyun Germe',
      description: 'Başını yavaşça sağa ve sola eğ, her pozisyonda 15 saniye bekle. 3 set tekrarla.'
    });
  }

  if (shoulder_angle < 160) {
    recommendations.push({
      user_id,
      exercise_name: 'Omuz Açma',
      description: 'Kollarını arkada kavuştur, göğsünü açarak 20 saniye bekle. 3 kez tekrarla.'
    });
  }

  if (posture_score < 50) {
    recommendations.push({
      user_id,
      exercise_name: 'Kısa Yürüyüş Molası',
      description: 'Her 30 dakikada bir 5 dakika ayağa kalk ve yürü. Uzun süreli oturma sırt ağrısını artırır.'
    });
  }

  if (recommendations.length === 0) {
    return res.json({
      message: 'Duruşunuz iyi görünüyor! Devam edin.',
      recommendations: []
    });
  }

  const { data, error } = await supabase
    .from('exercise_recommendations')
    .insert(recommendations)
    .select();

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({
    message: `${data.length} egzersiz önerisi oluşturuldu.`,
    recommendations: data
  });
});

// Egzersiz önerisini sil
router.delete('/:id', authMiddleware, async (req, res) => {
  const { error } = await supabase
    .from('exercise_recommendations')
    .delete()
    .eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Egzersiz önerisi silindi.' });
});

module.exports = router;