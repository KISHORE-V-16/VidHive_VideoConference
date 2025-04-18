import React from 'react';
import { Container, Title, Text, Button, Center, Image, Box } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { ParticleBgnew } from '../asserts/ParticleBgnew';
import forbidden403 from '../asserts/forbidden.png';

const NotAuthorized = () => {
  const navigate = useNavigate();

  return (
    <Container>
        <ParticleBgnew/>
      <Center style={{ height: '100vh', flexDirection: 'column' }}>
        <Box style={{ textAlign: 'center' }}>
          <Image src={forbidden403} alt="403 Image" width={"25rem"} height={"20rem"} className='bg-black'/>
          <Title order={1} mt="lg" color='blue' className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 '>403 - Not Authorized</Title>
          <Text color="white" size="lg" mt="md">
            You do not have permission to access this page.
          </Text>
          <Button variant="filled" size="md" mt="lg" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </Box>
      </Center>
    </Container>
  );
};

export default NotAuthorized;
