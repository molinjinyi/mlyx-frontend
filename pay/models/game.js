const requesthelper = require('../middleware/requesthelper');
const promisehelper = require('../middleware/promisehelper');
const config = require('../config');

const game = {
  getGames: function (params) {
    return promisehelper.promise((resolve, reject) => {
      requesthelper.request({
        uri: config.origin.game + '/gameinfo/game/listgamelist',
        qs: {
          state: params.state,
          gname: params.gname,
          catid: params.catid
        },
        json: true
      }, function (error, response, result) {
        if (error) return reject(error);
        resolve(result.data);
      });
    });
  }
}
module.exports = game;