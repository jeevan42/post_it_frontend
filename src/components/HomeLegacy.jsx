import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';
import { notifyError } from '../toastNotification';

const Home = () => {
    const [posts, setPosts] = useState([]); // To store fetched posts
    const [loading, setLoading] = useState(true); // To manage loading state
    const [currentPage, setCurrentPage] = useState(1); // Current page state
    const [postsPerPage] = useState(5); // Number of posts per page
    const [totalPages, setTotalPages] = useState(1); // Total number of pages

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await API.get(`/posts?page=${currentPage}&limit=${postsPerPage}`);
                if (response.code === 200) {
                    setPosts(response?.data.posts || []); // Assuming your API returns a `posts` array
                    setTotalPages(Math.ceil(response?.data.total / postsPerPage)); // Assuming `total` gives total number of posts
                } else {
                    notifyError(response?.data?.message || 'Failed to fetch posts');
                }
            } catch (error) {
                notifyError(error?.response?.data?.message || 'An error occurred while fetching posts');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [currentPage, postsPerPage]);

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>All Blog Posts</h1>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post._id}>
                        <Link to={`/post/${post._id}`}>
                            <h2>{post.title}</h2>
                        </Link>
                        <p>{post.content.slice(0, 100)}...</p>
                    </div>
                ))
            ) : (
                <p>No blog posts available.</p>
            )}

            {/* Pagination Controls */}
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Home;
