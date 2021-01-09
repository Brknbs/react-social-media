import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Button } from 'semantic-ui-react';

const LikeButton = ({ post: { id, likes, likeCount }, user}) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find(like => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]); 

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: {
      postID: id
    }
  });

  return (
    <>
      {user ? (
        <Button
          color='purple'
          icon='heart'
          basic={!liked}
          label={{ basic: true, color: 'purple', pointing: 'left', content: `${likeCount}` }}
          className='like-button'
          onClick={likePost}
        />
      ) : (
        <Button
          color='purple'
          icon='heart'
          basic={!liked}
          label={{ basic: true, color: 'purple', pointing: 'left', content: `${likeCount}` }}
          as={Link}
          to='/login'
          className='like-button'
        />
      )}
    </>
    
  );
};

const LIKE_POST_MUTATION = gql`
  mutation likePost($postID: ID!) {
    likePost(postID: $postID) {
      id
      likes { id username }
      likeCount
    }
  }
`;

export default LikeButton;
