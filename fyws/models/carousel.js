const requesthelper = require('../models/requesthelper');
const promisehelper = require('../models/promisehelper');
const config = require('../config');

const carousel = {
  getCarousels: function (params) {
    var timeLog = {
      url: '',
      beginTime: '',
      endTime: '',
      executionTime: '',
    };
    return promisehelper.promise((resolve, reject) => {
      requesthelper.request({
        uri: config.domain.misc + '/misc/commonconfig/getdata',
        qs: {
          type: "pic_turn_type",
          gid: config.gid,
          catnames: params.catnames || ''
        },
        json: true,
        timeout: 30000
      }, function (error, response, result) {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
module.exports = carousel;