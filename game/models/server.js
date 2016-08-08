const requesthelper = require('../middleware/requesthelper');
const promisehelper = require('../middleware/promisehelper');
const config = require('../config');

const server = {
  // 获取新服预告
  getPreviews: function (params) {
    return promisehelper.promise((resolve, reject) => {
      requesthelper.request({
        uri: config.origin.game + '/gameinfo/server/pagemultigameadvanceserverrecommendlist',
        qs: {
          pagenum: params.pageIndex,
          pagesize: params.pageSize
        },
        json: true
      }, function (error, response, result) {
        if (error) return reject(error);
        resolve(result.data);
      });
    });
  },
  // 获取推荐游戏
  getNewests: function (params) {
    return promisehelper.promise((resolve, reject) => {
      requesthelper.request({
        uri: config.origin.game + '/gameinfo/server/pagemultigamenewserverrecommendlist',
        qs: {
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
module.exports = server;