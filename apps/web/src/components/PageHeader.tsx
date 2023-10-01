import { Flex, Heading, Stack } from '@chakra-ui/react';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

export const PageHeader = (props: PageHeaderProps) => {
  const getHeading = () => {
    if (props.subtitle) {
      return (
        <Heading size={'lg'}>
          {props.title}: {props.subtitle}
        </Heading>
      );
    }

    return <Heading size={'lg'}>{props.title}</Heading>;
  };

  return (
    <Flex justifyContent={'space-between'} mb={2} minH={{ base: 3, md: 10 }}>
      {getHeading()}
      <Stack flexDir={'row'}>{props.actions}</Stack>
    </Flex>
  );
};
