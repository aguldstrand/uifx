///<Reference path="compiler.ts" />
///<Reference path="node.d.ts" />
module Mustache {

    var fs = require('fs');

    var templatePath = process.argv[2];
    var moduleName = process.argv[3];
    var name = process.argv[4];

    fs.readFile(templatePath, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
            throw err;
        }

        var outp = 'module ' + moduleName + ' { export var ' + name + ' = ' + JSON.stringify(Mustache.getBlocks(data), null, 2) + ';}';
        console.log(outp);

    });
}
