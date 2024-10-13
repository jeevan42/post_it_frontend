import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../api';
import { Link } from 'react-router-dom';
import { TextField, Button, Container, Typography } from '@mui/material';
import { notifyError, notifySuccess } from '../toastNotification';

const Register = () => {
    const [isSubmitting, setIsSubmitting] = useState(false); // State to track submission

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            email: Yup.string().email('Invalid email format').required('Email is required'),
            password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
        }),
        onSubmit: async (values) => {
            setIsSubmitting(true);
            try {
                const response = await API.post('/auth/register', values);
                console.log(`/auth/register response`, response);
                if (response?.data?.code === 200) {
                    notifySuccess(response?.data?.message)
                    localStorage.setItem('token', response?.data?.data?.token);
                    localStorage.setItem('userId', response?.data?.data?.id);
                    window.location.href = '/';
                } else {
                    notifyError(response?.data?.message)
                }
            } catch (err) {
                notifyError(err?.response?.data?.message)
                console.error('Registration failed', err);
            } finally {
                setIsSubmitting(false);
            }
        },
    });

    return (
        <Container maxWidth="sm" style={{ marginTop: '50px' }}>
            <Typography variant="h4" gutterBottom>
                Register
            </Typography>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    margin="normal"
                    id="username"
                    name="username"
                    label="Username"
                    variant="outlined"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    helperText={formik.touched.username && formik.errors.username}
                />

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

                <Button color="primary" variant="contained" fullWidth type="submit" disabled={isSubmitting} >
                    {isSubmitting ? 'Submitting...' : 'Register'} {/* Dynamic button text */}
                </Button>
            </form>
            <div className='d-flex w-100 mt-2 justify-content-end'>
               <span className='me-2'>Already have an account</span>  <Link to="/login">Log in</Link><span className='ms-2'>here.</span> 
            </div>
        </Container>
    );
};

export default Register;

