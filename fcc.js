var casper = require('casper').create();
var utils = require('utils');

var inputData = {
    'name' : casper.cli.options['name'],
    'email' : casper.cli.options['email'],
    'address.line1' : casper.cli.options['address.line1'],
    'address.line2' : casper.cli.options['address.line2'],
    'address.city' : casper.cli.options['address.city'],
    'address.state' : casper.cli.options['address.state'],
    'address.zip' : casper.cli.options['address.zip'],
    'address.plusFour' : casper.cli.options['address.plusFour'],
    'comment' : casper.cli.options['comment']
};

var inputDocket = casper.cli.options['docket'];

console.dir(JSON.stringify(inputData), inputDocket);

utils.dump(postFCCProceedingComment(inputDocket, inputData));

function postFCCProceedingComment(docket, userData) {
    console.log("H");
    var fccURL = 'http://apps.fcc.gov/ecfs/upload/begin?procName=' + docket + '&filedFrom=X';

    casper.start(fccURL, function() {
        casper.echo('started');
    });
    casper.then (function(){
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
      }, true);
      casper.echo('submitted form');
      this.capture('output.png');
    });

    casper.then(function() {
      this.click('#uploadReviewActions > li:nth-child(2) > a:nth-child(1)');
      casper.echo('clicking confirm');
    });
    casper.then(function(){
        casper.echo('getting confirmation number');
      var confirmationText = this.fetchText('.fieldset > h2:nth-child(1)');
      casper.echo(confirmationText);
      var confirmationNumber = confirmationText.match(/\d+/g); //returns array of matches, should only be one
      if (confirmationNumber.length) {
        return ({
            docket: docket,
            userData: userData,
            confirmation: confirmationNumber[0]
        });
      } else { /* grabbing confirmation number failed, something went wrong! */
          console.log("Failed to parse confirmation number for docket comment", docket, "by user", userData);
          return ({
              docket: docket,
              userData: userData,
              error: true
          });
      }
    });
    casper.run();
}

function stateToID(state) {
    var states = ["AK", "AL", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "GU", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NH", "NJ", "NM", "NV", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VI", "VT", "WA", "WI", "WV", "WY", "AS", "FM", "MH", "MP", "PW"];
    return states.indexOf(state.toUpperCase()) + 1;
}

/* css selector for confirm link #uploadReviewActions > li:nth-child(2) > a:nth-child(1) */

/* confirmation text after hitting the confirm link: ECFS Filing Receipt - Confirmation number: 201638708720 */

/* css selector for confirmation number .fieldset > h2:nth-child(1) */

/* comment confirmation filing link: http://apps.fcc.gov/ecfs/comment/confirm?confirmation=201638708720 */
