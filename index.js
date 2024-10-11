// crudMedicamentos.js
import express from 'express';
import pool from './conf/dbConnect.js';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;//puerto dinamico para el deploy

// Configura Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'))

// Ruta para servir index.html al acceder a la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join('index.html'));
});

app.use(express.json());

// Crear un nuevo medicamento
app.post('/medicamentos', async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const medicamentoData = req.body; 

        const sql = 'INSERT INTO medicamentos SET ?'; 
        const [rows] = await connection.query(sql, [medicamentoData]);
        connection.release();
        res.json({ mensaje: 'Medicamento agregado', id: rows.insertId });

    } catch (err) {
        console.error('Error al consultar la base de datos:', err);
        res.status(500).send('Error al consultar la base de datos');
    }    
});

// Leer todos los medicamentos
app.get('/medicamentos', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM medicamentos');
    res.json(rows);
});

// Leer un medicamento por id
app.get('/medicamentos/:id', async (req, res) => {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM medicamentos WHERE id = ?', [id]);
    res.json(rows[0]);
});

// Actualizar un medicamento por id
app.put('/medicamentos/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const id = req.params.id; 
        const medicamentoData = req.body;
        
        const sql = 'UPDATE medicamentos SET ? WHERE id = ?'; 
        const [rows] = await connection.query(sql, [medicamentoData, id]);
        connection.release();
        res.json({ mensaje: 'Medicamento actualizado' });
    } catch (err) {
        console.error('Error al consultar la base de datos:', err);
        res.status(500).send('Error al consultar la base de datos');
    }
});

// Eliminar un medicamento por id
app.delete('/medicamentos/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM medicamentos WHERE id = ?', [id]);
    res.sendStatus(204);
});


app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
