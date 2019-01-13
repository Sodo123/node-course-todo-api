const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '5c3ab96ba6ce3d0a06b9fa67';

Todo.find({
    _id: id
}).then((todos) => {
  console.log('Todos', todos);
});

Todo.findOne({
    _id: id
}).then((todo) => {
  console.log('Todo', todo);
});

Todo.findById(id).then((todo) => {
  if(!todo){
    return console.log('Id not found');
  }
  console.log('Todo By Id', todo);
});
