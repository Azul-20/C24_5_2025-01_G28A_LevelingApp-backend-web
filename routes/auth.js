const express = require('express');
const router = express.Router();
const admin = require('../services/firebase');
const jwt = require('jsonwebtoken');
const pool = require('../config/database'); 

const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/login
router.post('/login', async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, uid, name } = decodedToken;

    // Validar idToken en el body
    if (!idToken) {
    return res.status(400).json({ error: 'idToken es requerido' });
    }

    // Validar dominio institucional
    if (!email.endsWith('@tecsup.edu.pe')) {
      return res.status(403).json({ error: 'Correo no autorizado. Use su cuenta @tecsup.edu.pe' });
    }

    // Verificar si el usuario ya existe, si no, crearlo (rol por defecto: estudiante)
    const usuario = await pool.query('SELECT * FROM usuarios WHERE uid = $1', [uid]);

    if (usuario.rows.length === 0) {
      await pool.query(
        'INSERT INTO usuarios (uid, nombre, correo) VALUES ($1, $2, $3)',
        [uid, name || 'Sin nombre', email]
      );
    }

    // Generar token JWT
    const token = jwt.sign({ uid, email, role: 'estudiante' }, JWT_SECRET, {
      expiresIn: '5h'
    });

    res.json({ token, email });
  } catch (err) {
    console.error('Error de login:', err);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
});

module.exports = router;
