import { utils, writeFileXLSX } from 'xlsx';
import { Button } from '@mantine/core';

export interface ExcelColumn<T = any> {
	title: string;
	dataIndex: keyof T;
	render?: (value: any, record: T) => string;
}

interface Props {
	list?: { [key: string]: any }[];
	columns?: ExcelColumn[];
	fileName: string;
	disabled?: boolean;
	onlyColumns?: boolean;
}
export const ExportExcel = ({ list, columns, fileName, disabled = false, onlyColumns = false }: Props) => {
	const exportData = async () => {
		if (list) {
			const newList = list.map((obj) => {
				const newObj: { [key: string]: any } = {};
				Object.keys(obj).forEach((key) => {
					const columnOption = columns?.find((c) => c.dataIndex === key);
					const nameColum = columnOption?.title;
					const renderColumn = columnOption?.render;
					if (!nameColum && onlyColumns) return;
					if (Array.isArray(obj[key])) {
						if (renderColumn) {
							newObj[nameColum ?? key] = renderColumn(obj[key], obj);
						} else {
							newObj[nameColum ?? key] = obj[key].join(',');
						}
					} else {
						if (renderColumn) {
							newObj[nameColum ?? key] = renderColumn(obj[key], obj);
						} else {
							newObj[nameColum ?? key] = obj[key];
						}
					}
				});
				return newObj;
			});
			const wb = utils.book_new();
			const ws = utils.json_to_sheet(newList);
			utils.book_append_sheet(wb, ws, 'Datos');
			writeFileXLSX(wb, fileName + '.xlsx');
		} else {
			console.log('error');
		}
	};

	return (
		<div>
			<Button onClick={exportData} disabled={disabled}>
				Exportar
			</Button>
		</div>
	);
};
