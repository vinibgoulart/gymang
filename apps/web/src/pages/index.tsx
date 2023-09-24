import { ActionButton } from '@gymang/ui';

import { PageHeader } from '../components/PageHeader';
import { RootLayout } from '../layouts/RootLayout';

const Home = () => {
  const actions = (
    <>
      <ActionButton
        link="/workout/create"
        variant={'solid'}
        size={{ base: 'sm', md: 'md' }}
      >
        Adicionar treino
      </ActionButton>
    </>
  );

  return (
    <RootLayout>
      <PageHeader title="Bem vindo!" actions={actions} />
      Bem vindo
    </RootLayout>
  );
};

export default Home;
