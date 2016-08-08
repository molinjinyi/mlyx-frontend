const request = require('request');
const config = require('../config');

const carousel = {
  getCarousels: function (params) {
    return new Promise((resolve, reject) => {
      request({
        uri: config.origin.misc + '/misc/commonconfig/getdata',
        qs: {
          gid: config.gid,
          type: 'pic_turn_type',
          catnames: params.catnames
        },
        json: true
      }, function (error, response, result) {
        if (error) return reject(error);
        resolve(result.data);
      });
    });
  }
}
module.exports = carousel;