var fccURL = 'http://apps.fcc.gov/ecfs/upload/begin?procName=16-41&filedFrom=X';
var casper = require('casper').create();

casper.start(fccURL, function() {
  this.echo('opening up fccURL');
});

casper.then (function(){
  this.echo('filling it out with example data');

  this.fill('form#process', {
    'procName':'555',
    'applicant': 'example',
    'email': 'example@example.com',
    'address.line1': '14 example st',
    'address.line2': 'Apt #2',
    'address.city': 'Beverly Hills',
    'address.zip': '90210',
    'address.plusFour': '',
    //'address.state.id': 'example',
    'briefComment': 'This is my test comment'
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
