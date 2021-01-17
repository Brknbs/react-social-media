import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { Card, Grid, Image, Button } from 'semantic-ui-react';
import moment from 'moment';
import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';

const SinglePost = (props) => {
  const postID = props.match.params.postID;
  const { user } = useContext(AuthContext);

  const { data, loading } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postID
    }
  });

  const deletePostCallback = () => {
    props.history.push('/');
  };

  let postMarkup;

  if (loading) {
    postMarkup = <h1>Loading post...</h1>
  } else {
    const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = data.getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image 
              src='https://react.semantic-ui.com/images/avatar/large/molly.png'
              size='small'
              float='right'
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <Button
                  color='blue'
                  icon='comment'
                  basic='true'
                  label={{ basic: true, color: 'blue', pointing: 'left', content: `${commentCount}` }}
                  as='div'
                  onClick={() => console.log('comment')}
                />
                {user && user.username === username && <DeleteButton postID={id} callback={deletePostCallback} />}
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return (
    <div>
      {postMarkup}
    </div>
  );
};

const FETCH_POST_QUERY = gql`
  query($postID: ID!) {
    getPost(postID: $postID) {
      id body createdAt username likeCount
      likes {
        username
      }
      commentCount
      comments {
        id username createdAt body
      }
    }
  }
`;

export default SinglePost;
