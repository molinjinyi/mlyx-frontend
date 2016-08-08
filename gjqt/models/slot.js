const request = require('request');
const config = require('../config');

const slot = {
  getSlots: function (params) {
    return [{
      url: '',
      image: config.assets + '/images/slots/slot_1.jpg'
    }, {
      url: '',
      image: config.assets + '/images/slots/slot_2.jpg'
    }];
  }
}
module.exports = slot;