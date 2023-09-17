import { ReactElement } from "react";
import { RootLayout } from "../RootLayout";

const Home = () => {
  return <>Bem Vindo!</>;
};

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <RootLayout>
      {page}
    </RootLayout>
  );
};

export default Home;
