const requesthelper = require('../middleware/requesthelper');
const promisehelper = require('../middleware/promisehelper');
const config = require('../config');

const recharge = {
  // 获取充值信息
  getRechargeInfo: function (params) {
    return promisehelper.promise((resolve, reject) => {
      requesthelper.request({
        uri: config.origin.recharge + '/recharge/alipay/getOrderInfo',
        qs: {
          vOrderNo: params.orderNo
        },
        json: true
      }, function (error, response, result) {
        console.log(result)
        if (error) return reject(error);
        resolve(result.data);
      });
    });
  }
}
module.exports = recharge;