
var userData;

var nanobar;

var totalRequests = 0;

$(document).ready(function() {

    $('#csvupload').click(function(e) {
        var csv = $('#csvinput').get(0).files[0];

        var reader = new FileReader();
        reader.onload = function(e) {
            parseCSV(e.target.result);
        };

        reader.readAsText(csv);

        $('.input').hide();
    });

    function parseCSV(csvString) {
        var results = Papa.parse(csvString, {
            header: true,
            skipEmptyLines: true,
            complete: function(results, file) {
                console.log("Parse Complete", results);
                userData = results;
                renderPreview(results);
                $('.send').show();
            }
        });
    }

    function renderPreview(results) {
        var table = $('.csvpreview');
        
        results.meta.fields.forEach(function (header) {
            console.log(header);
            $('#headers').append('<td>' + header + '</td>');
        });

        results.data.slice(0, 10).forEach(function (row) {
            
            function rowString(values) {
                var s = '<tr>';
                Object.keys(values).forEach(function (k) {
                    s += '<td>' + values[k] + '</td>';
                });
                return s + '</tr>';
            };
            $('#values').append(rowString(row));
        });

        totalRequests = results.data.length;
    }

    $('#send').click(function() { sendRequests(); });


    function sendRequests() {

        $('#send').hide();

        nanobar = new Nanobar( {
            bg: '#000000',
            target: document.getElementById('progress_bar'),
            id: 'nano'
        });
        nanobar.go(5);


        var requests = [];
        userData.data.forEach(function (req) {
            requests.push(post(req));
        }); 
        Promise.all(requests).then(function () {
            $('<h2>Completed</h2>').hide().appendTo('.send').fadeIn();
        });
    }

    function post(req) {
        return new Promise(function(resolve, reject) {
            /* replace setTimeout with ajax post */
            setTimeout(function () {
                resolve("Success");
                tickProgress();
            }, Math.random() * 5000);
        });
    }
    
    var completedRequests = 0;
    function tickProgress() {
        completedRequests++;
        nanobar.go(completedRequests / totalRequests * 100);
    }

});
