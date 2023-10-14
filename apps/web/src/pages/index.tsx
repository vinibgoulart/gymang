import { ActionButton } from '@gymang/ui';

import { PageHeader } from '../components/PageHeader';
import { RootLayout } from '../layouts/RootLayout';

const Home = () => {
  const actions = (
    <>
      <ActionButton link="/workout/create">Adicionar treino</ActionButton>
    </>
  );

  return (
    <RootLayout>
      <PageHeader title="Bem vindo!" actions={actions} />
      O que iremos treinar hoje?
    </RootLayout>
  );
};

export default Home;
