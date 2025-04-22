import MantenimientoModel from "../models/mantenimiento.model.js";
import PolizaModel from "../models/poliza.model.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "antonetta.herzog@ethereal.email",
    pass: "ZXJd2TnfhwASUrxHVM",
  },
});


export default class Mailer {

  static sendMailMantenimiento() {

    const expiresInTenDays = MantenimientoModel.getIfExpiresInTenDays();

    let fechaTen = new Date();
    fechaTen.setDate(fechaTen.getDate() + 10);
    fechaTen = fechaTen.toISOString().slice(0, 10);

    expiresInTenDays.then((info) => {
      info.forEach((element) => {
        transporter.sendMail({
          from: '<smartride@ethereal.email>', // sender address
          to: element.correo, // list of receivers
          subject: "Mantenimiento cercano", // Subject line
          text: `Buenos dias estimad@ ${element.nombre}`, // plain text body
          html: `<h1>Estimado/a ${element.nombre}</h1> <p> En smartRide, nos preocupamos por tu seguridad y el buen estado de tu vehículo. Por eso, te recordamos que el mantenimiento programado de tu ${element.marca} ${element.modelo} debe realizarse antes de ${fechaTen}.</p>`, // html body
        });
      });
    })

    const expiresInThreeDays = MantenimientoModel.getIfExpiresInThreeDays();

    let fechaThree = new Date();
    fechaThree.setDate(fechaThree.getDate() + 3);
    fechaThree = fechaThree.toISOString().slice(0, 10);

    expiresInThreeDays.then((info) => {
      info.forEach((element) => {
        transporter.sendMail({
          from: '<smartride@ethereal.email>', // sender address
          to: element.correo, // list of receivers
          subject: "Mantenimiento cercano", // Subject line
          text: `Buenos dias estimad@ ${element.nombre}`, // plain text body
          html: `<h1>Estimado/a ${element.nombre}</h1> <p> En smartRide, nos preocupamos por tu seguridad y el buen estado de tu vehículo. Por eso, te recordamos que el mantenimiento programado de tu ${element.marca} ${element.modelo} debe realizarse antes de ${fechaThree}.</p>`, // html body
        });
      });
    })

    const expiresToday = MantenimientoModel.getIfExpiresToday();

    expiresToday.then((info) => {
      info.forEach((element) => {
        transporter.sendMail({
          from: '<smartride@ethereal.email>', // sender address
          to: element.correo, // list of receivers
          subject: "Mantenimiento cercano", // Subject line
          text: `Buenos dias estimad@ ${element.nombre}`, // plain text body
          html: `<h1>Estimado/a ${element.nombre}</h1> <p> En smartRide, nos preocupamos por tu seguridad y el buen estado de tu vehículo. Por eso, te recordamos que el mantenimiento programado de tu ${element.marca} ${element.modelo} debe realizarse hoy.</p>`, // html body
        });
      });
    })

  }

  static sendMailPoliza() {
    const expiresInTenDays = PolizaModel.getIfExpiresInTenDays();

    let fechaTen = new Date();
    fechaTen.setDate(fechaTen.getDate() + 10);
    fechaTen = fechaTen.toISOString().slice(0, 10);

    expiresInTenDays.then((info) => {
      info.forEach((element) => {
        transporter.sendMail({
          from: '<smartride@ethereal.email>', // sender address
          to: element.correo, // list of receivers
          subject: "Poliza vence pronto", // Subject line
          text: `Buenos dias estimad@ ${element.nombre}`, // plain text body
          html: `<h1>Estimado/a ${element.nombre}</h1> <p> En smartRide, nos preocupamos por tu seguridad y el buen estado de tu vehículo. Por eso, te recordamos que renueves tu poliza con identificador ${element.id} debe realizarse antes de ${fechaTen}.</p>`, // html body
        });
      });
    })

    const expiresInThreeDays = PolizaModel.getIfExpiresInThreeDays();

    let fechaThree = new Date();
    fechaThree.setDate(fechaThree.getDate() + 3);
    fechaThree = fechaThree.toISOString().slice(0, 10);

    expiresInThreeDays.then((info) => {
      info.forEach((element) => {
        transporter.sendMail({
          from: '<smartride@ethereal.email>', // sender address
          to: element.correo, // list of receivers
          subject: "Poliza vence pronto", // Subject line
          text: `Buenos dias estimad@ ${element.nombre}`, // plain text body
          html: `<h1>Estimado/a ${element.nombre}</h1> <p> En smartRide, nos preocupamos por tu seguridad y el buen estado de tu vehículo. Por eso, te recordamos que renueves tu poliza con identificador ${element.id} debe realizarse antes de ${fechaThree}.</p>`, // html body
        });
      });
    })

    const expiresToday = PolizaModel.getIfExpiresToday();

    expiresToday.then((info) => {
      info.forEach((element) => {
        transporter.sendMail({
          from: '<smartride@ethereal.email>', // sender address
          to: element.correo, // list of receivers
          subject: "Poliza vence pronto", // Subject line
          text: `Buenos dias estimad@ ${element.nombre}`, // plain text body
          html: `<h1>Estimado/a ${element.nombre}</h1> <p> En smartRide, nos preocupamos por tu seguridad y el buen estado de tu vehículo. Por eso, te recordamos que renueves tu poliza con identificador ${element.id} debe realizarse hoy.</p>`, // html body
        });
      });
    })
  }

}