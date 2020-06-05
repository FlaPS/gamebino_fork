"use strict";
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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var puppeteer_1 = __importDefault(require("puppeteer"));
var prepare = function () { return __awaiter(void 0, void 0, void 0, function () {
    var browser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, puppeteer_1.default.launch({ ignoreHTTPSErrors: true, args: ['--no-sandbox'] })];
            case 1:
                browser = _a.sent();
                //console.log('browser launched')
                return [2 /*return*/, browser];
        }
    });
}); };
var makePDFRender = function (browser) {
    var browserPromise = browser
        ? new Promise(function (resolve) { return resolve(browser); })
        : prepare();
    return function (url) { return __awaiter(void 0, void 0, void 0, function () {
        var page, start, buffer, browser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    start = new Date();
                    return [4 /*yield*/, browserPromise];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _a.sent();
                    return [4 /*yield*/, page.goto(url, { waitUntil: 'networkidle0' })
                        // @ts-ignore
                        // console.log('internal page load', Number(new Date() - start))
                        // page.pdf() is currently supported only in headless mode.
                        // @see https://bugs.chromium.org/p/chromium/issues/detail?id=753118
                    ];
                case 3:
                    _a.sent();
                    // @ts-ignore
                    // console.log('internal page load', Number(new Date() - start))
                    // page.pdf() is currently supported only in headless mode.
                    // @see https://bugs.chromium.org/p/chromium/issues/detail?id=753118
                    return [4 /*yield*/, page.evaluate(function () {
                        document.querySelectorAll('.blur').forEach(function (e) {
                            // @ts-ignore
                            e.style.filter = 'none';
                            // @ts-ignore
                            e.style.color = 'rgba(0,0,0,0)';
                        });
                    })];
                case 4:
                    // @ts-ignore
                    // console.log('internal page load', Number(new Date() - start))
                    // page.pdf() is currently supported only in headless mode.
                    // @see https://bugs.chromium.org/p/chromium/issues/detail?id=753118
                    _a.sent();
                    return [4 /*yield*/, page.evaluate(function () {
                        window.scrollBy(0, window.innerHeight);
                    })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, page.pdf({
                        format: 'A4',
                        printBackground: true,
                    })
                        // @ts-ignore
                        // console.log('internal pdf generation time', Number(new Date() - start))
                    ];
                case 6:
                    buffer = _a.sent();
                    // @ts-ignore
                    // console.log('internal pdf generation time', Number(new Date() - start))
                    return [4 /*yield*/, page.close()];
                case 7:
                    // @ts-ignore
                    // console.log('internal pdf generation time', Number(new Date() - start))
                    _a.sent();
                    return [2 /*return*/, buffer];
            }
        });
    }); };
};
var yargs_1 = __importDefault(require("yargs"));
var fs_1 = __importDefault(require("fs"));
var _a = yargs_1.default.options({
    url: { type: 'string', demandOption: true, alias: 'u' },
    out: { type: 'string', alias: 'o' },
}).argv, url = _a.url, out = _a.out;
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var render, pdfFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                //console.log(url, out);
                render = makePDFRender();
                return [4 /*yield*/, render(url)];
            case 1:
                pdfFile = _a.sent();
                if (out)
                    fs_1.default.writeFileSync(out, pdfFile);
                else
                    process.stdout.write(pdfFile);
                return [2 /*return*/];
        }
    });
}); };
main().then(function () { return process.exit(); });
