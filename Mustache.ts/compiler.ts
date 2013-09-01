module Mustache {

    interface Block {
        type: string;
        value: string;
    }

    function findInstruction(i: number, template: string) {
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

    function getTokenizer(template: string) {
        var last: Block;
        var queued: Block;

        var i = 0;
        var done = false;

        function trimnl(val: string) {
            var i = 0;

            if (val[i] === '\r') {
                i++;
            }

            if (val[i] === '\n') {
                i++;
            }

            return val.substring(i);
        }

        return function getNextToken(): Block {

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
            var outp: Block;
            if (instruction) {

                outp = { type: 'text', value: template.substring(i, instruction.start) };
                queued = { type: 'block', value: instruction.text };

                i = instruction.start + instruction.text.length;
            } else {
                done = true;
                outp = { type: 'text', value: template.substring(i, template.length) };
            }

            if (last &&
                last.type === 'block' &&
                outp.type === 'text' &&
                (last.value[2] === '#' || last.value[2] === '/')) {
                outp.value = trimnl(outp.value);
            }

            return last = outp;
        };
    }

    function getBlockStack(getNextBlock: () => Block) {

        var localBlocks = [];

        var block: Block;
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
                            blocks: getBlockStack(getNextBlock),
                        });
                    } else {
                        localBlocks.push({
                            plugin: 'value',
                            params: block.value.match(/^{{[ ]*([^}]+?)[ ]*}}$/)[1],
                        });
                    }
                    break;
            }
        }

        return localBlocks;
    }

    export function getBlocks(template: string) {

        var blocks: Block[] = [];

        // Tokensize
        var getNextToken = getTokenizer(template);

        return getBlockStack(getNextToken);
    }
}