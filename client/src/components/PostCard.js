import React, { useState } from 'react';
import { Card, Icon, Label, Image, Button } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const { body, createdAt, id, username, likeCount, likes, commentCount, comments } = post;
  const [liked, setLiked] = useState(false);

  const likePost = () => {
    setLiked(!liked);
    console.log('like');
  };

  const postComment = () => {
    console.log('comment');
  };

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button
          color='purple'
          icon='heart'
          basic={!liked}
          label={{ basic: true, color: 'purple', pointing: 'left', content: `${likeCount}` }}
          onClick={likePost}
        />
        <Button
          color='blue'
          icon='comment'
          basic='true'
          label={{ basic: true, color: 'blue', pointing: 'left', content: `${commentCount}` }}
          onClick={postComment}
        />
      </Card.Content>
    </Card>
  )
}

export default PostCard;
