import React, { useState } from 'react';
import { Button, Confirm } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { FETCH_POSTS_QUERY } from '../utils/graphql';

const DeleteButton = ({ postID, commentID, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const mutation = commentID ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrComment] = useMutation(mutation, {
    refetchQueries: [{
      query: FETCH_POSTS_QUERY
    }],
    update: (proxy) => {
      setConfirmOpen(false);
      // const data = proxy.readQuery({
      //   query: FETCH_POSTS_QUERY
      // });
      // const filteredPosts = [...data];
      // filteredPosts.getPosts = filteredPosts.getPosts.filter(post => post.id !== postID);
      // proxy.writeQuery({
      //   query: FETCH_POSTS_QUERY,
      //   data: filteredPosts
      // });
      
      if(callback) {
        callback();
      }
    },
    variables: {
      postID,
      commentID
    }
  });

  return (
    <>
      <Button 
        icon='trash alternate'
        as='div'
        color='red'
        floated='right'
        onClick={() => setConfirmOpen(true)}
      />
      <Confirm 
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  );
};

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postID: ID!) {
    deletePost(postID: $postID)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postID: ID!, $commentID: ID!) {
    deleteComment(postID: $postID, commentID: $commentID) {
      id
      comments {
        id username createdAt body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
