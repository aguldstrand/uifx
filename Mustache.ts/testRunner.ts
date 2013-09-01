declare var $;
module TestRunner {
    function runTest(testData) {

        var actual;
        try {
            var template = Mustache.compile(testData.template);
            actual = template(testData.data);
        } catch (ex) {
            actual = "Exception: " + ex;
        }

        document.getElementById("table-body").innerHTML += "<tr class=\"" + (actual === testData.expected ? 'success' : 'fail') + "\"><td>" + testData.name + "</td><td><pre>" + testData.template + "</pre></td><td><pre>" + testData.expected + "</pre></td><td><pre>" + actual + "</pre></td></tr>";
    }

    $.getJSON('/externals/mustache-spec/specs/sections.json', function (data) {
        for (var i = 0; i < data.tests.length; i++) {
            runTest(data.tests[i]);
        }
    });
}