const carousel = require('../models/carousel');

const rightcomponents = {
    getCarousels: async function() {
        var carousels = await carousel.getCarousels({
            catnames: 'index_gamedata'
        });
        var data = carousels.data;
        var carouselList = {
            index_gamedata: data
        };

        for (var i = 0, j = data.length; i < j; i++) {
            var item = data[i];
            item.data = JSON.parse(item.data);
            if (!carouselList[item.catname]) {
                carouselList[item.catname] = [];
            }
            carouselList[item.catname].push(item);
        }
        return carouselList;
    }
};
module.exports = rightcomponents;
