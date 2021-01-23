import React, { useContext, useState } from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client';
import { Card, Grid, Image, Button, Form } from 'semantic-ui-react';
import moment from 'moment';
import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';

const SinglePost = (props) => {
  const postID = props.match.params.postID;
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState('');

  const { data, loading } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postID
    }
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update: () => {
      setComment('');
    },
    variables: {
      postID,
      body: comment
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
            {user && <Card fluid>
              <Card.Content>
                <p>Post a comment</p>
                <Form>
                  <div className="ui action input fluid">
                    <input 
                      type="text" 
                      placeholder="Comment..." 
                      name="comment" 
                      value={comment}
                      onChange={event => setComment(event.target.value)}  
                    />
                    <button 
                      type="submit"
                      className="ui button purple"
                      disabled={comment.trim() === ''}
                      onClick={submitComment}
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              </Card.Content>
            </Card>}
            {comments.map(comment => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  <Image
                    floated='left'
                    size='mini'
                    src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                  />
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                  {user && user.username === comment.username && <DeleteButton postID={id} commentID={comment.id} />}
                </Card.Content>
              </Card>
            ))}
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

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postID: ID!, $body: String!) {
    createComment(postID: $postID, body: $body) {
      id
      comments {
        id body username
      }
      commentCount
    }
  }
`;

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
