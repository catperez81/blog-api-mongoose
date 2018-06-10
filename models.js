const uuid = require('uuid');

const mongoose = require('mongoose');

function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
}

const blogSchema = mongoose.Schema({
  author: {
    firstname: String,
    lastname: String,
    type: String,
    required: true
  },
  title: {type: String, required: true},
  content: {type: String, required: true},
  id: {type: String},
  publishDate: {type: Date}
});

blogSchema.virtual('authorString').get(function() {
  return `${this.author.firstname} ${this.author.lastname}`.trim()});

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
blogSchema.methods.serialize = function() {

  return {
    id: this.id,
    author: this.author,
    title: this.title,
    content: this.content,
    publishDate: this.publishDate
  };
}

const BlogPosts = {
  create: function(title, content, author, publishDate) {
    const post = {
      id: uuid.v4(),
      title: title,
      content: content,
      author: {
        firstName: firstName,
        lastName: lastName,
      },
      publishDate: publishDate || Date.now()
    };
    this.posts.push(post);
    return post;
  },
  get: function(id=null) {
    // if id passed in, retrieve single post,
    // otherwise send all posts.
    if (id !== null) {
      return this.posts.find(post => post.id === id);
    }
    // return posts sorted (descending) by
    // publish date
    return this.posts.sort(function(a, b) {
      return b.publishDate - a.publishDate
    });
  },
  delete: function(id) {
    const postIndex = this.posts.findIndex(
      post => post.id === id);
    if (postIndex > -1) {
      this.posts.splice(postIndex, 1);
    }
  },
  update: function(updatedPost) {
    console.log(updatedPost);
    const {id} = updatedPost;
    const postIndex = this.posts.findIndex(
      post => post.id === updatedPost.id);
    if (postIndex === -1) {
      throw new StorageException(
        `Can't update item \`${id}\` because doesn't exist.`)
    }
    this.posts[postIndex] = Object.assign(
      this.posts[postIndex], updatedPost);
    return this.posts[postIndex];
  }
};

function createBlogPostsModel() {
  const storage = Object.create(BlogPosts);
  storage.posts = [];
  return storage;
}

const BlogPost = mongoose.model('BlogPost', blogSchema);


module.exports = {BlogPost};