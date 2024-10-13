import React, { useEffect, useState } from 'react';
import API from '../api';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { notifyError } from '../toastNotification';
import { Card, CardContent, Typography, Button, CircularProgress, Container, Box } from '@mui/material';

function SinglePost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true); // To manage loading state
    

    useEffect(() => {
        const fetchPost = async () => {
            const res = await API.get(`/posts/get-post/${id}`);
            console.log('res', res);

            try {
                const response = await API.get(`/posts/get-post/${id}`);
                if (response?.data?.code === 200) {
                    setPost(response?.data?.data);
                } else {
                    notifyError(response?.data?.message);
                }
            } catch (err) {
                notifyError(err?.response?.data?.message || 'Failed to fetch post');
                console.error('Failed to fetch post', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        try {
            await API.delete(`/posts/${id}`);
            navigate('/');
        } catch (err) {
            notifyError('Failed to delete post');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!post) {
        return <Typography variant="h5" align="center">No blog post found...</Typography>;
    }

    const {
        _id: postId,
        title: postTitle,
        content: postContent,
        author: {
            username: postAuthor
        } = {} } = post;

    return (
        <Container maxWidth="md" style={{ marginTop: '20px' }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        {postTitle}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {postContent}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Author: {postAuthor || 'Unknown'}
                    </Typography>
                </CardContent>

                <Box display="flex" justifyContent="space-between" padding={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to={`/edit/${postId}`}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </Box>
            </Card>
        </Container>
    );
}

export default SinglePost;
