//obtener evens
//  Auth Routes on  /api/events
const { Router, application } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/auth-validator");
const { validateJWT } = require("../middlewares/jwt-validator");
const { isDate } = require("../helpers/isDate");

const router = Router();
router.use(validateJWT);

//controllers

const {
  getEvents,
  newEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/events");

//todas tiene que pasar por la validación del JWT
router.get("/", validateJWT, getEvents);
router.post(
  "/",
  [check("title", "title is requerid").not().isEmpty()],
  [check("start", "start date is requerid").custom(isDate)],
  [check("end", "end date is requerid").custom(isDate)],
  validarCampos,
  newEvent
);
router.put(
  "/:id",
  [check("title", "title is requerid").not().isEmpty()],
  [check("start", "start date is requerid").custom(isDate)],
  [check("end", "end date is requerid").custom(isDate)],
  validarCampos,
  updateEvent
);
router.delete("/:id", validateJWT, deleteEvent);

module.exports = router;
