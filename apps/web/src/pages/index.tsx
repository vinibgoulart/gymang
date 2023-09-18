import type { ReactElement } from "react";

import { RootLayout } from "../layouts/RootLayout";

function Home() {
  return <>Bem Vindo!</>;
}

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <RootLayout>
      {page}
    </RootLayout>
  );
};

export default Home;
