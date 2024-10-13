import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../api';
import { Link } from 'react-router-dom';
import { TextField, Button, Container, Typography } from '@mui/material';
import { notifyError, notifySuccess } from '../toastNotification';

const Login = () => {
    const [isSubmitting, setIsSubmitting] = useState(false); // State to track submission

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email format').required('Email is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: async (values) => {
            setIsSubmitting(true); // Set form as submitting
            try {
                const response = await API.post('/auth/login', values);
                if (response?.data?.code === 200) {
                    notifySuccess(response?.data?.message);
                    localStorage.setItem('token', response?.data?.data?.token);
                    localStorage.setItem('userId', response?.data?.data?.id);
                    window.location.href = '/';
                } else {
                    notifyError(response?.data?.message);
                }
            } catch (err) {
                notifyError(err?.response?.data?.message);
                console.error('Login failed', err);
            } finally {
                setIsSubmitting(false); // Reset form to not submitting
            }
        },
    });

    return (
        <Container maxWidth="sm" style={{ marginTop: '50px' }}>
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    margin="normal"
                    id="email"
                    name="email"
                    label="Email"
                    variant="outlined"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />

                <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    type="submit"
                    disabled={isSubmitting} // Disable button while submitting
                >
                    {isSubmitting ? 'Submitting...' : 'Login'} {/* Dynamic button text */}
                </Button>
            </form>
            <div className='d-flex w-100 mt-2 justify-content-end'>
                <Link to="/register">Create an account</Link>
            </div>
        </Container>
    );
};

export default Login;
