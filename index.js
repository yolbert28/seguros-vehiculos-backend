import express, { json } from 'express';
import "dotenv/config";

import createClienteRouter from './routes/cliente.route.js';
import createCoberturaRouter from './routes/cobertura.route.js';
import createServicioRouter from './routes/servicio.route.js';
import createMarcaRouter from './routes/marca.route.js';
import createModeloRouter from './routes/modelo.router.js';
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
import servicioModel from './models/servicio.model.js';
import marcaModel from './models/marca.model.js';
import modeloModel from './models/modelo.model.js';
import empleadoModel from './models/empleado.model.js';
import polizaModel from './models/poliza.model.js';
import primaModel from './models/prima.model.js';
import repuestoSiniestroModel from './models/repuestoSiniestro.model.js';
import tallerModel from './models/taller.model.js';
import repuestoSiniestroModel from './models/repuestoSiniestro.model.js';
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
import { corsMiddleware } from './middlewares/cors.middleware.js';

const app = express();

app.disable('x-powered-by');

app.use(json());

app.use(corsMiddleware());


const PORT = process.env.PORT || 3000;

app.use("/client", createClienteRouter({ clienteModel }))
app.use("/coverage", createCoberturaRouter({ coberturaModel }))
app.use("/service", createServicioRouter({ servicioModel }))
app.use("/brand", createMarcaRouter({ marcaModel }))
app.use("/model", createModeloRouter({ modeloModel, marcaModel }))
app.use("/employee", createEmpleadoRouter({ empleadoModel }))
app.use("/policy", createPolizaRouter({ polizaModel, empleadoModel }))
app.use("/premium", createPrimaRouter({ primaModel, polizaModel }))
app.use("/accidentRepair", createRepuestoSiniestroRouter({ repuestoSiniestroModel, inspeccionSiniestroModel }))
app.use("/workshop", createTallerRouter({ tallerModel }))
app.use("/accidentReport", createReporteSiniestroRouter({ reporteSiniestroModel, clienteModel }))
app.use("/evidence", createEvidenciaRouter({ evidenciaModel, siniestroModel }))
app.use("/vehicle", createVehiculoRouter({vehiculoModel, polizaModel}))
app.use("/maintenance", createMantenimientoRouter({ mantenimientoModel, vehiculoModel, tallerModel }))
app.use("/sinister", createSiniestroRouter({ siniestroModel, reporteSiniestroModel, vehiculoModel }))
app.use("/repairPayment", createPagoReparacionRouter({ pagoReparacionModel, reparacionModel }))
app.use("/repair", createReparacionRouter({ reparacionModel, indemnizacionModel, tallerModel }))
app.use("/indemnity", createIndemnizacionRouter({ indemnizacionModel, siniestroModel }))
app.use("/indemnityInspection", createInspeccionIndemnizacionRouter({ inspeccionIndemnizacionModel, indemnizacionModel, empleadoModel }))
app.use("/accidentInspection", createInspeccionSiniestroRouter({ inspeccionSiniestroModel, siniestroModel, empleadoModel }))
app.use("/repairReplacement", createRepuestoReparacionRouter({ repuestoReparacionModel, reparacionModel }))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
