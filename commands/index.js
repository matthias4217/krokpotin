const imageModule = require('./imagecommands');
const mosaicModule = require('./mosaic');

module.exports = {
  Help: require('./help.js')
};

if (process.env.USE_MOSAIC_MODULE === 'true') {
  console.log('Using Mosaic Module');
  module.exports = Object.assign(module.exports, mosaicModule);
}

if (process.env.USE_IMAGE_MODULE === 'true') {
  console.log('Using Image Module');
  module.exports = Object.assign(module.exports, imageModule);
}

if (process.env.USE_MANAGEMENT_MODULE === 'true') {
    console.log('Using Management Module');
    const managementModule = require('./management');
    module.exports = Object.assign(module.exports, managementModule);
}

