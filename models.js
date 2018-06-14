const uuid = require('uuid');

const mongoose = require('mongoose');

function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
}

const blogSchema = mongoose.Schema({
  author: {
    firstName: String,
    lastName: String
  },
  title: {type: String, required: true},
  content: {type: String, required: true},
  id: {type: String},
  publishDate: {type: Date, default: Date.now()}
});

blogSchema.virtual('authorString').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim()});

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
blogSchema.methods.serialize = function() {

  return {
    id: this._id,
    // author: {
    //   firstName: this.author.firstName,
    //   lastName: this.author.lastName
    // },
    author: this.authorString,
    title: this.title,
    content: this.content,
    publishDate: this.publishDate
  };
}

const BlogPost = mongoose.model('BlogPost', blogSchema);


module.exports = {BlogPost};