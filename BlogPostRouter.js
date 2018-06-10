const {BlogPosts} = require('./models');
const express = require('express');
const router = express.Router()

// return all current Blog posts  
router.get('/', (req, res) => {
  res.json(BlogPosts.get());
  BlogPosts.find().then(posts => {
    res.json(posts.map(post => post.serialize()));
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: 'something went wrong'});
  });
});


router.get('/:id', (req, res) => {
  BlogPosts
    .findById(req.params.id)
    .then(post => res.json(post.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went wrong' });
});


router.post('/', (req, res) => {
  const requiredFields = ['title','content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(item);

  then(BlogPosts => res.status(201).json(BlogPosts.serialize()))
  .catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong'});
  });
});


router.put('/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['title', 'content', 'author'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  BlogPosts
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});


router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post \`${req.params.id}\``);
  res.status(204).json({ message: 'it worked'});
}) 
  .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went wrong' });
    });
});

module.exports = router;