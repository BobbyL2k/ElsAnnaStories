exports.parseDataJSON = function(data, callback){
        var cheerio = require('cheerio'),
        $ = cheerio.load(data.toString());
        var header = [];
        var result = [];
        head = $('tbody').children('tr');
        head.children().each(function (i,elem){
                header[i] = $(this).text();
                console.log($(this).text()+'\n\n');
        });

        head.nextAll().each(function(i,elem){
                result[i] = {};
                $(this).children().each(function(i2,elem2){
                        result[i][header[i2]] = $(this).text();
                });
        });
        callback(null,result);
};
