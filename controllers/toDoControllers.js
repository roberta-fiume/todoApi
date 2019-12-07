const firebaseConfig = require('../firebaseConfig');

const db = firebaseConfig.firestore;

exports.postTodo = (req, res) => {
    let title = req.body.title;
    let completed = req.body.completed;
    let newDoc = db.collection('todoCollection');
    let dataAsJson = {
        "title": title,
        "completed": completed
    };
    newDoc.add(dataAsJson)
    .then( docRef => {
        dataAsJson.documentId = docRef.id
        res.send(dataAsJson);
    }).catch(err => {
    console.log('Error creating document', err);
  });
}


exports.getTodo = (req, res) => {
  var limit = req.query.limit;
  console.log("THIS IS THE LIMIT", limit)
  let todos = [];
  db.collection('todoCollection').get()
  .then(snapshot => {
    snapshot.docs.forEach(doc => {
      let todo = {
          "id": doc.id,
          "title": doc.data().title,
          "completed": doc.data().completed
    }
    todos.push(todo);
    });
    if (limit) {
        todos = filterArray(todos, limit);
    }
    res.send(JSON.stringify(todos));
  })
  .catch(err => {
    console.log('Error getting document', err);
  });
}

exports.deleteTodo = async (req, res) => {
    try {
    const docId = req.params.documentId;
    await db.collection('todoCollection').doc(docId).delete();
    res.json({
        id: docId,
    })
    } catch(error){
        res.status(500).send(error);
    }
}

exports.updateToDo = async (req, res) => {
    try {
    const docId = req.params.documentId;
    let title = req.body.title;
    let completed = req.body.completed;
    await db.collection('todoCollection').doc(docId).set({ completed: !completed });
    res.json({
        id: docId,
        title: title,
        completed
    })
    console.log("RESPONSE PUT", res)
    } catch(error) {
        res.status(500).send(error);
    }
}

function filterArray(array, limit) {
    return array.slice(0, limit);
}


