var request = require('request');
var fs = require('fs');
​
function stateToID(state) {
    var states = ["AK", "AL", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "GU", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NH", "NJ", "NM", "NV", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VI", "VT", "WA", "WI", "WV", "WY", "AS", "FM", "MH", "MP", "PW"];
​
    return states.indexOf(state.toUpperCase());
}
​
var comment = {
    'procName' : '16-41',
    'applicant' : 'Joe Person',
    'address.line1' : '1500 Eye St NW',
    'address.line2' : 'APT 1',
    'address.city' : 'Washington',
    'address.state.id' : stateToID('DC'),
    'address.zip' : '20005',
    'address.plusFour' : '',
    'address.intlAddr' : '',
    'upload' : fs.createReadStream('/Users/tennyson/Desktop/comment.txt'),
    'type.id' : 7, //7 is the comment type "COMMENT"
    'contact' : 'applicant_name',
    'intlFlag' : 'false',
    'action:process' : 'Continue'
};
​
​
request.get('http://apps.fcc.gov/ecfs/upload/display', function (err, resp, body) {
    if (!err && resp.statusCode == 200) {
​
        var cookies = resp.headers['set-cookie'];
        var parsedCookies = [];
        cookies.forEach(function(c) {
            parsedCookies.push(c.substring(0, c.indexOf(";")));
        });
​
​
        console.log("cookie are:", parsedCookies);
​
        var options = {
            url: 'http://apps.fcc.gov/ecfs/upload/process',
            formData: comment,
            headers: {
                'Cookie' : parsedCookies.join(';')
            }
        }
​
        request.post(options, function(err2, resp2, body2) {
            console.log(err2, resp2, body2);
        });
​
​
​
    } else {
        console.log("Error getting cookie", err, resp.statusCode);
    }
})
