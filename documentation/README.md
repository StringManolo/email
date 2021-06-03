  
code: javascript  
# mail
---  
### ES6 module
---  
#### mail.mjs is a cli tool to send emails using any email providder and create/send/read/delete emails using slurp API.
---  
Emails directly from CLI.  
- [node](https://node.org)
- [nodemailer](https://github.com/nodemailer/nodemailer)
- [mailslurp-client](https://github.com/mailslurp/mailslurp-client)  
  
  
##### _function_ **loadFile**  [26](https://github.com/StringManolo/email/blob/master/mail.mjs#L26)  
Get file contents from a file  
Argument: **filename** _String_   Path to the file  
Return: **filename** _String_   File contents  
```javascript
const myFile = loadFile("./myFile.txt");
console.log(`File contents:
${myFile}
`);
```  
  
  
##### _function_ **getline**  [41](https://github.com/StringManolo/email/blob/master/mail.mjs#L41)  
Ask for input from CLI  
Return: **rtnval** _String_   Input text  
```javascript
console.log("Hello user, give me a number");
const userNumber = getline();
```  
  
  
##### _function_ **output**  [62](https://github.com/StringManolo/email/blob/master/mail.mjs#L62)  
Output text to the console without line break at the end.  
Argument: **args** _String_   Text to log  
Return: _undefined_   
```javascript
output("Write your name here
```  
  
  
##### _function_ **open**  [73](https://github.com/StringManolo/email/blob/master/mail.mjs#L73)  
Mimics C style open  
Argument: **filename** _String_   Path to the file  
Argument: **mode** _String_   Operation mode ("r", "w", "a")  
Return: **fd** _Object_   FileDescriptor Object to manage file  
```javascript
const fd = open("myFile.txt", "w");
fd.puts("Hello!");
fd.close();
```  
  
  
##### _function_ **parseCli**  [93](https://github.com/StringManolo/email/blob/master/mail.mjs#L93)  
Get user argmuents from CLI  
Return: **obj** _Object_   Object holding parsed arguments as properties  
```javascript
const cli = parseCli();
console.log(`The user provided password is ${cli.password}`);
```  
  
  
##### _function_ **checkIfMandatoryArgumentsAreSet**  [221](https://github.com/StringManolo/email/blob/master/mail.mjs#L221)  
Check if all mandatory arguments are set  
Argument: **obj** _Object_   Object holding the cli properties to check  
Return: **bool** _Bool_   Return true if all mandatory args set, else return undefined  
```javascript
const cli = parseCli();
if (checkIfMandatoryArgumentsAreSet(cli)) {
  console.log("All good, program can keep running");
} else {
  // prompt help message and finish execution or ask user to provide missing arguments
}
```  
  
  
##### _function_ **sendEmail**  [276](https://github.com/StringManolo/email/blob/master/mail.mjs#L276)  
Send a new email  
Argument: **obj** _Object_   All mandatory options  
Return: _undefined_   
```javascript
sendEmail(cli);
```  
  
  
##### _function_ **receiveEmail**  [341](https://github.com/StringManolo/email/blob/master/mail.mjs#L341)  
Read inbox and emails  
Argument: **obj** _Object_   All mandatory options  
Return: _undefined_   
```javascript
receiveEmail(cli);
```  
  

