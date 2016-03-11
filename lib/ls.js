var path = require('path');
var archy = require('archy');
var Module = require('module');

module.exports = exports = factory;
exports['@type'] = 'factory';
exports['@inject'] = ['injective', 'program'];

function factory(injective, program) {
    var Injective = injective.constructor;

    program.command('ls [names...]')
        .description('Print a dependency tree from a given entry point(s)')
        .option('-c, --config <path>', 'Path to config file')
        .action(function(names, program) {
            var config = {};
            var configPath = program.config;

            if (typeof configPath === 'undefined') {
                try {
                    config = require(path.join(process.cwd(), 'injective'));
                } catch (err) { /* It is ok */ }
            } else {
                if (/^\./.test(configPath) || /^\.\./.test(configPath)) {
                    configPath = path.resolve(process.cwd(), configPath);
                }

                config = require(configPath);
            }

            ls(names.length <= 0 ? (config.main || process.cwd()) : names, config);
        });

    function ls(names, config) {
        var module = new Module('injective', null);
        module.paths = Module._nodeModulePaths(process.cwd());
        process.mainModule = module;
        var injective = Injective(module, config);
        var node = Array.isArray(names) ? (names.length === 1 ? createNode(injective, names[0]) : names.map(createNode.bind(null, injective))) : createNode(injective, names);
        console.log(archy(Array.isArray(node) ? {
            label: '[bundle]',
            nodes: node
        } : node));
    }

    ls.createNode = createNode;

    function createNode(injective, name) {
        if (name === 'injective') {
            return {
                label: 'injective',
                nodes: []
            };
        }

        try {
            var filename = injective.resolve(name);
        } catch (err) {
            console.log(err)
            return {
                label: name + ' [invalid]',
                nodes: []
            };
        }

        if (Array.isArray(filename)) {
            return {
                label: name + ' [bundle]',
                nodes: filename.map(createNode.bind(null, injective))
            };
        }

        var exports = require(filename);
        return {
            label: name + ' -> ' + filename + (Injective.isInstantiable(exports) ? ' [' + exports[Injective.TYPE] + ']' : '') + (exports[Injective.SINGLETON] ? ' [singleton]' : ''),
            nodes: (Injective.isInjectable(exports) ? exports[Injective.INJECT] : []).map(createNode.bind(null, Injective(Module._cache[filename], injective._config, injective._context, injective)))
        };
    }

    return ls;
}
