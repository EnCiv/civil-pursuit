module.exports = {
	"email": {
    "type": String,
    "required": true,
    "index": {
      "unique": true
    }
  },
  "password": {
    "type": String,
    "required": true
  }
};