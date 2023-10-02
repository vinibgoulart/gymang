import {
  Box,
  Stack,
  Heading,
  Text,
  Container,
  SimpleGrid,
} from '@chakra-ui/react';
import { ActionButton, Card, TextGradient } from '@gymang/ui';
import type { GetServerSideProps } from 'next';

import { getToken } from '../auth/getToken';
import { UserRegisterForm } from '../components/user/UserRegisterForm';

const Register = () => {
  return (
    <Box position="relative">
      <Container
        as={SimpleGrid}
        columns={{ base: 1, md: 2 }}
        maxW="7xl"
        py={{ base: 10, sm: 20, lg: 32 }}
        spacing={{ base: 10, lg: 32 }}
      >
        <Stack spacing={8}>
          <Heading fontSize={{ base: '3xl', md: '6xl' }}>
            Alcance
            <TextGradient> seus objetivos</TextGradient> com precisão!
          </Heading>
          <Heading fontSize={{ base: '3xl', md: '6xl' }}>
            <TextGradient> Seu treino...</TextGradient>
          </Heading>
          <Heading fontSize={{ base: '3xl', md: '6xl' }}>
            <TextGradient> Suas metas...</TextGradient>
          </Heading>
        </Stack>
        <Card gap={4} justifyContent={'space-around'}>
          <Stack spacing={2}>
            <Heading color="text.main" fontSize={{ base: '2xl', md: '4xl' }}>
              Entre nessa jornada
              <TextGradient>!</TextGradient>
            </Heading>
            <Text color="text.light">
              Registre-se agora e comece a transformar sua jornada fitness.
              Conquiste suas metas de forma eficaz com nosso aplicativo de
              treino. Junte-se à comunidade fitness e evolua como nunca antes!
            </Text>
          </Stack>
          <Stack>
            <UserRegisterForm />
            <ActionButton variant={'link'} link="/login">
              Já tenho uma conta
            </ActionButton>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = getToken(context);

  if (token) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};

export default Register;
