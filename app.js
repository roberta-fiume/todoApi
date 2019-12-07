// Copyright 2018, Google LLC.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



'use strict';

const express = require('express');

const bodyParser = require('body-parser');

const firebaseConfig = require('./firebaseConfig');

const db = firebaseConfig.firestore;

const helloController = require('./controllers/helloController');

const toDoControllers = require('./controllers/toDoControllers');

const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.get('/document/:documentId', (req, res) => {
  db.collection('testcollection').doc(req.params.documentId).get()
  .then(doc => {
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      res.send(JSON.stringify(doc.data()));
    }
  })
  .catch(err => {
    console.log('Error getting document', err);
  });
});

app.post('/document', function (req, res) {
    let id = req.body.id;
    let myMessage = req.body.myMessage;
    let newDoc = db.collection('testcollection');
    let dataAsJson = {
        "myMessage": myMessage,
        "myId": id
    };
    newDoc.add(dataAsJson)
    .then( docRef => {
        dataAsJson.documentId = docRef.id
        res.send(dataAsJson);
    }).catch(err => {
    console.log('Error creating document', err);
  });
}),



app.post('/todos', toDoControllers.postTodo),

app.get('/todos', toDoControllers.getTodo),

app.delete('/todos/:documentId', toDoControllers.deleteTodo);


app.put('/todos/:documentId', toDoControllers.updateToDo);

app.get('/hello/:name', helloController.getHello); 


if (module === require.main) {
  // [START server]
  // Start the server
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
  // [END server]
}

module.exports = app;
