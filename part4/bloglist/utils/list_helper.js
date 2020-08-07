const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, current) => sum + current.likes, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (max, current) => current.likes > max.likes ? { title: current.title, author: current.author, likes: current.likes } : max

  return blogs.reduce(reducer, blogs[0]) || {}
}

const mostBlogs = (blogs) => {
  const authorList = _.map(_.countBy(blogs, 'author'), (val, key) => ( { author: key, blogs: val } ))
  return _.maxBy(authorList, 'blogs') || {}
}

const mostLikes = (blogs) => {
  const reducer = (res, currentObj) => {
    res = res + currentObj.likes
    return res
  }
  const likesList = _.map(_.groupBy(blogs, 'author'), (val, key) => ( { author: key, likes: _.reduce(val, reducer, 0) }))
  return _.maxBy(likesList, 'likes') || {}
}

module.exports =
{
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}