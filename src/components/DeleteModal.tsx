import { Modal, Button, Group, Text } from "@mantine/core";
import { useCallback } from "react";

interface DeleteModalProps {
  opened: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  itemName?: string;
  isLoading?: boolean;
}

export function DeleteModal({
  opened,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item?",
  onClose,
  onConfirm,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  itemName,
  isLoading,
}: DeleteModalProps) {
  const handleConfirm = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <Text mb="md">
        {itemName ? message.replace("this item", itemName) : message}
      </Text>
      <Group justify="flex-end">
        <Button variant="default" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button loading={isLoading} color="red" onClick={handleConfirm}>
          {confirmLabel}
        </Button>
      </Group>
    </Modal>
  );
}
