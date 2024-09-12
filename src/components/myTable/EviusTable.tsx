import { Box, BoxProps, Center, Group, LoadingOverlay, rem, Table, TableProps, TableThProps } from '@mantine/core';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { MyPaginationControls } from '../myPaginationControls/MyPaginationControls';
import { ListEmpty } from '../listEmpty/ListEmpty';
import { MyPagination } from '../../hooks/useMyPagination';
import { MyLocalPagination, useMyLocalPagination } from '../../hooks/useMyLocalPagination';

interface MyTableProps<T> extends TableProps {
	withPagination?: boolean;
	columns: MyTableColumn<T>[];
	elements: T[];
	pagination?: MyPagination | MyLocalPagination;
	isLoading?: boolean;
	draggableProps?: {
		onDraggable: (params: { from: number; to: number }) => void;
		draggableId: Extract<keyof T, string & keyof T>;
	};
	emptyMessage?: string;
	hiddenColumnWhenEmpty?: boolean;
	scrollContainerProps?: BoxProps & {
		minWidth: React.CSSProperties['minWidth'];
		type?: 'native' | 'scrollarea';
	};
}

export interface MyTableColumn<T> extends TableThProps {
	accessor?: keyof T | (string & NonNullable<unknown>);
	header: string | ReactNode;
	render?: ({ value, record }: { value: T[keyof T] | undefined; record: T }) => React.ReactNode;
	fieldSorted?: boolean;
}

const getValueByAccessor = <T,>(obj: T, accessor: keyof T | string): any => {
	if (typeof accessor === 'string' && accessor.includes('.')) {
		return accessor.split('.').reduce((acc, key) => acc && acc[key], obj);
	}
	return obj[accessor as keyof T];
};

export const MyTable = <T,>(props: MyTableProps<T>) => {
	const {
		columns,
		elements,
		isLoading,
		draggableProps,
		pagination,
		hiddenColumnWhenEmpty,
		emptyMessage,
		scrollContainerProps,
		withPagination,
		...tableProps
	} = props;

	const { paginatedElements, pagination: internalPagination } = useMyLocalPagination(elements);

	const newColumns = useMemo(
		() =>
			columns.map((column, index) => {
				const { fieldSorted } = column;
				if (fieldSorted) {
					return {
						...column,
						header: <Group key={index}>{column.header}</Group>,
					};
				}
				return column;
			}),
		[columns]
	);

	const SwitchScrollContainer = ({ children }: { children: ReactNode }) => {
		return scrollContainerProps ? <Table.ScrollContainer {...scrollContainerProps}>{children}</Table.ScrollContainer> : children;
	};


	const elementListFinal = withPagination ? paginatedElements : elements;

	return (
		<SwitchScrollContainer>
			<Box pos='relative'>
				<LoadingOverlay visible={isLoading} overlayProps={{ radius: 'sm', blur: 2 }} loaderProps={{ type: 'oval' }} zIndex={1} />
				<Table highlightOnHover horizontalSpacing='xl' {...tableProps} hidden={elements.length === 0 && hiddenColumnWhenEmpty}>
					<Table.Thead>
						<Table.Tr>
							{draggableProps && <Table.Th style={{ width: rem(40) }} />}
							{newColumns.map((column, index) => {
								const { accessor, header, render, fieldSorted, ...tableThProps } = column;
								return (
									<Table.Th key={index} {...tableThProps}>
										{column.header}
									</Table.Th>
								);
							})}
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{elementListFinal.map((element, rowIndex) => (
							<Table.Tr key={rowIndex}>
								{newColumns.map((column, colIndex) => {
									const value = column.accessor && getValueByAccessor(element, column.accessor as string);
									return (
										<Table.Td key={colIndex}>{column.render ? column.render({ value, record: element }) : <>{value}</>}</Table.Td>
									);
								})}
							</Table.Tr>
						))}
					</Table.Tbody>
					{pagination && (
						<Table.Caption>
							<Group justify='end'>
								<MyPaginationControls pagination={pagination} />
							</Group>
						</Table.Caption>
					)}
					{withPagination && (
						<Table.Caption>
							<Group justify='end'>
								<MyPaginationControls pagination={internalPagination} />
							</Group>
						</Table.Caption>
					)}
				</Table>
				{elements.length === 0 && (
					<Box mt='xl'>
						<ListEmpty message={emptyMessage} />
					</Box>
				)}
			</Box>
		</SwitchScrollContainer>
	);
};
