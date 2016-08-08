const requesthelper = require('../middleware/requesthelper');
const promisehelper = require('../middleware/promisehelper');
const config = require('../config');

const game = {
  // 获取推荐游戏
  getRecommends: function (params) {
    return promisehelper.promise((resolve, reject) => {
      requesthelper.request({
        uri: config.origin.misc + '/misc/commonconfig/getdata',
        qs: {
          gid: config.gid,
          type: 'recommend_game_type',
          catnames: params.catnames
        },
        json: true
      }, function (error, response, result) {
        if (error) return reject(error);
        resolve(result.data);
      });
    });
  },
  // 获取游戏列表
  getGames: function (params) {
    return promisehelper.promise((resolve, reject) => {
      requesthelper.request({
        uri: config.origin.game + '/gameinfo/game/pagegamelist',
        qs: {
          state: params.state,
          gname: params.gname,
          catid: params.categoryId,
          pagenum: params.pageIndex,
          pagesize: params.pageSize
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