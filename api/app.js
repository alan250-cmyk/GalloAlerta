const express = require('express');
const mysql = require('mysql');
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

app.listen(port, () => {
    console.log(`Servidor escuchando el puerto ${port}`);
});

app.get("/api/", (req, res) => {
    res.send("API de Gallo Alerta");
});

/* Incidentes */

// Ver incidentes
app.get('/api/incidentes', (req, res) => {
    db.query('SELECT * FROM incidentes', (err, rows) => {
        if (err) throw err;
        res.json(rows);
    });
});

// Ver un incidente en específico
app.get('/api/incidentes/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM incidentes WHERE id = ?', id, (err, rows) => {
        if (err) throw err;
        res.json(rows[0]);
    });
});

// Registrar un incidente
app.post('/api/incidentes', (req, res) => {
    const { asunto, descripcion, ubicacion } = req.body;
    db.query('INSERT INTO incidentes (asunto, descripcion, ubicacion) VALUES (?, ?, ?)', [asunto, descripcion, ubicacion], (err, result) => {
        if (err) throw err;
        res.send('Incidente registrado con éxito');
    });
});