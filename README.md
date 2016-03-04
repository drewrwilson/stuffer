# stuffer
fcc docket stuffer

![](stuffer-brainstorm.jpg)

Pseudo code:
* Connect to a database
* Read a CSV
* Hard-coded docket number
* for each item in CSV
* add to db
* submit to fcc with cookie
* get confirmation number
* update db with confirmation number
* output any results


Architecture:
* an API that sends one comment
* a "frontend" app that maintains a database of comments that have been sent, sends requests to API


rough work plan:
 * make the API first, test it so it works with one comment
 * track API in a database
 * use postman in chrome or command line to send to API
 * then build an interface for sending to the API
