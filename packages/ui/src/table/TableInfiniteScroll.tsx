import {
  Skeleton,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useMemo } from 'react';

type TableConnection<T> = {
  readonly edges: ReadonlyArray<{
    readonly node: T | null;
  } | null>;
};

export type TableColumns = {
  name: string;
  property: string;
};

type TableInfiniteScrollProps<T> = {
  columns: TableColumns[];
  connection: TableConnection<T>;
  pagination?: {
    loadNext: () => unknown;
    hasNext: boolean;
  };
  isLoadingNext?: boolean;
  isRefetching?: boolean;
  footer?: string;
};

export const TableInfiniteScroll = <T extends unknown>(
  props: TableInfiniteScrollProps<T>,
) => {
  const {
    columns,
    connection,
    pagination,
    isLoadingNext = false,
    isRefetching = false,
    footer,
  } = props;

  const rows = useMemo(
    () => connection?.edges?.map(({ node }) => node) ?? [],
    [connection?.edges],
  );

  const fetchNewPage = () => {
    if (!pagination) {
      return;
    }

    if (isLoadingNext) {
      return;
    }

    if (!pagination.hasNext) {
      return;
    }

    pagination.loadNext && pagination.loadNext();
  };

  const renderColumns = () => {
    return (
      <Tr>
        {columns.map((column) => (
          <Th color={'primary.main'} key={column.property} {...column}>
            {column.name}
          </Th>
        ))}
      </Tr>
    );
  };

  const renderRows = () => {
    return rows.map((row) => {
      return (
        <Tr key={row?.id}>
          {columns.map((column) => (
            <Td key={column.property}>{row[column.property] || '-'}</Td>
          ))}
        </Tr>
      );
    });
  };

  const getBody = () => {
    if (rows.length === 0) {
      return (
        <Tr>
          <Td colSpan={columns.length} textAlign={'center'}>
            Nenhum registro encontrado
          </Td>
        </Tr>
      );
    }

    return renderRows();
  };

  return (
    <TableContainer>
      <Skeleton isLoaded={!isRefetching}>
        <Table variant="simple" bgColor={'white'} borderRadius={'lg'}>
          <TableCaption>{footer}</TableCaption>
          <Thead>{renderColumns()}</Thead>
          <Tbody>{getBody()}</Tbody>
        </Table>
      </Skeleton>
    </TableContainer>
  );
};
