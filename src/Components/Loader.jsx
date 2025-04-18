import React from 'react';
import { Container, Title, Text, Button, Center, Image, Box } from '@mantine/core';
import PacmanLoader from 'react-spinners/DotLoader';

const NotFound = () => {


  return (
    <Container>
        
      <Center style={{ height: '100vh', flexDirection: 'column' }}>
        <Box style={{ textAlign: 'center' }}>
        <PacmanLoader size={"8rem"} color="#2176c0" /> 
        </Box>
      </Center>
    </Container>
  );
};

export default NotFound;
