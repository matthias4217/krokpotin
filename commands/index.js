const imageModule = require('./imagecommands');

module.exports = {
  Help: require('./help.js')
};

if (process.env.USE_MOSAIC_MODULE === 'true') {
  module.exports = Object.assign(module.exports, {Mosaic: require('./mosaic')});
}

if (process.env.USE_IMAGE_MODULE === 'true') {
  module.exports = Object.assign(module.exports, imageModule);
}
