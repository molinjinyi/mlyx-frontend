const request = require('request');
const config = require('../config');

const link = {
  getLinks: function (params) {
    return [{
      title: '战龙三国',
      url: 'http://zl.qq.com/'
    }, {
      title: '风云无双',
      url: 'http://fengyun.yy.com/'
    }, {
      title: '37游戏',
      url: 'http://www.37.com/'
    }, {
      title: '265G',
      url: 'http://www.265g.com/'
    }];
  }
}
module.exports = link;