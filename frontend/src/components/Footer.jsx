import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ py: 2, textAlign: 'center', backgroundColor: '#f8f8f8', mt: 'auto' }}>
      <Typography variant="body2" color="textSecondary">
        &copy; Chayan Ghosh 2024
      </Typography>
    </Box>
  );
};

export default Footer;