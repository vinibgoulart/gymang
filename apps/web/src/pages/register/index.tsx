import { ReactElement } from "react";
import {
  Box,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";
import { UnauthenticatedLayout } from "../../UnauthenticatedLayout";
import { TextForm } from "@gymang/form";
import { ActionButton, Card } from "@gymang/ui";

const Login = () => {
  return (
    <Box position={"relative"}>
      <Container
        as={SimpleGrid}
        maxW={"7xl"}
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 10, lg: 32 }}
        py={{ base: 10, sm: 20, lg: 32 }}
      >
        <Stack spacing={8}>
          <Heading fontSize={{ base: "3xl", lg: "6xl" }}>
            Alcance
            <Text
              as={"span"}
              bgGradient="linear(to-r, primary.light, primary.dark)"
              bgClip="text"
            >
              {" "}
              seus objetivos
            </Text>{" "}
            com precisão!
          </Heading>
          <Heading fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}>
            <Text
              as={"span"}
              bgGradient="linear(to-r, primary.light, primary.dark)"
              bgClip="text"
            >
              {" "}
              Seu treino...
            </Text>
          </Heading>
          <Heading fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}>
            <Text
              as={"span"}
              bgGradient="linear(to-r, primary.light, primary.dark)"
              bgClip="text"
            >
              {" "}
              Suas metas...
            </Text>
          </Heading>
        </Stack>
        <Card spacing={4}>
          <Stack spacing={2}>
            <Heading color={"text.main"} fontSize={{ base: "2xl", md: "4xl" }}>
              Entre nessa jornada
              <Text
                as={"span"}
                bgGradient="linear(to-r, primary.light, primary.dark)"
                bgClip="text"
              >
                !
              </Text>
            </Heading>
            <Text color={"text.light"} fontSize={{ base: "sm", sm: "md" }}>
              Registre-se agora e comece a transformar sua jornada fitness.
              Conquiste suas metas de forma eficaz com nosso aplicativo de
              treino. Junte-se à comunidade fitness e evolua como nunca antes!
            </Text>
          </Stack>
          <Stack spacing={4}>
            <TextForm placeholder="Primeiro nome" name="firstName" />
            <TextForm placeholder="Email" name="email" />
            <TextForm placeholder="Senha" name="password" type="password" />
            <TextForm
              placeholder="Confirme sua senha"
              name="passwordConfirmation"
              type="password"
            />
            <ActionButton w={"full"}>Cadastre-se</ActionButton>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};

export default Login;
