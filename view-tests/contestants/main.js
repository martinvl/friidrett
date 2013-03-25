(function(){var require = function (file, cwd) {
    var resolved = require.resolve(file, cwd || '/');
    var mod = require.modules[resolved];
    if (!mod) throw new Error(
        'Failed to resolve module ' + file + ', tried ' + resolved
    );
    var cached = require.cache[resolved];
    var res = cached? cached.exports : mod();
    return res;
};

require.paths = [];
require.modules = {};
require.cache = {};
require.extensions = [".js",".coffee",".json"];

require._core = {
    'assert': true,
    'events': true,
    'fs': true,
    'path': true,
    'vm': true
};

require.resolve = (function () {
    return function (x, cwd) {
        if (!cwd) cwd = '/';
        
        if (require._core[x]) return x;
        var path = require.modules.path();
        cwd = path.resolve('/', cwd);
        var y = cwd || '/';
        
        if (x.match(/^(?:\.\.?\/|\/)/)) {
            var m = loadAsFileSync(path.resolve(y, x))
                || loadAsDirectorySync(path.resolve(y, x));
            if (m) return m;
        }
        
        var n = loadNodeModulesSync(x, y);
        if (n) return n;
        
        throw new Error("Cannot find module '" + x + "'");
        
        function loadAsFileSync (x) {
            x = path.normalize(x);
            if (require.modules[x]) {
                return x;
            }
            
            for (var i = 0; i < require.extensions.length; i++) {
                var ext = require.extensions[i];
                if (require.modules[x + ext]) return x + ext;
            }
        }
        
        function loadAsDirectorySync (x) {
            x = x.replace(/\/+$/, '');
            var pkgfile = path.normalize(x + '/package.json');
            if (require.modules[pkgfile]) {
                var pkg = require.modules[pkgfile]();
                var b = pkg.browserify;
                if (typeof b === 'object' && b.main) {
                    var m = loadAsFileSync(path.resolve(x, b.main));
                    if (m) return m;
                }
                else if (typeof b === 'string') {
                    var m = loadAsFileSync(path.resolve(x, b));
                    if (m) return m;
                }
                else if (pkg.main) {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                }
            }
            
            return loadAsFileSync(x + '/index');
        }
        
        function loadNodeModulesSync (x, start) {
            var dirs = nodeModulesPathsSync(start);
            for (var i = 0; i < dirs.length; i++) {
                var dir = dirs[i];
                var m = loadAsFileSync(dir + '/' + x);
                if (m) return m;
                var n = loadAsDirectorySync(dir + '/' + x);
                if (n) return n;
            }
            
            var m = loadAsFileSync(x);
            if (m) return m;
        }
        
        function nodeModulesPathsSync (start) {
            var parts;
            if (start === '/') parts = [ '' ];
            else parts = path.normalize(start).split('/');
            
            var dirs = [];
            for (var i = parts.length - 1; i >= 0; i--) {
                if (parts[i] === 'node_modules') continue;
                var dir = parts.slice(0, i + 1).join('/') + '/node_modules';
                dirs.push(dir);
            }
            
            return dirs;
        }
    };
})();

require.alias = function (from, to) {
    var path = require.modules.path();
    var res = null;
    try {
        res = require.resolve(from + '/package.json', '/');
    }
    catch (err) {
        res = require.resolve(from, '/');
    }
    var basedir = path.dirname(res);
    
    var keys = (Object.keys || function (obj) {
        var res = [];
        for (var key in obj) res.push(key);
        return res;
    })(require.modules);
    
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.slice(0, basedir.length + 1) === basedir + '/') {
            var f = key.slice(basedir.length);
            require.modules[to + f] = require.modules[basedir + f];
        }
        else if (key === basedir) {
            require.modules[to] = require.modules[basedir];
        }
    }
};

(function () {
    var process = {};
    
    require.define = function (filename, fn) {
        if (require.modules.__browserify_process) {
            process = require.modules.__browserify_process();
        }
        
        var dirname = require._core[filename]
            ? ''
            : require.modules.path().dirname(filename)
        ;
        
        var require_ = function (file) {
            var requiredModule = require(file, dirname);
            var cached = require.cache[require.resolve(file, dirname)];

            if (cached && cached.parent === null) {
                cached.parent = module_;
            }

            return requiredModule;
        };
        require_.resolve = function (name) {
            return require.resolve(name, dirname);
        };
        require_.modules = require.modules;
        require_.define = require.define;
        require_.cache = require.cache;
        var module_ = {
            id : filename,
            filename: filename,
            exports : {},
            loaded : false,
            parent: null
        };
        
        require.modules[filename] = function () {
            require.cache[filename] = module_;
            fn.call(
                module_.exports,
                require_,
                module_,
                module_.exports,
                dirname,
                filename,
                process
            );
            module_.loaded = true;
            return module_.exports;
        };
    };
})();


require.define("path",function(require,module,exports,__dirname,__filename,process){function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};

});

require.define("__browserify_process",function(require,module,exports,__dirname,__filename,process){var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
        && window.setImmediate;
    var canPost = typeof window !== 'undefined'
        && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return window.setImmediate;
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'browserify-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('browserify-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    if (name === 'evals') return (require)('vm')
    else throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    process.cwd = function () { return cwd };
    process.chdir = function (dir) {
        if (!path) path = require('path');
        cwd = path.resolve(dir, cwd);
    };
})();

});

require.define("/ContestantsView.js",function(require,module,exports,__dirname,__filename,process){var ContestantView = require('./ContestantView');

function ContestantsView() {
    this.initialize();
    this.update();
}

module.exports = ContestantsView;

ContestantsView.prototype.initialize = function () {
    this.setupState();
    this.setupElement();
};

ContestantsView.prototype.setupState = function () {
    this.state = {};
};

ContestantsView.prototype.setupElement = function () {
    this.el = document.createElement('div');
    this.el.className = 'contestants_view';

    var header = document.createElement('div');
    header.className = 'header';
    this.el.appendChild(header);

    this.disciplineField = document.createElement('div');
    this.disciplineField.className = 'discipline';
    header.appendChild(this.disciplineField);

    this.classNameField = document.createElement('div');
    this.classNameField.className = 'class';
    header.appendChild(this.classNameField);

    var info = document.createElement('div');
    info.className = 'info';
    this.el.appendChild(info);

    this.locationField = document.createElement('div');
    this.locationField.className = 'location';
    info.appendChild(this.locationField);

    this.startingTimeField = document.createElement('div');
    this.startingTimeField.className = 'startingTime';
    info.appendChild(this.startingTimeField);

    this.contestantsList = document.createElement('div');
    this.contestantsList.className = 'contestants';
    this.el.appendChild(this.contestantsList);
};

ContestantsView.prototype.setState = function (state) {
    this.state = state;

    this.update();
};

ContestantsView.prototype.update = function () {
    this.disciplineField.innerHTML = this.state.discipline;
    this.classNameField.innerHTML = this.state.className;
    this.locationField.innerHTML = this.state.location;
    this.startingTimeField.innerHTML = this.state.startingTime;

    this.contestantsList.innerHTML = '';
    for (var idx in this.state.contestants) {
        var contestant = this.state.contestants[idx];
        var contestantView = new ContestantView();

        contestantView.setState(contestant);

        this.contestantsList.appendChild(contestantView.el);
    }
};

/*
{
    discipline:'Spyd',
    className:'MJ',
    location:'Hovedbanen',
    startingTime:'09.00',
    contestants:[
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        }
    ]
}
*/

});

require.define("/ContestantView.js",function(require,module,exports,__dirname,__filename,process){function ContestantView() {
    this.initialize();
    this.update();
}

module.exports = ContestantView;

ContestantView.prototype.initialize = function () {
    this.setupState();
    this.setupElement();
};

ContestantView.prototype.setupState = function () {
    this.state = {};
};

ContestantView.prototype.setupElement = function () {
    this.el = document.createElement('div');
    this.el.className = 'contestant';

    this.startNumField = document.createElement('div');
    this.startNumField.className = 'start_num';
    this.el.appendChild(this.startNumField);

    this.presentField = document.createElement('div');
    var presentButton = document.createElement('div');
    presentButton.className = 'button';
    this.presentField.appendChild(presentButton);
    this.el.appendChild(this.presentField);

    var self = this;
    if (this.presentField.hasOwnProperty('ontouchend')) {
        this.presentField.ontouchend = function () {
            self.togglePresent();
        };
    } else {
        this.presentField.onclick = function () {
            self.togglePresent();
        };
    }

    this.nameField = document.createElement('div');
    this.nameField.className = 'name';
    this.el.appendChild(this.nameField);

    this.clubField = document.createElement('div');
    this.clubField.className = 'club';
    this.el.appendChild(this.clubField);
};

ContestantView.prototype.togglePresent = function () {
    this.state.present = !this.state.present;
    this.update();
};

ContestantView.prototype.setState = function (state) {
    this.state = state;

    this.update();
};

ContestantView.prototype.update = function () {
    this.startNumField.innerHTML = this.state.startNum;
    this.presentField.className = 'present' + (this.state.present ? '' : ' not_present');
    this.nameField.innerHTML = this.state.name;
    this.clubField.innerHTML = this.state.club;
};

/*
   {
   startNum:69,
   name:'Mathias Johansen',
   club:'Moss IL',
   present:false
   }
   */

});

require.define("/main.js",function(require,module,exports,__dirname,__filename,process){var ContestantsView = require('./ContestantsView');

var view = new ContestantsView();
var state = {
    discipline:'Spyd',
    className:'MJ',
    location:'Hovedbanen',
    startingTime:'09.00',
    contestants:[
        {
            startNum:69,
            name:'Martin Larsen',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Sebastian Søberg',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:true
        }
    ]
};

view.setState(state);

document.body.appendChild(view.el);

});
require("/main.js");
})();
