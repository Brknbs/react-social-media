import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';

const Register = (props) => {
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    const onChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value})
    }
    
    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update: (proxy, result) => {
            console.log(result);
            props.history.push('/');
        },
        onError: (err) => {
            let errObject = err.graphQLErrors[0].extensions.exception;
            delete errObject.stacktrace;
            setErrors(errObject);
        },
        variables: values
    });

    const onSubmit = (e) => {
        e.preventDefault();
        setErrors({});
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

