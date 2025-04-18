import React from 'react';
import { Container, Title, Text, Button, Center, Image, Box } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import Not404 from '../asserts/notfound.png';
import { ParticleBgnew } from '../asserts/ParticleBgnew';

const NotFound = () => {

  const navigate = useNavigate();

  return (
    <Container>
        <ParticleBgnew/>
      <Center style={{ height: '100vh', flexDirection: 'column' }}>
        <Box style={{ textAlign: 'center' }}>
          <Image src={Not404} alt="404 Image" width={"25rem"} height={"20rem"}/>
          <Title order={1} mt="lg" color='blue' className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 '>404 - Page Not Found</Title>
          <Text color="white" size="lg" mt="md">
            The page you are looking for does not exist.
          </Text>
          <Button variant="filled" size="md" mt="lg" onClick={() => navigate('/login')}>
            Go to Home
          </Button>
        </Box>
      </Center>
    </Container>
  );
};

export default NotFound;
