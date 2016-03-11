/*
**************************************************************
*** This posts a public comment on a particular FCC docket ***
**************************************************************
*
**************************************
*** The parameters this takes are: ***
**************************************
*
*   docket            - required - docket number, a string of the docket eg '16-41'
*   address.line1     - required - street number and street name
*   address.line2     - optional - apartment number or other additional details
*   address.city      - required - name of city
*   address.state     - required - state, in the format of two letter abbreviation, eg 'MA' or 'CA'. Note: for the purposes of this script, 'DC' is considered a state
*   address.zip       - required - 5 digit zip code
*   address.plusFour  - optional - optional addition zip-code digits
*   comment           - required - text of comment. minimum of 5 words, maximum unknown
*
*
***********************
*** Example:        ***
***********************
*
* $:> casperjs fcc.js --docket='16-41' --name='Abbie Hoffman' --email='abbiehoffman.example@example.com' --address.line1='100 Example Street' --address.line2='' --address.city='Worcester' --address.state='CT' --address.zip='01609' --address.plusFour='' --comment='Example comment Example comment Example comment Example comment'
*
*
***********************
*** Important Note: ***
***********************
*
* This is NodeJS code
* This is CasperJS code
* This runs QTWEBKIT, not V8
*
*/

var casper = require('casper').create();
var utils = require('utils');

function stateToID(state) {
  state = String(state)
  var states = { 'AK' : 1, 'AL' : 2, 'AR' : 3, 'AZ' : 4, 'CA' : 5, 'CO' : 6, 'CT' : 7, 'DC' : 8, 'DE' : 9, 'FL' : 10, 'GA' : 11, 'GU' : 12, 'HI' : 13, 'IA' : 14, 'ID' : 15, 'IL' : 16, 'IN' : 17, 'KS' : 18, 'KY' : 19, 'LA' : 20, 'MA' : 21, 'MD' : 22, 'ME' : 24, 'MI' : 25, 'MN' : 26, 'MO' : 27, 'MS' : 28, 'MT' : 29, 'NC' : 30, 'ND' : 31, 'NE' : 32, 'NH' : 33, 'NJ' : 34, 'NM' : 35, 'NV' : 36, 'NY' : 37, 'OH' : 38, 'OK' : 39, 'OR' : 40, 'PA' : 41, 'PR' : 42, 'RI' : 43, 'SC' : 44, 'SD' : 45, 'TN' : 46, 'TX' : 47, 'UT' : 48, 'VA' : 49, 'VI' : 51, 'VT' : 52, 'WA' : 53, 'WI' : 54, 'WV' : 55, 'WY' : 56, 'AS' : 57, 'FM' : 58, 'MH' : 59, 'MP' : 60, 'PW' : 61 };
  return states[state.toUpperCase()];
}

var commentData = {
    'name' : casper.cli.options['name'],
    'email' : casper.cli.options['email'],
    'address.line1' : casper.cli.options['address.line1'],
    'address.line2' : casper.cli.options['address.line2'],
    'address.city' : casper.cli.options['address.city'],
    'address.state' : stateToID(casper.cli.options['address.state']),
    'address.zip' : String(casper.cli.options['address.zip']),
    'address.plusFour' : casper.cli.options['address.plusFour'],
    'comment' : casper.cli.options['comment']
};

var inputDocket = casper.cli.options['docket'];

utils.dump(postFCCProceedingComment(inputDocket, commentData));

function postFCCProceedingComment(docket, comment) {
    var fccURL = 'http://apps.fcc.gov/ecfs/upload/begin?procName=' + docket + '&filedFrom=X';

    casper.start(fccURL, function() {
        casper.echo('started');
    });

    casper.thenEvaluate(function(stateID){
      $('#process_address_state_id').val(stateID);
    }, comment['address.state']);

    casper.then (function(){
      //fill out the form with all of the fields
      this.fill('form#process', {
        'procName': docket,
        'applicant': comment['name'],
        'email': comment['email'],
        'address.line1': comment['address.line1'],
        'address.line2': comment['address.line2'],
        'address.city': comment['address.city'],
        'address.zip': String(comment['address.zip']),
        'address.plusFour': comment['address.plusFour'],
        'briefComment': comment['comment']
      }, true);
      casper.echo('submitted form');
      this.capture('output-form-submit.png');
    });

    casper.then(function() {
      this.capture('output-confirm-page.png');
      // this.click('#uploadReviewActions > li:nth-child(2) > a:nth-child(1)');
      // casper.echo('clicking confirm');
    });
    // casper.then(function(){
    //     casper.echo('getting confirmation number');
    //   var confirmationText = this.fetchText('.fieldset > h2:nth-child(1)');
    //   casper.echo(confirmationText);
    //   var confirmationNumber = confirmationText.match(/\d+/g); //returns array of matches, should only be one
    //   if (confirmationNumber.length) {
    //     return ({
    //         docket: docket,
    //         comment: comment,
    //         confirmation: confirmationNumber[0]
    //     });
    //   } else { /* grabbing confirmation number failed, something went wrong! */
    //       console.log("Failed to parse confirmation number for docket comment", docket, "by user", comment);
    //       return ({
    //           docket: docket,
    //           comment: comment,
    //           error: true
    //       });
    //   }
    // });
    casper.run();
}
