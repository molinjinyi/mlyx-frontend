const requesthelper = require('../models/requesthelper');
const promisehelper = require('../models/promisehelper');
const config = require('../config');

const article = {
  getArticles: function (params) {
    return new promisehelper.promise((resolve, reject) => {
      requesthelper.request({
        uri: config.origin.misc + '/misc/article/pagebygid',
        qs: {
          gid: config.gid,
          catename: params.cateName,
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
  getArticle: function (params) {
    return promisehelper.promise((resolve, reject) => {
      requesthelper.request({
        uri: config.origin.misc + '/misc/article/findbyid',
        qs: {
          gid: config.gid,
          aid: params.aid
        },
        json: true
      }, function (error, response, result) {
        if (error) return reject(error);
        resolve(result.data);
      });
    });
  }
}
module.exports = article;