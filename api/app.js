const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'galloalerta'
});

db.connect(err => {
    if (err) throw err;
    console.log("Se conectó a la base de datos MySQL con éxito");
});

const SECRET_KEY = 'mysecretkey';

app.listen(port, () => {
    console.log(`Servidor escuchando el puerto ${port}`);
});

app.get("/", (req, res) => {
    res.send("API de Gallo Alerta");
});

/* Login */
app.post('/login', async (req, res) => {
    const { nombreusuario, contra } = req.body;

    if (!nombreusuario || !contra)
        return res.status(400).json({ message: 'Se requiere un nombre de usuario y una contraseña' });

    db.query('SELECT * FROM admins WHERE nombreusuario = ?', [nombreusuario], async (err, results) => {
        if (results.length === 0)
            return res.status(401).json({ message: 'Admin inexistente' });
        
        const usuario = results[0];
        if (usuario.contra != contra)
            return res.status(401).json({ message: 'Contraseña inválida' });

        const token = jwt.sign(
            { userid: usuario.id, username: usuario.nombreusuario },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({
            "nombre": usuario.nombre,
            "nombreusuario": usuario.nombreusuario,
            token
        });
    });
});

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token)
        return res.status(401).json({ message: 'Acceso denegado: no se proporcionó ningún token' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err)
            return res.status(403).json({ message: 'Token inválido o expirado' });

        req.user = decoded;
        next();
    });
}

/* Incidentes */

// Ver incidentes
app.get('/incidentes', (req, res) => {
    db.query('SELECT * FROM incidentes', (err, rows) => {
        if (err) throw err;
        res.json(rows);
    });
});

// Ver un incidente en específico
app.get('/incidentes/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM incidentes WHERE id = ?', id, (err, rows) => {
        if (err) throw err;
        if (rows.length == 0)
            return res.status(404).json({ message: 'El incidente especificado no existe.' });
        res.json(rows[0]);
    });
});

// Registrar un incidente
app.post('/incidentes', (req, res) => {
    const { asunto, descripcion, ubicacion } = req.body;
    db.query('INSERT INTO incidentes (asunto, descripcion, ubicacion) VALUES (?, ?, ?)', [asunto, descripcion, ubicacion], (err, result) => {
        if (err) throw err;
        res.send('Incidente registrado con éxito');
    });
});