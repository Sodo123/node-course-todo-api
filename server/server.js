require('./config/config');

var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { Todo }  = require('./models/todo');
var { User }  = require('./models/user');
const {ObjectID} = require('mongodb');
var {authenticate} = require('./middleware/authenticate')
;
var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    console.log(req.body);
    var todo = new Todo({
      text: req.body.text
    });
    todo.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

// GET /todos/123242
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  // Valid id using isValid
  // 404 - send back empty send
  if (!ObjectID.isValid(id)){
    res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if(!todo){
      res.status(404).send();
    }else{
      res.status(200).send({todo});
    }
  }).catch((e) => {
    console.log('Todo not found', e);
  })
  // findById

});

app.delete('/todos/:id', (req, res) => {
    //get the id
    var id = req.params.id;

    if(!ObjectID.isValid(id)){
      res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
      if(!todo){
        return res.status(404).send()
      }

      res.send(todo);
    }).catch((e) => {
      res.status(404).send(e);
    });
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body,['text', 'completed']);

  if(!ObjectID.isValid(id)){
    res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo){
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });

});

// POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body,['email', 'password']);
    var user = new User(body);
    user.save().then(() => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((e) => {
      res.status(400).send(e);
    });
});

app.get('/users/me',authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body,['email', 'password']);
    console.log(body);
    User.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
      })
    }).catch((e) => {
      res.status(400).send();
    });
    //res.send(req.body);
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(3000, () => {
    console.log('Start on port 3000');
});

module.exports = { app };
