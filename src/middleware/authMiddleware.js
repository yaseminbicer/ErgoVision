const supabase = require('../supabase');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token bulunamadı, giriş yapınız' });
  }

  const token = authHeader.split(' ')[1];

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: 'Geçersiz veya süresi dolmuş token' });
  }

  req.user = data.user;
  next();
};

module.exports = authMiddleware;