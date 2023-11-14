"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverInfo = void 0;
const path = require("path");
const fs = require("fs");
const rawInfo = fs.readFileSync(path.join(__dirname, "../serverInfo.json")); //读取原始的服务器配置信息
exports.serverInfo = JSON.parse(rawInfo);
//# sourceMappingURL=ServerInfo.js.map