var Mustache;
(function (Mustache) {
    function findInstruction(i, template) {
        var startPos = template.indexOf("{{", i);
        if (startPos === -1) {
            return null;
        }

        var endPos = template.indexOf("}}", startPos);
        if (endPos === -1) {
            return null;
        }

        return {
            start: startPos,
            text: template.substring(startPos, endPos + 2)
        };
    }

    function getTokenizer(template) {
        var last;
        var queued;

        var i = 0;
        var done = false;

        function trimnl(val) {
            var i = 0;

            if (val[i] === '\r') {
                i++;
            }

            if (val[i] === '\n') {
                i++;
            }

            return val.substring(i);
        }

        return function getNextToken() {
            if (done) {
                return null;
            }

            if (queued) {
                var temp = queued;
                queued = null;
                last = temp;
                return temp;
            }

            var instruction = findInstruction(i, template);
            var outp;
            if (instruction) {
                outp = { type: 'text', value: template.substring(i, instruction.start) };
                queued = { type: 'block', value: instruction.text };

                i = instruction.start + instruction.text.length;
            } else {
                done = true;
                outp = { type: 'text', value: template.substring(i, template.length) };
            }

            if (last && last.type === 'block' && outp.type === 'text' && (last.value[2] === '#' || last.value[2] === '/')) {
                outp.value = trimnl(outp.value);
            }

            return last = outp;
        };
    }

    function getBlockStack(getNextBlock) {
        var localBlocks = [];

        var block;
        while (block = getNextBlock()) {
            switch (block.type) {
                case 'text':
                    localBlocks.push(block.value);
                    break;

                case 'block':
                    if (block.value[2] === '/') {
                        return localBlocks;
                    }

                    if (block.value[2] === '#') {
                        localBlocks.push({
                            plugin: 'standard-iterator',
                            params: block.value.match(/^{{#[ ]*([^}]+?)[ ]*}}$/)[1],
                            blocks: getBlockStack(getNextBlock)
                        });
                    } else {
                        localBlocks.push({
                            plugin: 'value',
                            params: block.value.match(/^{{[ ]*([^}]+?)[ ]*}}$/)[1]
                        });
                    }
                    break;
            }
        }

        return localBlocks;
    }

    function getBlocks(template) {
        var blocks = [];

        // Tokensize
        var getNextToken = getTokenizer(template);

        return getBlockStack(getNextToken);
    }
    Mustache.getBlocks = getBlocks;
})(Mustache || (Mustache = {}));
///<Reference path="compiler.ts" />
///<Reference path="node.d.ts" />
var Mustache;
(function (Mustache) {
    var fs = require('fs');

    var templatePath = process.argv[2];
    var moduleName = process.argv[3];
    var name = process.argv[4];

    fs.readFile(templatePath, { encoding: 'utf-8' }, function (err, data) {
        if (err) {
            throw err;
        }

        var outp = 'module ' + moduleName + ' { export var ' + name + ' = ' + JSON.stringify(Mustache.getBlocks(data), null, 2) + ';}';
        console.log(outp);
    });
})(Mustache || (Mustache = {}));
