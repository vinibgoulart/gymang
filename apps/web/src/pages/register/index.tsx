import {
  Box,
  Stack,
  Heading,
  Text,
  Container,
  SimpleGrid,
} from '@chakra-ui/react';
import { Card, TextGradient } from '@gymang/ui';
import type { ReactElement } from 'react';

import { UserRegisterForm } from '../../components/user/UserRegisterForm';
import { UnauthenticatedLayout } from '../../layouts/UnauthenticatedLayout';

function Register() {
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
          <Heading fontSize={{ base: '3xl', lg: '6xl' }}>
            Alcance
            <TextGradient> seus objetivos</TextGradient> com precisão!
          </Heading>
          <Heading fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}>
            <TextGradient> Seu treino...</TextGradient>
          </Heading>
          <Heading fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}>
            <TextGradient> Suas metas...</TextGradient>
          </Heading>
        </Stack>
        <Card spacing={4}>
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
          <UserRegisterForm />
        </Card>
      </Container>
    </Box>
  );
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};

export default Register;
