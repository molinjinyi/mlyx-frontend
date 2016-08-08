const request = require('request');
const config = require('../config');

const carousel = {
  getCarousels: function (params) {
    return [{
      url: '',
      image: config.assets + '/images/carousels/carousel_1.jpg'
    }, {
      url: '',
      image: config.assets + '/images/carousels/carousel_2.jpg'
    }];
  }
}
module.exports = carousel;