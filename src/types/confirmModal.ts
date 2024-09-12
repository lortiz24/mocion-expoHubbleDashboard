import { ReactNode } from 'react';

export type EviusConfirmModalParams = {
	type: ConfirmModalType;
	title: string;
	description: string | ReactNode;
	onCancel?: () => void;
	onConfirm?: () => void;
};

export enum ConfirmModalType {
	confirm = 'confirm',
	delete = 'delete',
}
