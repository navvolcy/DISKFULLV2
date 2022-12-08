var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var fsPromises = require('fs/promises');
var filesize = require('filesize');
var glob = require('glob');
//utility base comparators
var noSort = function (a, b) { return 0; };
var compareNumbers = function (a, b) { return a - b; };
var compareStrings = function (a, b) { return a.localeCompare(b); };
//filesize utility base comparators
var compareFileNames = function (a, b) { return compareStrings(a.name, b.name); };
var compareFileSizes = function (a, b) { return -compareNumbers(a.size, b.size); }; // minius sign makes it descending
function compareFileExtensions(a, b) {
    var extA = a.name.includes('.') ? a.name.split('.').pop() || "" : '';
    var extB = b.name.includes('.') ? b.name.split('.').pop() || "" : '';
    return compareStrings(extA, extB);
}
//global control flags set to defaults
var path = '.';
var blocksize = false;
var threshold = 0;
var sortOrder = noSort;
var metric = false;
var locale = "US";
var lang = "en";
var help = false;
// read file 
function usage() {
    return __awaiter(this, void 0, void 0, function () {
        var text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fsPromises.readFile(fileOutput('help', 'txt'), 'utf8')]; //help.en-US.txt, help.es-MX.txt
                case 1:
                    text = _a.sent() //help.en-US.txt, help.es-MX.txt
                    ;
                    console.log(text);
                    process.exit();
                    return [2 /*return*/];
            }
        });
    });
}
//create function that grabs the file()
//return the file
function fileOutput(filename, ext) {
    var completeFileName = glob.sync("".concat(filename, ".").concat(lang, "-").concat(locale, ".").concat(ext));
    return "".concat(completeFileName);
}
function setFlags() {
    var args = process.argv.slice(2);
    for (var i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-h':
            case '--help':
                help = true;
                break;
            case '-t':
            case '--threshold':
                threshold = Number(args[++i]) * 1000000000;
                break;
            case '-p':
            case '--path':
                path = args[++i];
                break;
            case '-loc':
            case '--locale':
                if (args[++i]) {
                    locale = args[i];
                }
                console.log(locale);
                break;
            case '-lang':
            case '--lanuage':
                if (args[++i]) {
                    lang = args[i];
                }
                console.log(lang);
                break;
            case '-c':
            case '--config':
                break;
            case '-f':
            case '--filter':
                break;
            case '-m':
            case '-metric':
                metric = true;
                break;
            case '-s':
            case '--sort':
                console.log('sort stub');
                var sortType = args[++i];
                if (sortType === 'alpha') {
                    sortOrder = compareFileNames;
                }
                else if (sortType === 'exten') {
                    sortOrder = compareFileExtensions;
                }
                else if (sortType === 'size') {
                    sortOrder = compareFileSizes;
                }
                break;
            default: console.log('bad input');
        }
    }
}
var getBlkSize = function (num) { return Math.ceil(num / 4096) * 4096; };
function readTree(dirPath) {
    return __awaiter(this, void 0, void 0, function () {
        var dir, names, _i, names_1, name_1, childName, stats, file, subDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dir = {
                        name: dirPath,
                        size: 0,
                        children: []
                    };
                    return [4 /*yield*/, fsPromises.readdir(dirPath)];
                case 1:
                    names = _a.sent();
                    _i = 0, names_1 = names;
                    _a.label = 2;
                case 2:
                    if (!(_i < names_1.length)) return [3 /*break*/, 7];
                    name_1 = names_1[_i];
                    childName = "".concat(dirPath, "/").concat(name_1);
                    console.log(childName, "here");
                    return [4 /*yield*/, fsPromises.stat(childName)];
                case 3:
                    stats = _a.sent();
                    if (!stats.isFile()) return [3 /*break*/, 4];
                    file = {
                        name: childName,
                        size: blocksize ? getBlkSize(stats.size) : stats.size
                    };
                    dir.size += file.size;
                    if (dir && dir.children) {
                        dir.children.push(file);
                    }
                    return [3 /*break*/, 6];
                case 4:
                    if (!stats.isDirectory()) return [3 /*break*/, 6];
                    return [4 /*yield*/, readTree(childName)];
                case 5:
                    subDir = _a.sent();
                    dir.size += subDir.size;
                    if (dir && dir.children) {
                        dir.children.push(subDir);
                    }
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7:
                    if (dir && dir.children) {
                        dir.children.sort(sortOrder);
                    }
                    return [2 /*return*/, dir];
            }
        });
    });
}
function displayTree(dirEntry) {
    if (dirEntry.size < threshold)
        return;
    if (metric) {
        console.log("".concat(dirEntry.name, " ").concat(filesize(dirEntry.size)));
    }
    else
        console.log("".concat(dirEntry.name, " ").concat(dirEntry.size.toLocaleString('en-US'), " bytes"));
    if (!dirEntry.children)
        return; //file
    console.group();
    for (var _i = 0, _a = dirEntry.children; _i < _a.length; _i++) {
        var child = _a[_i];
        displayTree(child);
    }
    console.groupEnd();
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var tree;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setFlags();
                    if (!(help === false)) return [3 /*break*/, 2];
                    return [4 /*yield*/, readTree(path)];
                case 1:
                    tree = _a.sent();
                    displayTree(tree);
                    return [3 /*break*/, 3];
                case 2:
                    usage();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
main();
