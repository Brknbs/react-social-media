import React, { useState, useContext } from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from './DeleteButton';

const PostCard = ({ post }) => {
  const { user } = useContext(AuthContext);
  const { body, createdAt, id, username, likeCount, likes, commentCount, comments } = post;

  const postComment = () => {
    console.log('comment');
  };

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated='left'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton post={{ id, likes, likeCount }} user={user} />
        <Button
          color='blue'
          icon='comment'
          basic='true'
          label={{ basic: true, color: 'blue', pointing: 'left', content: `${commentCount}` }}
          onClick={postComment}
          as={Link}
          to={`/posts/${id}`}
        />
        {user && user.username === username && <DeleteButton postID={id} />}
      </Card.Content>
    </Card>
  )
}

export default PostCard;
