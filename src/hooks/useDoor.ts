import { useState } from 'react';

export const useDoor = <T>() => {
	const [isOpenDoor, setIsOpenDoor] = useState(false);
	const [selectedItem, setSelectedItem] = useState<T>();

	const openDoor = () => {
		setIsOpenDoor(true);
	};

	const closeDoor = () => {
		setIsOpenDoor(false);
		setSelectedItem(undefined);
	};

	const onToggle = () => {
		setIsOpenDoor((isOpen) => !isOpen);
	};

	return { openDoor, closeDoor, onToggle, isOpenDoor, selectedItem, setSelectedItem };
};
