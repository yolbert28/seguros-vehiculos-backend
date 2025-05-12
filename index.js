import express, { json } from 'express';
import "dotenv/config";
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import cron from 'node-cron';

import createClienteRouter from './routes/cliente.route.js';
import createCoberturaRouter from './routes/cobertura.route.js';
import createMarcaRouter from './routes/marca.route.js';
import createModeloRouter from './routes/modelo.route.js';
import createEmpleadoRouter from './routes/empleado.route.js';
import createPolizaRouter from './routes/poliza.route.js';
import createPrimaRouter from './routes/prima.route.js';
import createRepuestoSiniestroRouter from './routes/repuestoSiniestro.route.js';
import createTallerRouter from './routes/taller.route.js';
import createReporteSiniestroRouter from './routes/reporteSiniestro.route.js';
import createEvidenciaRouter from './routes/evidencia.route.js';
import createVehiculoRouter from './routes/vehiculo.route.js';
import createMantenimientoRouter from './routes/mantenimiento.route.js';
import createSiniestroRouter from './routes/siniestro.route.js';
import createPagoReparacionRouter from './routes/pagoReparacion.route.js';
import createReparacionRouter from './routes/reparacion.route.js';
import createIndemnizacionRouter from './routes/indemnizacion.route.js';
import createInspeccionIndemnizacionRouter from './routes/inspeccionIndemnizacion.route.js';
import createInspeccionSiniestroRouter from './routes/inspeccionSiniestro.route.js';
import createRepuestoReparacionRouter from './routes/repuestoReparacion.route.js';

import clienteModel from './models/cliente.model.js';
import coberturaModel from './models/cobertura.model.js';
import marcaModel from './models/marca.model.js';
import modeloModel from './models/modelo.model.js';
import empleadoModel from './models/empleado.model.js';
import polizaModel from './models/poliza.model.js';
import primaModel from './models/prima.model.js';
import repuestoSiniestroModel from './models/repuestoSiniestro.model.js';
import tallerModel from './models/taller.model.js';
import evidenciaModel from './models/evidencia.model.js';
import vehiculoModel from './models/vehiculo.model.js';
import mantenimientoModel from './models/mantenimiento.model.js';
import reporteSiniestroModel from './models/reporteSiniestro.model.js';
import siniestroModel from './models/siniestro.model.js';
import pagoReparacionModel from './models/pagoReparacion.model.js';
import reparacionModel from './models/reparacion.model.js';
import indemnizacionModel from './models/indemnizacion.model.js';
import inspeccionIndemnizacionModel from './models/inspeccionIndemnizacion.model.js';
import inspeccionSiniestroModel from './models/inspeccionSiniestro.model.js';
import repuestoReparacionModel from './models/repuestoReparacion.model.js';
import coberturaPolizaModel from './models/coberturaPoliza.model.js';
import riesgoModel from './models/riesgo.model.js';
import tipoSiniestroModel from './models/tipoSiniestro.model.js';
import tipoEmpleadoModel from './models/tipoEmpleado.model.js';
import tipoEvidenciaModel from './models/tipoEvidencia.model.js';
import tipoPagoModel from './models/tipoPago.model.js';
import paganteModel from './models/pagante.model.js';
import estadoModel from './models/estado.model.js';
import atendidoModel from './models/atendido.model.js';
import { verifyTokenSocket } from './middlewares/jwt.middleware.js';
import Mailer from './utils/mailer.js';
import { corsMiddleware } from './middlewares/cors.middleware.js';
import cors from 'cors'
import createRiesgoRouter from './routes/riesgo.route.js';
import createAtendidoRouter from './routes/atendido.route.js';
import createTipoSiniestroRouter from './routes/tipoSiniestro.route.js';
import createTipoEmpleadoRouter from './routes/tipoEmpleado.route.js';
import createTipoEvidenciaRouter from './routes/tipoEvidencia.route.js';
import createTipoPagoRouter from './routes/tipoPago.route.js';
import createPaganteRouter from './routes/pagante.route.js';
import createEstadoRouter from './routes/estado.route.js';

const app = express();

app.disable('x-powered-by');

app.use(json());

app.use(cors({
    origin: '*', // Permite cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
    credentials: true // Si necesitas cookies/tokens de autenticación
  }));

const server = createServer(app)
const io = new Server(server, {
    connectionStateRecovery: {
        maxDisconnectionDuration: 10000
    },
    cors: {
        origin: '*', // Permite cualquier origen
        methods: ['GET', 'POST'], // Métodos permitidos para WebSocket
        allowedHeaders: ['Authorization'], // Headers necesarios para autenticación
        credentials: true // Si usas JWT/cookies
      }
})

// Envia los correos de mantenimiento y poliza todos los dias a las 12:00 am
// cron.schedule('minutos horas * * *')
cron.schedule('00 00 * * *', () => {
    Mailer.sendMailMantenimiento();
    Mailer.sendMailPoliza();
}, {
    scheduled: true,
    timezone: "America/Caracas"
});

// io.use(verifyTokenSocket);

io.on('connection', async (socket) => {
    console.log('a user connected');

    socket.emit("report", await reporteSiniestroModel.getByNotAtendido());

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on("report", async () => {
        io.emit("report", await reporteSiniestroModel.getByNotAtendido());
    })
})

const PORT = process.env.PORT || 3000;

app.use("/client", createClienteRouter({ clienteModel, polizaModel, reporteSiniestroModel }))
app.use("/coverage", createCoberturaRouter({ coberturaModel, coberturaPolizaModel }))
app.use("/brand", createMarcaRouter({ marcaModel, modeloModel }))
app.use("/model", createModeloRouter({ modeloModel, marcaModel, vehiculoModel }))
app.use("/employee", createEmpleadoRouter({ empleadoModel, inspeccionSiniestroModel, inspeccionIndemnizacionModel, polizaModel }))
app.use("/policy", createPolizaRouter({ polizaModel, empleadoModel, coberturaPolizaModel, coberturaModel, vehiculoModel, primaModel }))
app.use("/premium", createPrimaRouter({ primaModel, polizaModel }))
app.use("/accidentRepair", createRepuestoSiniestroRouter({ repuestoSiniestroModel, inspeccionSiniestroModel }))
app.use("/workshop", createTallerRouter({ tallerModel, reparacionModel, mantenimientoModel }))
app.use("/accidentReport", createReporteSiniestroRouter({ reporteSiniestroModel, clienteModel, siniestroModel }))
app.use("/evidence", createEvidenciaRouter({ evidenciaModel, siniestroModel }))
app.use("/vehicle", createVehiculoRouter({ vehiculoModel, polizaModel, siniestroModel, mantenimientoModel, modeloModel }))
app.use("/maintenance", createMantenimientoRouter({ mantenimientoModel, vehiculoModel, tallerModel }))
app.use("/sinister", createSiniestroRouter({ siniestroModel, reporteSiniestroModel, vehiculoModel, indemnizacionModel, inspeccionSiniestroModel, evidenciaModel }))
app.use("/repairPayment", createPagoReparacionRouter({ pagoReparacionModel, reparacionModel }))
app.use("/repair", createReparacionRouter({ reparacionModel, indemnizacionModel, tallerModel, pagoReparacionModel, repuestoReparacionModel }))
app.use("/indemnity", createIndemnizacionRouter({ indemnizacionModel, siniestroModel, reparacionModel, inspeccionIndemnizacionModel, }))
app.use("/indemnityInspection", createInspeccionIndemnizacionRouter({ inspeccionIndemnizacionModel, indemnizacionModel, empleadoModel }))
app.use("/accidentInspection", createInspeccionSiniestroRouter({ inspeccionSiniestroModel, siniestroModel, empleadoModel, repuestoSiniestroModel }))
app.use("/repairReplacement", createRepuestoReparacionRouter({ repuestoReparacionModel, reparacionModel }))
app.use("/risk", createRiesgoRouter({ riesgoModel }))
app.use("/attended", createAtendidoRouter({ atendidoModel }))
app.use("/typeAccident", createTipoSiniestroRouter({tipoSiniestroModel}))
app.use("/typeEmployee", createTipoEmpleadoRouter({tipoEmpleadoModel}))
app.use("/typeEvidence", createTipoEvidenciaRouter({tipoEvidenciaModel}))
app.use("/typePayment", createTipoPagoRouter({tipoPagoModel}))
app.use("/paying", createPaganteRouter({paganteModel}))
app.use("/status", createEstadoRouter({estadoModel}))

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
