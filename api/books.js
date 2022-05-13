// api/books.js
module.exports = function (app, mongoose) {
  //GET EVERY BOOK
  app.get('/books', (req, res) => {
    res.send('Response')
  });

  //POST FUNZIONA
  app.post('/books', (req, res) => {
    const Book =  mongoose.model('Book',{
      author: String,
      title: String,
      text: String
    })
    const book = new Book(
      {author: req.body.author,
       title: req.body.title,
       text: req.body.text})
    book.save().then(() => console.log('meow'));
    res.send(book.author)
  })
  //GET ONE BOOK
  app.get('/books/:id', (req, res) => {
    const schema =  mongoose.model('Book',schema)
    const id = req.params.id;
    Book.find({ "_id": id},function (err, docs) {res.send(docs)})
    
  });
  //PUT
  app.put('/books/:id', (req, res) => {
    const ObjectID = require('mongoose').ObjectID;
    const id = req.params.id;
    const query = { '_id': new ObjectID(id) };
    const body = {
      author: req.body.author,
      title: req.body.title,
      text: req.body.text
    };
    database.collection('books').update(query, body, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  })
//DELETE
  app.delete('/books/:id', (req, res) => {
    const ObjectID = require('mongoose').ObjectID;
    const id = req.params.id;
    const query = { '_id': new ObjectID(id) };
    database.collection('books').remove(query, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  })
} 