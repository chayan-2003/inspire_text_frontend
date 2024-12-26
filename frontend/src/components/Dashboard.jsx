import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Paper, Grid, Avatar, Divider, List, ListItem, ListItemText,
    CircularProgress, Grow
} from '@mui/material';
import { AccountCircle, Assessment, Timeline, Description } from '@mui/icons-material';
import axios from 'axios';
import Navbar from './Navbar';
const API_URL = import.meta.env.PROD ? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV;
const Dashboard = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios({
                    method: 'get',
                    url: `${API_URL}/api/users/profile`,
                    withCredentials: true // Include cookies in the request
                });

                setProfile(response.data);
            } catch (err) {
                console.error('Error:', err);
                if (err.response?.status === 401) {
                    navigate('/login');
                }
                setError('Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) {
        return (
            <Box className="spinner-container">
                <div className="spinner-3d" />
                <Typography mt={2}>Loading Dashboard...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <>
            <Navbar />
            <Grow in={!loading} timeout={600}>
                <Box
                    className="dashboard-content"
                    sx={{
                        minHeight: '100vh',
                        backgroundColor: '#f5f5f5',
                        pt: 4,
                        pb: 6,
                        background: 'linear-gradient(145deg, #f6f8fb 0%, #e9eef5 100%)'
                    }}
                >
                    <Container maxWidth="lg">
                        <Grid container spacing={3}>
                            {/* Profile Section */}
                            <Grid item xs={12} md={4}>
                                <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                        <Avatar sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}>
                                            <AccountCircle fontSize="large" />
                                        </Avatar>
                                        <Typography variant="h5">{profile?.name}</Typography>
                                        <Typography color="textSecondary">{profile?.email}</Typography>
                                        <Divider sx={{ my: 2, width: '100%' }} />
                                        <Typography variant="subtitle1">
                                            Subscription: {profile?.plan || 'Free'}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Credits Status */}
                            <Grid item xs={12} md={4}>
                                <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Credits Status
                                    </Typography>
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                        <Typography variant="h3" color="primary">
                                            {profile?.credits || 0}
                                        </Typography>
                                        <Typography color="textSecondary">Credits Remaining</Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Account Status */}
                            <Grid item xs={12} md={4}>
                                <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Account Status
                                    </Typography>
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                        <Typography variant="h6" color="primary">
                                            {profile?.status || 'Active'}
                                        </Typography>
                                        <Typography color="textSecondary">
                                            Member since: {new Date(profile?.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Usage Statistics */}
                            <Grid item xs={12}>
                                <Paper elevation={3} sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Usage Statistics
                                    </Typography>
                                    <Grid container spacing={3}>
                                        {[
                                            { icon: Description, label: 'Documents Created', value: profile?.stats?.documents || 0 },
                                            { icon: Assessment, label: 'Words Generated', value: profile?.stats?.words || 0 },
                                            { icon: Timeline, label: 'Usage Time (hrs)', value: profile?.stats?.hours || 0 }
                                        ].map((stat, index) => (
                                            <Grid item xs={12} md={4} key={index}>
                                                <Box textAlign="center">
                                                    <stat.icon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                                                    <Typography variant="h4">{stat.value}</Typography>
                                                    <Typography color="textSecondary">{stat.label}</Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Paper>
                            </Grid>

                            {/* Recent Activity */}
                            <Grid item xs={12}>
                                <Paper elevation={3} sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Recent Activity
                                    </Typography>
                                    <List>
                                        {(profile?.recentActivity || []).map((activity, index) => (
                                            <ListItem key={index}>
                                                <ListItemText
                                                    primary={activity.action}
                                                    secondary={new Date(activity.timestamp).toLocaleString()}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Grow>
        </>
    );
};

export default Dashboard;