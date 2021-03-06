#!/usr/bin/env node
/* This commentaries are made by hand to be processed by https://github.com/StringManolo/docu */

/* lang -> javascript
* name -> mail
* title -> MAIL - Documntation
* filetype -> ES6 module
* description -> mail.mjs is a cli tool to send emails using any email providder and create/send/read/delete emails using slurp API.
* summary -> Emails directly from CLI.
* sourceLink -> https://github.com/StringManolo/email/blob/master/mail.mjs
* dependency -> node https://node.org,nodemailer https://github.com/nodemailer/nodemailer,mailslurp-client https://github.com/mailslurp/mailslurp-client
*/

import fs from "fs";
import nodemailer from "nodemailer";
import { MailSlurp } from "mailslurp-client";

/* function -> loadFile
* summary -> Get file contents from a file
* param -> filename -> String -> Path to the file
* return -> filename -> String -> File contents
* example -> const myFile = loadFile("./myFile.txt");
console.log(`File contents:
${myFile}
`);
*/
const loadFile = filename => {
  try {
    filename = fs.readFileSync(filename, { encoding: "utf-8" })
  } catch(e) {
    filename = null;
  }
  return filename;
};

/* function -> getline
* summary -> Ask for input from CLI
* return -> rtnval -> String -> Input text
* example -> console.log("Hello user, give me a number");
const userNumber = getline();
*/
const getline = () => {
  let rtnval = "";
  let buffer = Buffer.alloc ? Buffer.alloc(1) : new Buffer(1);
  for(;;) {
    fs.readSync(0, buffer, 0, 1);
    if(buffer[0] === 10) {
      break;
    } else if(buffer[0] !== 13) {
      rtnval += new String(buffer);
    }
  }
  return rtnval;
}

/* function -> output
* summary -> Output text to the console without line break at the end.
* param -> args -> String -> Text to log
* return -> undefined
* example -> output("Write your name here -> ");
const name = getline();
*/
const output = args => {

  /* function -> open
  * summary -> Mimics C style open
  * param -> filename -> String -> Path to the file
  * param -> mode -> String -> Operation mode ("r", "w", "a") 
  * return -> fd -> Object -> FileDescriptor Object to manage file
  * example -> const fd = open("myFile.txt", "w");
fd.puts("Hello!");
fd.close();
  */
  const open = (filename, mode) => {
    const fd = {};
    fd.internalFd = fs.openSync(filename, mode);
    fd.read = (buffer, position, len) => fs.readSync(fd.internalFd, buffer, position, len);
    fd.puts = (str) => fs.writeSync(fd.internalFd, str);
    fd.close = () => fs.closeSync(fd.internalFd);
    return fd;
  }

  const fd = open("/dev/stdout", "w");
  fd.puts(args);
  fd.close();
}

/* function -> parseCli
* summary -> Get user argmuents from CLI
* return -> obj -> Object -> Object holding parsed arguments as properties
* example -> const cli = parseCli();
console.log(`The user provided password is ${cli.password}`);
*/
const parseCli = () => {
  const obj = {};
  for (let i in process.argv) {
    const val = process.argv[+i+1];
    switch(process.argv[i]) {
      case "mail.send":
        obj.send = true;
      break;

      case "mail.read":
        obj.read = true;
      break;

      case "mail.create":
        obj.create = true;
      break;

      case "mail.delete":
        obj.del = true;
      break;

      case "-a":
      case "--api":
        obj.api = val;
      break;

      case "-i":
      case "--id":
      case "--inbox":
      case "--inbox-id":
        obj.id = val;
      break;

      case "-u":
      case "--user":
        obj.user = val;
        obj.service = val.split("@")[1].split(".")[0];
      break;

      case "--use-slurp":
        obj.useSlurp = true;
      break;

      case "-p":
      case "--pass":
      case "--password":
      case "--pwd":
        obj.password = val;
      break;

      case "-t":
      case "--to":
        obj.to = val;
        if (/\,/g.test(val)) {
          obj.to = val.split(",");
        } else {
          obj.to = [val];
        }
      break;

      case "-s":
      case "--subject":
        obj.subject = val;
      break;

      case "-m":
      case "--message":
        obj.message = val;
      break;

      case "-mf":
      case "--message-file":
        obj.message = loadFile(val);
      break;

      case "-n":
      case "--new":
      case "--new-mail":
        obj.newMail = val;
      break;

      case "--html":
        obj.html = true;
      break;

      case "-h":
      case "--help":
        console.log(`usage:
node mail.mjs operation options

operation:
  mail.send           Send a mail. You can use any provider.
  mail.create         Create a Slurp mail.
  mail.read           Read Slurp mail.
  mail.delete         Delete Slurp mail.

options:
  -a --api            Slurp mail api token. https://app.mailslurp.com/
  -i --id             Inbox id (Create inbox to get the id)
     --user-slurtp    Send the mail using Slurp account
  -u --user           Your Email Account.
  -p --password       Your Email Password.
  -t --to             Target Email/s. CSV if multiple
  -s --subject        Email subject.
  -m --message        Email message.
  -n --new            A new Slurp mail id
  -f --message-file   Email message. (read it from filename)
     --html           Send message as HTML
  -h --help           This message.
  
`);
        return;
    }
  }
  return obj;
}

/* function -> checkIfMandatoryArgumentsAreSet
* summary -> Check if all mandatory arguments are set
* param -> obj -> Object -> Object holding the cli properties to check
* return -> bool -> Bool -> Return true if all mandatory args set, else return undefined
* example -> const cli = parseCli();
if (checkIfMandatoryArgumentsAreSet(cli)) {
  console.log("All good, program can keep running");
} else {
  // prompt help message and finish execution or ask user to provide missing arguments
}
*/
const checkIfMandatoryArgumentsAreSet = obj => {
  if (! obj.useSlurp) {
    if (! obj.user && obj.password) {
      if (!obj.load) {
        console.log(`Missing mandatory arguments. --user --password OR --load OR --id`);
        return
      }
      [obj.user, obj.password] = getCredentialsFromFile(obj.load);
    }
  }

  if (!obj.send && !obj.read && !obj.del && !obj.create) {
    console.log(`Missing mandatory operation. mail.send  mail.read  mail.create  mail.del`);
    return;
  }

  if (obj.send) {
    if (!obj.to || !obj.message) {
      console.log(`Missing mandatory argument. --to AND --message`);
      return;
    }
  }

  //if (obj.read) {}

  if (obj.create) {
    if (!obj.newMail) {
      console.log(`Missing mandatory argument. --new-mail`);
      return;
    }
  }

  if (obj.del) {
    if (!obj.id) {
      console.log(`Missing mandatory argument. --id`);
      return;
    }
  }

  if (obj.read || obj.create || obj.del) {
    if (!obj.api) {
      console.log(`Missing mandatory argument. --api`);
      return;
    }
  }

  return true;
}

/* function -> sendEmail
* summary -> Send a new email
* param -> obj -> Object -> All mandatory options
* return -> undefined
* example -> sendEmail(cli);
*/
const sendEmail = obj => {
  if (!obj.useSlurp) {
    const transporter = nodemailer.createTransport({
      service: obj.service,
      auth: {
        user: obj.user,
        pass: obj.password
      }
    });

    const mailOptions = {
      from: obj.user,
      to: obj.to,
      subject: obj.subject || " ",
      [obj.html ? "html" : "text"]: obj.message
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(info.response);
      }
    });
  } else {
    const mailslurp = new MailSlurp({ apiKey: obj.api });

    let id;
    mailslurp.getAllInboxes(0, 20)
    .then(pageInboxes => {
      if (pageInboxes.content.length) {
        console.log("Available email accounts:\n");
      }
      for(let i in pageInboxes.content) {
        console.log(`Email: ${pageInboxes.content[i].emailAddress}
Created: ${pageInboxes.content[i].createdAt}
`);
      }
      output(`Paste the email account you want to use:\n\nemail -> `);
      id = getline().split("@")[0];
      console.log(`\n`);

      const options = {
        to: obj.to,
        subject: obj.subject || "",
        body: obj.message
      };
      mailslurp.sendEmail(id, options)
      .then(unknown => {
        console.log(`${JSON.stringify(unknown, null, 2)}`);
      })
      .catch(e => console.log(`Error sending: ${JSON.stringify(e, null, 2)}

If you are unable to send the mail using slurp, you can use a service like gmail for mail sending.
`));
    });
  }
}

/* function -> receiveEmail
* summary -> Read inbox and emails
* param -> obj -> Object -> All mandatory options
* return -> undefined
* example -> receiveEmail(cli);
*/
const receiveEmail = obj => {
  const mailslurp = new MailSlurp({ apiKey: obj.api });
  
  mailslurp.getAllInboxes(0, 20)
  .then(pageInboxes => {
    if (pageInboxes.content.length) {
      console.log("Available email accounts:\n");
    }
    for(let i in pageInboxes.content) {
      console.log(`Email: ${pageInboxes.content[i].emailAddress}
Created: ${pageInboxes.content[i].createdAt}
`);
    }
    output(`Paste the email account you want to access:\n\nemail -> `);
    const id = getline().split("@")[0];
    console.log(`\n`);
    mailslurp.getEmails(id)
    .then(mails => {
      if (mails.length) {
        console.log("Recived Emails:\n");
        for (let i = 0; i < mails.length; ++i) {
        console.log(`${1 + +i} -
ID: ${mails[i].id}
SUBJECT: ${mails[i].subject}
FROM: ${mails[i].from}
TO: ${mails[i].to.join(",")}
BCC: ${mails[i].bcc}
CC: ${mails[i].cc}
DATE: ${mails[i].createdAt}
READ: ${mails[i].read}
ATTCH: ${mails[i].attachments}

`);
        }
        output("\nPaste the email id you want to read:\n\nid -> ");
        const mailId = getline();
        mailslurp.getEmail(mailId)
        .then(mail => {
          console.log(`MAIL:
UserID: ${mail.userId}
Attachments: ${mail.attachments}
Subject: ${mail.subject}
Message:
${mail.body}

MessageMD5Hash": ${mail.bodyMD5Hash}
Headers: ${JSON.stringify(mail.headers, null, 2)}

`);
        })
      }
    });
  });
}

/* function -> createEmail
* summary -> Create a new email account
* param -> obj -> Object -> All mandatory options
* return -> undefined
* example -> createEmail(cli);
*/
const createEmail = obj => {
  const mailslurp = new MailSlurp({ apiKey: obj.api });

  mailslurp.createInbox()
  .then(inbox => {
    mailslurp.getInbox(inbox.id)
    .then(newInbox => {
      console.log(`Inbox:
ID -> ${newInbox.id}
NAME -> ${newInbox.name}
DESCRIPTION -> ${newInbox.description}
EMAIL -> ${newInbox.emailAddress}
`);
    });
  });
}

/* function -> deleteEmail
* summary -> Send a new email
* param -> obj -> Object -> All mandatory options
* return -> undefined
* example -> deleteEmail(cli);
*/
const deleteEmail = obj => {
  inboxController.deleteInbox(obj.id)
  .then(stat => console.log(`Status: ${stat}`) );
}


/* main: */
const cli = parseCli();
if (checkIfMandatoryArgumentsAreSet(cli)) {
  if (cli.send) {
    sendEmail(cli);
  } else if(cli.read) {
    receiveEmail(cli); 
  } else if(cli.create) {
    createEmail(cli);
  } else if(cli.del) {
    deleteEmail(cli);
  }
}
