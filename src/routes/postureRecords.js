const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Oturuma ait tüm posture kayıtlarını getir
router.get('/session/:sessionId', async (req, res) => {
  const { data, error } = await supabase
    .from('posture_records')
    .select('*')
    .eq('session_id', req.params.sessionId)
    .order('recorded_at', { ascending: true });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Yeni posture kaydı ekle
router.post('/', async (req, res) => {
  const { session_id, user_id, posture_score, is_good_posture, torso_angle, neck_angle, shoulder_angle } = req.body;
  const { data, error } = await supabase
    .from('posture_records')
    .insert([{ session_id, user_id, posture_score, is_good_posture, torso_angle, neck_angle, shoulder_angle }])
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
});

// Kullanıcının posture özeti
router.get('/summary/:userId', async (req, res) => {
  const { data, error } = await supabase
    .from('posture_records')
    .select('posture_score, is_good_posture, recorded_at')
    .eq('user_id', req.params.userId)
    .order('recorded_at', { ascending: false })
    .limit(100);
  if (error) return res.status(400).json({ error: error.message });

  const total = data.length;
  const goodPosture = data.filter(r => r.is_good_posture).length;
  const avgScore = total > 0 ? data.reduce((sum, r) => sum + r.posture_score, 0) / total : 0;

  res.json({
    total_records: total,
    good_posture_count: goodPosture,
    bad_posture_count: total - goodPosture,
    good_posture_percentage: total > 0 ? ((goodPosture / total) * 100).toFixed(1) : 0,
    average_score: avgScore.toFixed(2)
  });
});

module.exports = router;