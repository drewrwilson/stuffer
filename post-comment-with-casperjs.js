function stateToID(state) {
        var states = ["AK", "AL", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "GU", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NH", "NJ", "NM", "NV", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VI", "VT", "WA", "WI", "WV", "WY", "AS", "FM", "MH", "MP", "PW"];
    return states.indexOf(state.toUpperCase()) + 1;
}

var docket = '16-41';
var userData = {
    'name' : 'Tennyson Holloway',
    'email' : 'tennyson.holloway@gmail.com',
    'address.line1' : '1499 Massachusetts Ave NW',
    'address.line2' : 'APT 114A',
    'address.city' : 'Washington',
    'address.state' : 'DC',
    'address.zip' : '20005',
    'address.plusFour' : '',
    'comment' : 'Diverse video!'
};



var fccURL = 'http://apps.fcc.gov/ecfs/upload/begin?procName=' + docket + '&filedFrom=X';

var casper = require('casper').create();

casper.start(fccURL, function() {
  this.echo('opening up fccURL');
});

casper.then (function(){
  this.echo('filling it out with example data');

  this.fill('form#process', {
    'procName': docket,
    'applicant': userData['name'],
    'email': userData['email'],
    'address.line1': userData['address.line1'],
    'address.line2': userData['address.line2'],
    'address.city': userData['address.city'],
    'address.zip': userData['address.zip'],
    'address.plusFour': userData['address.plusFour'],
    'address.state.id': stateToID(userData['address.state']),
    'briefComment': userData['comment']
  }, false);

  this.echo('filled out, not submitted');
});

casper.then(function(){
  this.echo('capturing screenshot');

  this.capture('output.png', {
         top: 0,
         left: 00,
         width: 1000,
         height: 1000
     });
});

casper.run();

/* css selector for confirm link #uploadReviewActions > li:nth-child(2) > a:nth-child(1) */

/* confirmation text after hitting the confirm link: ECFS Filing Receipt - Confirmation number: 201638708720 */

/* css selector for confirmation number .fieldset > h2:nth-child(1) */

/* comment confirmation filing link: http://apps.fcc.gov/ecfs/comment/confirm?confirmation=201638708720 */
