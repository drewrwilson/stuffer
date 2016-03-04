var restify = require('restify');  //package for API routes
var pg = require('pg');  //package for SQL db

pg.defaults.parseInt8 = true;


// get db string from environmental var in this format: "postgres://username:password@localhost/database"
var connectionString = process.env.DATABASE_URL;

//run the server
var port = process.env.PORT || 80; //it's required to have this environmental variable set in on deploy on heroku

var server = restify.createServer({
  name: 'stuffer',
  version: '0.0.1'
});

server.pre(restify.CORS());
server.use(restify.fullResponse());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());


// send the database the given query and send the response to the handler
var queryDB = function (query, params, res, outputHandler) {

  if (typeof outputHandler === 'undefined') {
    outputHandler = function (rows) { return rows; };
  }

  // get a pg client from the connection pool
  pg.connect(connectionString, function (err, client, done) {

    var handleError = function (err) {
      // no error occurred, continue with the request
      if (!err) { return false; }

      // An error occurred, remove the client from the connection pool.
      // A truthy value passed to done will remove the connection from the pool
      // instead of simply returning it to be reused.
      // In this case, if we have successfully received a client (truthy)
      // then it will be removed from the pool.
      done(client);

      res.writeHead(500, {'content-type': 'text/plain'});
      res.end('An error occurred, ' + err);
      return true;
    };

    // record the visit
    client.query(query, params, function (err, result) {

      // handle an error from the query
      if (handleError(err)) { return; }

      // return the client to the connection pool for other requests to reuse
      done();

      outputHandler(result.rows);

    });
  });
};


// connects to database
// run select query on database
// send result
// before rows are sent, they're run through an optional preProcess function which by default
// does nothing. See `sendSelectionFirstRow` for example of how this could be used.
var sendSelection = function (query, params, res, preProcess) {

  if (typeof preProcess === 'undefined') {
    preProcess = function (rows) { return rows; };
  }

  var outputHandler = function (rows) {
    res.send(preProcess(rows));
  };

  queryDB(query, params, res, outputHandler);
};


// instead of sending an array of results, return just the first one.
// useful when you know there should only be one result.
var sendSelectionFirstRow = function (query, params, res) {
  var preProcess = function (rows) {
    return rows[0];
    // TODO: what to return if there is no rows[0]? (if rows.length < 1)
  };
  sendSelection(query, params, res, preProcess);
};

// connects to database
// run select query on database
// send result
// before rows are sent, they're run through an optional preProcess function which by default
// does nothing. See `sendSelectionFirstRow` for example of how this could be used.
var sendSelection = function (query, params, res, preProcess) {

  if (typeof preProcess === 'undefined') {
    preProcess = function (rows) { return rows; };
  }

  var outputHandler = function (rows) {
    res.send(preProcess(rows));
  };

  queryDB(query, params, res, outputHandler);
};


// instead of sending an array of results, return just the first one.
// useful when you know there should only be one result.
var sendSelectionFirstRow = function (query, params, res) {
  var preProcess = function (rows) {
    return rows[0];
    // TODO: what to return if there is no rows[0]? (if rows.length < 1)
  };
  sendSelection(query, params, res, preProcess);
};



//Static routes:
// /comments - show all comments
// /comments/:id - show a specific comment


// this is just a route for the index of the API
server.get('/', function (req, res, next) {
  var bs = {
    "this": "",
    "API": "",
    "is": "",
    "just": "",
    "a": "",
    "test": ""
  };

  res.send(bs);
  return next();
});


// /comments
server.get('/comments', function (req, res, next) {

  var query = 'SELECT * FROM comments;';

  sendSelection(query, [], res);

  return next();
});

server.post('/comments', function (req, res, next) {
  var sql = 'INSERT INTO comments ("docket", "email", "first_name", "last_name", "address1", "city", "state", "zip", "comment", "confirmation") VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7), ($8), ($9), ($10)) RETURNING id;';

  var outputHandler = function (rows) {
    res.send(rows[0]);
  }

  queryDB(sql, [req.body.docket, req.body.email, req.body.first_name, req.body.last_name, req.body.address1, req.body.city, req.body.state, req.body.zip, req.body.comment, req.body.confirmation], res, outputHandler);

  return next();

});

// /comments/:id
server.get('/comments/:id', function (req, res, next) {
  sendSelectionFirstRow('SELECT * FROM comments WHERE "id" = ($1);', [req.params.id], res);

  return next();
});


server.listen(port, function () {
  console.log('%s listening at url %s', server.name, server.url);
});
