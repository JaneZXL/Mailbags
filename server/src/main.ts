import path from "path";
import express,
 { Express, NextFunction, Request, Response, response } from "express";
import { serverInfo } from "./ServerInfo";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";
import * as Contacts from "./contacts";
import { IContact } from "./contacts";

const app: Express = express();
// add middleware
app.use(express.json());// json into js
app.use("/",
 express.static(path.join(__dirname, "../../client/dist"))
);//访问根路径的时候找到相应文件

app.use(function(inRequest: Request, inResponse: Response,
    inNext: NextFunction) {
     inResponse.header("Access-Control-Allow-Origin", "*");
     inResponse.header("Access-Control-Allow-Methods",
     "GET,POST,DELETE,OPTIONS"
     );
     inResponse.header("Access-Control-Allow-Headers",
     "Origin,X-Requested-With,Content-Type,Accept"
     );
     inNext();
    });//允许跨域请求，通过设置相应的 CORS 头，以便在浏览器中安全地处理来自不同域的请求


    // List Mailbox
    app.get("/mailboxes",
 async (inRequest: Request, inResponse: Response) => {
 try {
 const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
 const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
 inResponse.json(mailboxes);
 } catch (inError) {
 inResponse.send("error");
 }
 } // IMAP 服务器获取邮箱列表，然后将该列表作为 JSON 数据发送给客户端
);

//List Message
app.get("/mailboxes/:mailbox",
 async (inRequest: Request, inResponse: Response) => {
 try {
 const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
 const messages: IMAP.IMessage[] = await imapWorker.listMessages({
 mailbox : inRequest.params.mailbox //访问动态路径参数的值
 });
 inResponse.json(messages);
 } catch (inError) {
 inResponse.send("error");
 }
 }
);

//get a message
app.get("/messages/:mailbox/:id",
 async (inRequest: Request, inResponse: Response) => {
 try {
 const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
 const messageBody: string | undefined = await imapWorker.getMessageBody({
 mailbox : inRequest.params.mailbox,
 id : parseInt(inRequest.params.id, 10) //id 的值通过 parseInt 转换为十进制整数。该方法返回消息的正文，使用 await 等待异步操作完成
 });                                    //request parameters are always string
 inResponse.send(messageBody);
 } catch (inError) {
 inResponse.send("error");
 }
 }
);

//delete a message
app.delete("/messages/:mailbox/:id",
 async (inRequest: Request, inResponse: Response) => {
 try {
 const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
 await imapWorker.deleteMessage({
 mailbox : inRequest.params.mailbox,
 id : parseInt(inRequest.params.id, 10)
 });
 inResponse.send("ok");
 } catch (inError) {
 inResponse.send("error");
 }
 }
);

//send message
app.post("/messages",
 async (inRequest: Request, inResponse: Response) => { //inRequest contain all the information we need to send a message
 try {
 const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
 await smtpWorker.sendMessage(inRequest.body);
 inResponse.send("ok");
 } catch (inError) {
 inResponse.send("error");
 }
 }
);

//list contacts
app.get("/contacts",
 async (inRequest: Request, inResponse: Response) => {
 try {
 const contactsWorker: Contacts.Worker = new Contacts.Worker();
 const contacts: IContact[] = await contactsWorker.listContacts();
 inResponse.json(contacts);
 } catch (inError) {
 inResponse.send("error");
 }
 }
);

//add contacts
app.post("/contacts",
 async (inRequest: Request, inResponse: Response) => {
 try {
 const contactsWorker: Contacts.Worker = new Contacts.Worker();
 const contact: IContact = await contactsWorker.addContact 
(inRequest.body);
 inResponse.json(contact);
 } catch (inError) {
 inResponse.send("error");
 }
 }
);

//delete contacts
app.delete("/contacts/:id",
 async (inRequest: Request, inResponse: Response) => {
 try {
 const contactsWorker: Contacts.Worker = new Contacts.Worker();
 await contactsWorker.deleteContact(inRequest.params.id);
 inResponse.send("ok");
 } catch (inError) {
 inResponse.send("error");
 }
 }
);

// app.put("/contacts", async(request:Request,response:Response)=>{
//     try{
//         const worker: Contacts.Worker=new Contacts.Worker();
//         const numberOfContactsUpdated: number=await worker.updateContact(
//             request.body
//         );
//         response.send(`Number of contacts update: ${numberOfContactsUpdated}`);

//     } catch(e){
//         response.send('error ${e}');
//     }

// });
app.listen(80,()=>{
    console.log("MailBag server open for requests");
});