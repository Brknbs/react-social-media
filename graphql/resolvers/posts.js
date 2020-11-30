const Post = require('../../models/Post');
const checkAuth = require('../../utils/checkAuth');
const { AuthenticationError, UserInputError } = require('apollo-server');

module.exports = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    getPost: async (parent, { postID }) => {
      try {
        const post = await Post.findById(postID);
  
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (error) {
        throw new Error(error);
      }
    }
  },
  Mutation: {
    createPost: async (parent, { body }, context) => {
      const user = checkAuth(context);

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();

      return post;
    },
    deletePost: async (parent, { postID }, context) => {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postID);

        if (user.username === post.username) {
          await post.delete();
          return 'Post deleted successfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    likePost: async (parent, { postID }, context) => {
      const { username } = checkAuth(context);

      const post = await Post.findById(postID);

      if (post) {
        if (post.likes.find(like => like.username === username)) {
          // post already liked, unlike it
          post.likes = post.likes.filter(like => like.username !== username);
        } else {
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          });
        }

        await post.save();
        return post;
      } else {
        throw new UserInputError('Post not found');
      }
    }
  }
}