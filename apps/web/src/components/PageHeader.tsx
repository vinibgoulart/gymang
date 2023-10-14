import { Flex, Heading, Stack, useBreakpointValue } from '@chakra-ui/react';
import { MenuActionButton } from '@gymang/ui';
import { Children } from 'react';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

export const PageHeader = (props: PageHeaderProps) => {
  const useVariant = () => {
    const variant = useBreakpointValue(
      {
        base: <MenuActionButton actions={props.actions} />,
        md: <Stack flexDir={'row'}>{props.actions}</Stack>,
      },
      {
        fallback: 'md',
      },
    );

    return [variant];
  };

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

  const [variant] = useVariant();

  const getActions = () => {
    if (!props.actions) {
      return null;
    }

    const actionsCount = Children.count(props.actions.props.children);

    if (actionsCount === 1) {
      return props.actions;
    }

    return variant;
  };

  return (
    <Flex justifyContent={'space-between'} mb={4} minH={{ base: 3, md: 10 }}>
      {getHeading()}
      {getActions()}
    </Flex>
  );
};
