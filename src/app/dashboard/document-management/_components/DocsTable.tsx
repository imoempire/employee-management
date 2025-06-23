/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  ActionIcon,
  Group,
  Table,
  Text,
  Skeleton,
  Center,
  Menu,
} from "@mantine/core";
import {
  IconEye,
  IconRepeat,
  IconTrashFilled,
  IconDotsVertical,
} from "@tabler/icons-react";
import { EmployeeDocDataTable } from "./Types";
import { DeleteModal } from "@/components/DeleteModal";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useCustomDelete } from "@/Hooks/useCustomDelete";
import { API_ENDPOINT } from "@/service/api/endpoints";
import { useSession } from "next-auth/react";
import { EditModal } from "../my_docs/_components/EditModal";
import { useCustomPost } from "@/Hooks/useCustomPost";

export default function DocsTable({
  data,
  refetch,
  isLoading,
}: {
  data: EmployeeDocDataTable[] | undefined;
  refetch: () => void;
  isLoading: boolean;
}) {
  const { data: session } = useSession();

  // Function to handle viewing the document
  const handleViewDocument = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const [opened, { open, close }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [selectedDoc, setselectedDoc] = useState<EmployeeDocDataTable | null>(
    null
  );

  const { mutate, isPending } = useCustomDelete({
    url: `${API_ENDPOINT.EMPLOYEE}/${session?.user?.id}/document/${selectedDoc?.id}`,
    onSuccess: () => {
      showNotification({
        title: "Success",
        message: "Item deleted successfully!",
        color: "green",
      });
      close();
      refetch();
    },
    onError: (error: any) => {
      showNotification({
        title: "Error",
        message: error?.message || "Failed to delete item",
        color: "red",
      });
    },
  });

  // Edit hook
  const { mutate: editMutate, isPending: isEditPending } = useCustomPost({
    url: `${API_ENDPOINT.EMPLOYEE}/${session?.user?.id}/document/${selectedDoc?.id}`,
    onSuccess: () => {
      showNotification({
        title: "Success",
        message: "Document updated successfully!",
        color: "green",
      });
      closeEdit();
      refetch();
    },
    onError: (error: any) => {
      showNotification({
        title: "Error",
        message: error?.message || "Failed to update document",
        color: "red",
      });
    },
  });

  const handleDelete = () => {
    mutate({ id: selectedDoc });
  };

  const handleEdit = (values: { document_type: string; file?: File }) => {
    const formData = new FormData();
    formData.append("document_type", values.document_type);
    if (values.file) {
      formData.append("document", values.file);
    }
    editMutate(formData);
  };

  const rows = data?.map((document) => (
    <Table.Tr key={document.id}>
      <Table.Td w="25%" style={{ maxWidth: 0 }}>
        <Text truncate title={document.document_name}>
          {document.document_name}
        </Text>
      </Table.Td>
      <Table.Td w="25%">{document.status}</Table.Td>
      <Table.Td w="25%">{document?.date_uploaded}</Table.Td>
      <Table.Td w="25%">
        {/* Desktop view - show all action buttons */}
        <Group gap={0} visibleFrom="sm">
          <ActionIcon
            c={"dark"}
            variant="subtle"
            size="xl"
            onClick={() => handleViewDocument(document.view_document)}
          >
            <IconEye />
          </ActionIcon>
          <ActionIcon
            onClick={() => {
              setselectedDoc(document);
              openEdit();
            }}
            c={"dark"}
            variant="subtle"
            size="xl"
          >
            <IconRepeat />
          </ActionIcon>
          <ActionIcon
            onClick={() => {
              setselectedDoc(document);
              open();
            }}
            c={"dark"}
            size="xl"
            variant="subtle"
          >
            <IconTrashFilled />
          </ActionIcon>
        </Group>

        {/* Mobile view - show dots menu */}
        <Group hiddenFrom="sm">
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon c={"dark"} variant="subtle" size="xl">
                <IconDotsVertical />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEye size={14} />}
                onClick={() => handleViewDocument(document.view_document)}
              >
                View Document
              </Menu.Item>
              <Menu.Item
                leftSection={<IconRepeat size={14} />}
                onClick={() => {
                  setselectedDoc(document);
                  openEdit();
                }}
              >
                Edit Document
              </Menu.Item>
              <Menu.Item
                leftSection={<IconTrashFilled size={14} />}
                color="red"
                onClick={() => {
                  setselectedDoc(document);
                  open();
                }}
              >
                Delete Document
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="mt-6">
      {isLoading ? (
        <Table verticalSpacing="md" style={{ tableLayout: "fixed" }}>
          <Table.Thead style={{ backgroundColor: "#00000061" }}>
            <Table.Tr>
              <Table.Th w="25%">Document Name</Table.Th>
              <Table.Th w="25%">Status</Table.Th>
              <Table.Th w="25%">Date Uploaded</Table.Th>
              <Table.Th w="25%">Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {[...Array(3)].map((_, index) => (
              <Table.Tr key={index}>
                <Table.Td w="25%">
                  <Skeleton height={20} />
                </Table.Td>
                <Table.Td w="25%">
                  <Skeleton height={20} />
                </Table.Td>
                <Table.Td w="25%">
                  <Skeleton height={20} />
                </Table.Td>
                <Table.Td w="25%">
                  <Group gap={0}>
                    <Skeleton height={36} width={36} radius="sm" />
                    <Skeleton height={36} width={36} radius="sm" />
                    <Skeleton height={36} width={36} radius="sm" />
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ) : !data || data.length === 0 ? (
        <Center h={200}>
          <Text c="dimmed" size="lg">
            No documents available
          </Text>
        </Center>
      ) : (
        <Table verticalSpacing="md" style={{ tableLayout: "fixed" }}>
          <Table.Thead style={{ backgroundColor: "#00000061" }}>
            <Table.Tr>
              <Table.Th w="25%">Document Name</Table.Th>
              <Table.Th w="25%">Status</Table.Th>
              <Table.Th w="25%">Date Uploaded</Table.Th>
              <Table.Th w="25%">Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      )}
      <DeleteModal
        opened={opened}
        onClose={close}
        isLoading={isPending}
        message="Are you sure you want to delete this Document?"
        onConfirm={handleDelete}
      />
      <EditModal
        opened={editOpened}
        onClose={closeEdit}
        isLoading={isEditPending}
        onSubmit={handleEdit}
        initialValues={{
          documentType: selectedDoc?.document_name || "",
          documentUrl: selectedDoc?.view_document || "",
        }}
        documentTypes={["ID", "Contract", "Certificate", "Proof of Address"]}
      />
    </div>
  );
}
