const imageModule = require('./imagecommands');
const mosaicModule = require('./mosaic');
const gamesModule = require('./games');

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

if (process.env.USE_GAMES_MODULE === 'true') {
  console.log('Using Games Module');
  module.exports = Object.assign(module.exports, gamesModule);
}

if (process.env.USE_MANAGEMENT_MODULE === 'true') {
    console.log('Using Management Module');
    const managementModule = require('./management');
    module.exports = Object.assign(module.exports, managementModule);
}
