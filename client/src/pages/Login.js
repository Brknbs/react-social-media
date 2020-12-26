import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import { useForm } from '../utils/hooks';

const Login = (props) => {
    const initialState = {
        username: '',
        password: ''
    };

    const {onChange, onSubmit, values} = useForm(login, initialState);
    const [errors, setErrors] = useState({});
    
    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update: (proxy, result) => {
            console.log(result);
            props.history.push('/');
        },
        onError: error => {
            let errObject = error.graphQLErrors[0].extensions.exception.errors;
            console.log(error.graphQLErrors)
            delete errObject.stacktrace;
            setErrors(errObject);
        },
        variables: values
    });

    function login() {
        loginUser();
    }

    return (
        <div>
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1 className='page-title'>Login</h1>
                <Form.Input 
                    label='Username'
                    placeholder='Username'
                    name='username'
                    value={values.username}
                    onChange={onChange}
                    error={errors.username ? true : false}
                />
                <Form.Input 
                    label='Password'
                    placeholder='Password'
                    name='password'
                    type='password'
                    value={values.password}
                    onChange={onChange}
                    error={errors.password ? true : false}
                />
                <Button color='purple'>Login</Button>
            </Form>

            {
                Object.keys(errors).length > 0 && (
                    <div className="ui error message">
                        <ul className="list">
                            {Object.values(errors).map(error => (
                                <li key={error}>{error}</li>
                            ))}
                        </ul>
                    </div>
                ) 
            }
        </div>
    )
}

const LOGIN_USER = gql`
    mutation login (
        $username: String!
        $password: String!
     ) {
        login (
            username: $username
            password: $password
        ) {
            id email username createdAt token
        }
    }
`

export default Login;