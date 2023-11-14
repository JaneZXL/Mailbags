const path = require("path");
const fs = require("fs");
export interface IServerInfo {
    smtp : {
    host: string, port: number,
    auth: { user: string, pass: string }
    },
    imap : {
    host: string, port: number,
    auth: { user: string, pass: string }
    }
   }
   export let serverInfo: IServerInfo; //导出
   const rawInfo: string =
 fs.readFileSync(path.join(__dirname, "../serverInfo.json"));//读取原始的服务器配置信息
serverInfo = JSON.parse(rawInfo);