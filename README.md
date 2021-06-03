

##### Create Slurp mail
node mail.mjs mail.create --new-mail 1 --api $(cat api.txt)

##### Send mail from gmail (or other provider) account to Slurp mail
node mail.mjs mail.send --user strmanolo@gmail.com --password '**********' --to dce9e7d6-ce6b-4b59-a6c8-2660bf4ca2b1@mailslurp.com --subject test --message-file ./myMessage.txt

##### Send mail from slurp to gamil (or other provider)
node mail.mjs mail.send --to strmanolo@gmail.com --message Hola --api $(cat api.txt) --use-slurpt
> Gmail will probably ban slurp service due to other clients spam actions

##### Read Slurp Email
node mail.mjs mail.read --api $(cat api.txt)
