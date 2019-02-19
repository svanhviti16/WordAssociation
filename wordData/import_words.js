// imports all "skyldheiti" from the Orðanet API. 

var rp = require('request-promise');

var options = {
    // Limit set as the total number of entries
    uri :'http://nidhoggur.rhi.hi.is/ordanet-api/api/skyldheiti/?limit=264978',
    headers: {
        'User-Agent': 'Request-Promise'
    },

    json: true // Automatically parses the JSON string in the response
};
 
rp(options)
    .then(function (handleData) {
        console.log(handleData);
        const jsonfile = require('jsonfile')
        const file = 'data.json'
        const obj = handleData
        
        jsonfile.writeFile(file, obj, { flag: 'a' }, function (err) {
        if (err) console.error(err)
    })
    
});