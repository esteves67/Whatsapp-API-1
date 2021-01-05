const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const axios = require('axios');
const mime = require('mime-types');

const qrcode = require('qrcode');
const { Client, MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());



function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}


 
let client;

app.get('/generate', (req, res)=>{

  client = new Client();

  client.on('qr', async qr => {
 
      try{

        const bufferImage = await qrcode.toDataURL(qr);
        res.status(200).json({status: "success", qr: bufferImage}).end(); 
        //res.send('<img src="'+bufferImage+'" width="400" />')

      }catch(err){

        res.status(200).json({status: "error", detail: "Failed to generate QR Code"}).end();
      }
      

  }); 

  client.on('ready', () => {
      console.log('Client is ready!');
  });

  client.initialize();

});
 

app.post('/send', async (req, res)=>{

  let num = req.body.num;
  let msg = req.body.message;

  let numbers = [];
  num.split(',').map((number)=>{ 
    numbers.push(number.trim()) 
  });  

  
  try{

      const success = [];
      for(let i=0; i<numbers.length; i++){

        let number = numbers[i]+'@c.us'; 
        const data = await client.sendMessage(number, msg);

        if(data.ack === 0){
          success.push({success: true, number: numbers[i], detail: numbers[i] + ", Message status success"});
        }else{
          success.push({success: false, number: numbers[i], detail: numbers[i] + ", Message status failed"});
        }

      } 
    
      res.json({status: success})


  }catch(err){

    res.json({status: "error", detail: "Failed to send message, Please authenticate or scan generated barcode"});
 
  }
   
})

 
app.post('/sendMedia', async (req, res)=>{

  let fileUrl = req.body.file;
  let caption = req.body.message;
  let num = req.body.num; 

  let numbers = [];
  num.split(',').map((number)=>{ 
    numbers.push(number.trim()) 
  }); 


 
  try{

    let request = await axios.get(fileUrl, {responseType: 'stream'});

    let cType = request.headers['content-type'];
    const fileExt = mime.extension(cType);

    let code = makeid(10).toUpperCase();
    const dirLoc = './public/'+code
    fs.mkdirSync(dirLoc);
    const fname = makeid(10).toUpperCase()+"."+fileExt;


    const dataUpload = request.data.pipe(fs.createWriteStream(dirLoc+'/'+fname));
    dataUpload.on('finish', async ()=>{
     
      const media = MessageMedia.fromFilePath(dirLoc+"/"+fname); 
      const success = [];

      for(let i=0; i<numbers.length; i++){
        const data = await client.sendMessage(numbers[i]+'@c.us', media, {caption: caption}); 
        if(data.ack === 0){
          success.push({success: true, number: numbers[i], detail: numbers[i] + ", Message status success"});
        }else{
          success.push({success: false, number: numbers[i], detail: numbers[i] + ", Message status failed"});
        }
      }


      fs.unlinkSync(dirLoc+"/"+fname);
      fs.rmdirSync(dirLoc);

      res.json({status: success});
      res.end();

    })

  }catch(err){

    res.json({status: "error", details: "failed to check the URL!"});

  }

  
});



app.listen('3030');

