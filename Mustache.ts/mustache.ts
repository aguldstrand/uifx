///<Reference path="compiler.ts" />
module Mustache {
    var templates = {};
    var plugins = {};

    interface IDataStackFrame {
        parent?: IDataStackFrame;
        value: any;
    }

    plugins['value'] = function valuePlugin(stackBlock: StackBlock, data: IDataStackFrame) {
        return getParamValue(stackBlock.params, data);
    };

    plugins['standard-iterator'] = function standardIteratorPlugin(stackBlock: StackBlock, data: IDataStackFrame) {
        var innerData = getParamValue(stackBlock.params, data);
        if (!innerData) {
            return "";
        }

        // Boolean
        var innerDataType = typeof (innerData);
        if (innerDataType === 'boolean') {
            return innerTemplate(stackBlock.blocks, data);
        }

        // Array
        if (innerData instanceof Array) {
            var outp = "";
            var len = innerData.length;
            for (var i = 0; i < len; i++) {
                outp += innerTemplate(stackBlock.blocks, {
                    parent: data,
                    value: innerData[i]
                });
            }
            return outp;
        }

        if (innerDataType === 'object') {
            return innerTemplate(stackBlock.blocks, {
                parent: data,
                value: innerData
            });
        }

        throw "not supported value type";
    };

    function getParamValue(name: string, data: IDataStackFrame) {

        if (name === '.') {
            return data.value;
        }

        var pieces = name.split('.');
        if (pieces.length === 1) {

            for (var frame = data; frame; frame = frame.parent) {
                var val = frame.value[name];
                if (val) {
                    return val;
                }
            }
            return null;

        } else {

            var value = data.value;
            var len = pieces.length;
            for (var i = 0; i < len; i++) {
                value = getParamValue(pieces[i], {
                    parent: null,
                    value: value
                });

                if (!value) {
                    return null;
                }
            }
            return value;
        }
    }

    interface StackBlock {
        plugin: string;
        params: string;
        blocks: any[];
    }

    function innerTemplate(blocks: any[], data: IDataStackFrame) {
        var outp = "";

        var len = blocks.length;
        for (var i = 0; i < len; i++) {
            var block = blocks[i];
            if (typeof (block) === 'string') {
                outp += blocks[i];
            } else {
                outp += plugins[block.plugin](block, data);
            }
        }

        return outp;
    }

    export function compile(template: any) {
        var blocks = Mustache.getBlocks(template);
        return data => innerTemplate(blocks, { value: data });
    }
}