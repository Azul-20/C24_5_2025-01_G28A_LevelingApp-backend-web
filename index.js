const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

// Rutas protegidas
const authMiddleware = require('./middlewares/authMiddleware');
app.get('/api/perfil', authMiddleware, (req, res) => {
  res.json({ mensaje: 'Ruta protegida', usuario: req.user });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
