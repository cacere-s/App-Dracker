import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
dotenv.config({path: '.env'})

const corsOptions = {
    origin: process.env.URL_FRONTEND || 'http://localhost:8080',
    optionsSuccessStatus: 200,
    credentials: true
}
app.use(cors(corsOptions));

// leer datos del body
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json());

// conexion de base de datos
import db from './config/db.js';
try {
    await db.authenticate();
    db.sync();
    console.log('Conexion a base de datos exitosa')
} catch (error) {
    console.error('Conexion a base de datos fallida ', error);
}

// rutas importadas
import note from './routes/noteRoute.js'

// rutas middleware
app.use('/', note)

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Servidor iniciado')
})
