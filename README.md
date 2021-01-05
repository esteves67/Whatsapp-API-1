# WHATSAPP API
It is inspired base on https://github.com/pedroslopez/whatsapp-web.js

# RUN THE SCRIPT
1. npm install.
2. access to /generate (GET REQUEST) to generate QR code for Whatsapp API.
3. scan the QR Code.
4. After you got the "Client is Ready!" response in the console, you can now send message or send media message to other Whatsapp User.

# SEND MESSAGE
1. make a POST REQUEST to /send with json body num and message.
example :<br />

{"num" : "6285267671232", "message": "Hello world"}<br />

please note that the phone number format is an international format without + sign.


# SEND MEDIA MESSAGE
1. make a POST REQUEST to /sendMedia with json body file (url), message and num.

example : <br />

{"num": "6285267671232", "message": "Hello world", "file": "https://i.ibb.co/TMxrFp2/Screenshot-20201130-235450-Whats-App.jpg"} <br />


please note that the phone number format is an international format without + sign.

# TIPS
if you want to send a message or media message to a lot of numbers, you can add multiple number with , sign.
example :<br />

{"num" : "6285267671232, 6287867651234", "message": "Hello world"}

