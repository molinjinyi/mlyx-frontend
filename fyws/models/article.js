const requesthelper = require('../models/requesthelper');
const promisehelper = require('../models/promisehelper');
const config = require('../config');

const article = {
  getArticles: function (params) {
    var promise = promisehelper.promise((resolve, reject) => {
      requesthelper.request({
        uri: config.domain.misc + '/misc/article/pagebygid',
        qs: {
          gid: config.gid,
          catename: params.cateName,
          pagenum: params.pageIndex,
          pagesize: params.pageSize
        },
        json: true,
        timeout: 30000
      }, function (error, response, result) {
        if (error) return reject(error);
        resolve(result.data);
      });
    });
    return promise;
  },
  getArticle: function (params) {
    return promisehelper.promise((resolve, reject) => {
      requesthelper.request({
        uri: config.domain.misc + '/misc/article/findbyid',
        qs: {
          gid: config.gid,
          aid: params.aid
        },
        json: true,
        timeout: 30000
      }, function (error, response, result) {
        if (error) return reject(error);
        if (result.status == 1) {
          resolve(result.data);
        } else {
          resolve([]);
        }
      });
    });
  }
}
module.exports = article;