import { getCookie } from 'cookies-next';
import type { GetServerSidePropsContext } from 'next';

function getToken(context: GetServerSidePropsContext) {
  const { req, res } = context;
  return getCookie('userToken', { req, res });
}

export { getToken };
