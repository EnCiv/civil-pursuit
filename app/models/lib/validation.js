import Joi from 'joi'

const SANE = 4096

const Validation = {
  SANE: SANE,
  Integer: /^[0-9]+$/,
  ObjectID: () => Joi.any(),
  String: () => Joi.string().allow('').max(SANE),
  IsoDate: () => Joi.string().allow('').isoDate(),
  Email: () => Joi.string().allow('').email(),
  Number: () => Joi.number(),
}
export default Validation
