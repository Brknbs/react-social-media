import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';

const Register = () => {
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const onChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value})
    }

    const onSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div>
            <Form onSubmit={onSubmit} noValidate>
                <h1>Register</h1>
                <Form.Input 
                    label='Username'
                    placeholder='Username'
                    name='username'
                    value={values.username}
                    onChange={onChange}
                />
                <Form.Input 
                    label='Email'
                    placeholder='Email'
                    name='email'
                    value={values.email}
                    onChange={onChange}
                />
                <Form.Input 
                    label='Password'
                    placeholder='Password'
                    name='password'
                    type='password'
                    value={values.password}
                    onChange={onChange}
                />
                <Form.Input 
                    label='Confirm Passoword'
                    placeholder='Confirm Passoword'
                    name='confirmPassword'
                    type='password'
                    value={values.confirmPassword}
                    onChange={onChange}
                />
                <Button primary>Register</Button>
            </Form>
        </div>
    )
}

export default Register;

