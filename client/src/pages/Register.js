import gql from 'graphql-tag';
import React, { useContext, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import { useForm } from '../utils/hooks';
import { AuthContext } from '../context/auth';

const Register = (props) => {
    const context = useContext(AuthContext);

    const initialState = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    };
    
    const {onChange, onSubmit, values} = useForm(registerUser, initialState);
    const [errors, setErrors] = useState({});
    
    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update: (proxy, result) => {
            console.log(result);
            context.login(result.data.register);
            props.history.push('/');
        },
        onError: error => {
            let errObject = error.graphQLErrors[0].extensions.exception;
            delete errObject.stacktrace;
            setErrors(errObject);
        },
        variables: values
    });
    
    function registerUser() {
        addUser();
    }

    return (
        <div>
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1 className='page-title'>Register</h1>
                <Form.Input 
                    label='Username'
                    placeholder='Username'
                    name='username'
                    value={values.username}
                    onChange={onChange}
                    error={errors.username ? true : false}
                />
                <Form.Input 
                    label='Email'
                    placeholder='Email'
                    name='email'
                    value={values.email}
                    onChange={onChange}
                    error={errors.email ? true : false}
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
                <Form.Input 
                    label='Confirm Passoword'
                    placeholder='Confirm Passoword'
                    name='confirmPassword'
                    type='password'
                    value={values.confirmPassword}
                    onChange={onChange}
                    error={errors.confirmPassword ? true : false}
                />
                <Button color='purple'>Register</Button>
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

const REGISTER_USER = gql`
    mutation register (
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
     ) {
        register (
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ) {
            id email username createdAt token
        }
    }
`

export default Register;

