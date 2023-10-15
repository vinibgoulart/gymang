import {
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
  Breadcrumb as _Breadcrumb,
} from '@chakra-ui/react';
import { AiOutlineRight } from 'react-icons/ai';

export type BreadcrumbItem = {
  label: string;
  onClick?: () => void;
};

export type BreadcrumbProps = {
  items?: BreadcrumbItem[];
};

export const Breadcrumb = (props: BreadcrumbProps) => {
  return (
    <_Breadcrumb
      spacing={1}
      separator={<Icon as={AiOutlineRight} />}
      color="text.light"
      alignContent={'center'}
    >
      {props.items?.map((item, index) => {
        const getOnClick = () => {
          if (!item.onClick) {
            return {};
          }

          return { onClick: item.onClick };
        };

        return (
          <BreadcrumbItem key={index}>
            <BreadcrumbLink {...getOnClick()}>{item.label}</BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </_Breadcrumb>
  );
};
