import {
  Flex,
  Heading,
  Stack,
  Tab,
  TabList,
  Tabs,
  useBreakpointValue,
} from '@chakra-ui/react';
import type { BreadcrumbItem} from '@gymang/ui';
import { Breadcrumb, MenuActionButton } from '@gymang/ui';
import { useRouter } from 'next/router';
import { Children } from 'react';

type Tab = {
  label: string;
  link: string;
};

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  tabs?: Tab[];
  breadcrumbs?: BreadcrumbItem[];
};

export const PageHeader = (props: PageHeaderProps) => {
  const router = useRouter();

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

  const getTabs = () => {
    if (!props.tabs) {
      return null;
    }

    const onClick = (link: string) => {
      router.push(link);
    };

    const activeIndex = props.tabs.findIndex(
      (tab) => router.asPath === tab.link,
    );

    return (
      <Tabs
        size={'sm'}
        variant="enclosed"
        colorScheme="purple"
        defaultIndex={activeIndex}
      >
        <TabList>
          {props.tabs.map((tab) => (
            <Tab onClick={() => onClick(tab.link)} key={tab.link}>
              {tab.label}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    );
  };

  const getBreadcrumbs = () => {
    if (!props.breadcrumbs) {
      return null;
    }

    return <Breadcrumb items={props.breadcrumbs} />;
  };

  return (
    <Stack mb={8}>
      {getBreadcrumbs()}
      <Flex justifyContent={'space-between'} minH={{ base: 3, md: 10 }}>
        {getHeading()}
        {getActions()}
      </Flex>
      {getTabs()}
    </Stack>
  );
};
