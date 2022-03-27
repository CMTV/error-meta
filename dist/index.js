"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.MetaError = exports.throwMetaError = exports.withErrorMeta = exports.disableMetaErrors = exports.enableMetaErrors = void 0;
var chalk_1 = __importDefault(require("chalk"));
//#region Exceptions listener
function listener(error) {
    if (error instanceof MetaError) {
        error.print();
        process.exit(1);
    }
}
function enableMetaErrors() {
    process.addListener('uncaughtExceptionMonitor', listener);
}
exports.enableMetaErrors = enableMetaErrors;
function disableMetaErrors() {
    process.removeListener('uncaughtExceptionMonitor', listener);
}
exports.disableMetaErrors = disableMetaErrors;
//#endregion
//#region Functions
function withErrorMeta(meta, func) {
    var result;
    try {
        func();
    }
    catch (error) {
        if (error instanceof MetaError) {
            error.addMeta(meta);
            error["throw"]();
        }
        throw error;
    }
    return result;
}
exports.withErrorMeta = withErrorMeta;
function throwMetaError(reason, meta) {
    if (meta === void 0) { meta = null; }
    new MetaError(reason, meta)["throw"]();
}
exports.throwMetaError = throwMetaError;
//#endregion
//#region Meta error class
var MetaError = /** @class */ (function () {
    function MetaError(reason, meta) {
        if (meta === void 0) { meta = null; }
        this.reason = reason;
        this.metaItems = [];
        if (meta != null)
            this.addMeta(meta);
    }
    MetaError.prototype.addMeta = function (meta) {
        this.metaItems.push(meta);
    };
    MetaError.prototype["throw"] = function () {
        this.stack = (new Error()).stack;
        throw this;
    };
    MetaError.prototype.print = function () {
        console.log();
        console.log();
        console.log(chalk_1["default"].bgRed.whiteBright.bold(' Error! ') + ' ' + chalk_1["default"].redBright(this.reason));
        console.group();
        this.metaItems.forEach(function (metaItem) {
            console.log();
            MetaError.printMetaItem(metaItem);
        });
        console.groupEnd();
        console.log();
        console.log();
        if (this.stack)
            console.log(this.stack);
    };
    MetaError.printMetaItem = function (meta) {
        if (isObjWithProps(meta)) {
            Object.keys(meta).forEach(function (label, i) {
                if (i !== 0)
                    console.log();
                console.log(chalk_1["default"].bold.whiteBright(label));
                console.log(meta[label]);
            });
        }
        else {
            console.log(chalk_1["default"].bold.magentaBright('<unknown>'));
            console.log(meta);
        }
    };
    return MetaError;
}());
exports.MetaError = MetaError;
//#endregion
//#region Utils
function isObjWithProps(target) {
    if (typeof target !== 'object')
        return false;
    try {
        target['property'];
        return true;
    }
    catch (_a) {
        return false;
    }
}
//#endregion
