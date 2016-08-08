const requesthelper = require('../middleware/requesthelper');
const promisehelper = require('../middleware/promisehelper');
const config = require('../config');

const article = {
  // 获取文章详情
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
  },
  // 获取文章列表
  getArticles: function (params) {
    return promisehelper.promise((resolve, reject) => {
      requesthelper.request({
        uri: config.origin.misc + '/misc/article/pagebygid',
        qs: {
          gid: config.gid,
          pagenum: params.pageIndex,
          pagesize: params.pageSize,
          catename: params.category
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