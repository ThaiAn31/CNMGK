const express = require('express')
const multer = require('multer')
const upload = multer();
const app = express()
const port = 3000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.use(express.static('./css'));
app.use(express.static('./template'));
app.set('view engine', 'ejs');
app.set('views', './template');


const AWS = require('aws-sdk');
const { response, request } = require('express');
const config = new AWS.Config({
    accessKeyId: 'AKIA36L2BCOIFVEHZ6IA',
    secretAccessKey: '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',
    region: 'us-east-1'

});
AWS.config = config;

const docClient = new AWS.DynamoDB.DocumentClient();

const tableName = 'BaiBao';
app.get('/', (req, res) => {
    const params = {
        TableName: tableName,
    };
    docClient.scan(params, (err, data) => {
        if (err) {
            return res.send('Internal Server Error');

        } else {
            console.log('data = ', data.Items);
            return res.render('index', { BaiBao: data.Items });
        }
    });
});

app.post('/next', upload.fields([]), (req, res) => {
    const { id, tenBaiBao, tenNhomTacGia, chiSoIBN, soTrang, namXuatBan } = req.body;
    console.log(req.body);

    const params = {
        TableName: tableName,
        Item: {
            id: id,
            tenBaiBao: tenBaiBao,
            tenNhomTacGia: tenNhomTacGia,
            chiSoIBN: chiSoIBN,
            soTrang: soTrang,
            namXuatBan: namXuatBan,
        }
    }
    docClient.put(params, (err, data) => {
        if (err) {
            return res.send('Internal Server Error');
        } else {
            return res.redirect("/");
        }
    });    
});

app.post("/delete", upload.fields([]), (req, res) => {
    const listItems = Object.keys(req.body);
  
    if (listItems.length === 0) {
      return res.redirect("/");
    }
  
    function onDeleteItem(index) {
      const params = {
        TableName: tableName,
        Key: {
          id: listItems[index],
        },
      };
  
      docClient.delete(params, (err, data) => {
        if (err) {
          return res.send("error" + err);
        } else {
          if (index > 0) {
            onDeleteItem(index - 1);
          } else {
            return res.redirect("/");
          }
        }
      });
    }
    onDeleteItem(listItems.length - 1);
  });

  app.get('/next', (req, res) => {
    const params = {
        TableName: tableName,
    };
    docClient.scan(params, (err, data) => {
        if (err) {
            return res.send('Internal Server Error');

        } else {
            return res.render('tacvu');
        }
    });
});
