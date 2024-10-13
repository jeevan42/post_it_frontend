import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';
import { notifyError } from '../toastNotification';
import { Card, CardContent, CardActions, Typography, Button, Grid, CircularProgress, Container } from '@mui/material';

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); // To manage loading state

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await API.get('/posts/all-posts');
                if (response?.data?.code === 200) {
                    setPosts(response?.data?.data || []); // Use empty array if data is undefined/null
                } else {
                    notifyError(response?.data?.message || 'Failed to fetch posts');
                }
            } catch (error) {
                notifyError(error?.response?.data?.message || 'An error occurred while fetching posts');
            } finally {
                setLoading(false); // Set loading to false when done
            }
        };
        fetchPosts();
    }, []);

    return (
        <Container>
            <Typography variant="h3" gutterBottom align="center" mt={4}>
                All Blog Posts
            </Typography>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <CircularProgress />
                </div>
            ) : posts.length > 0 ? (
                <Grid container spacing={4} mt={2}>
                    {posts.map((post) => (
                        <Grid item xs={12} sm={6} md={4} key={post._id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        {post.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {post.content.slice(0, 100)}...
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary" component={Link} to={`/post/${post._id}`}>
                                        View post
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="h6" align="center" color="textSecondary" mt={4}>
                    No blog posts available.
                </Typography>
            )}
        </Container>
    );
}

export default Home;
