function enforceRequiredFields(schema, requiredFields) { // Add required fields to schema through Joi
  const schemaDescription = schema.describe()
  const newSchema = {}

  Object.keys(schemaDescription.keys).forEach((key) => {
    newSchema[key] = requiredFields.includes(key) ? schema.extract(key).required() : schema.extract(key)
  })

  return Joi.object(newSchema)

}

module.exports = enforceRequiredFields;git 
