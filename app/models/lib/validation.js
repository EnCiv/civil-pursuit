import Joi from 'joi'

const SANE = 4096

const Validation = {
  SANE: SANE,
  Integer: /^[0-9]+$/,
  ObjectID: () => Joi.any(),
  String: () => Joi.string().max(SANE),
  IsoDate: () => Joi.string().isoDate(),
  Email: () => Joi.string().email(),
  Number: () => Joi.number(),
}
export default Validation
