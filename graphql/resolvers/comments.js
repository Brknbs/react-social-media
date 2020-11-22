const { UserInputError, AuthenticationError } = require('apollo-server');
const Post = require('../../models/Post');
const checkAuth = require('../../utils/checkAuth');

module.exports = {
  Mutation: {
    createComment: async (parent, { postID, body }, context) => {
      const { username } = checkAuth(context);

      if (body.trim() === '') {
        throw new UserInputError('Empty comment', {
          errors: {
            body: 'Comment must not be empty'
          }
        });
      } 

      const post = await Post.findById(postID);

      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString()
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError('Post not found');
      }
    },
    deleteComment: async (parent, { postID, commentID }, context) => {
      const { username } = checkAuth(context);

      const post = Post.findOne(postID);

      if (post.username === username) {
        const deletedPost = await post.comments.deleteOne({ commentID });
        return deletedPost;
      } else {
        throw new AuthenticationError('Only the owner of the post can delete the post');
      }
    }
  }
}