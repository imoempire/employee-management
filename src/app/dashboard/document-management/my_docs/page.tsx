/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { Suspense, useEffect, useState } from "react";
import DocsTable from "../_components/DocsTable";
import {
  IconArrowNarrowLeft,
  IconCheck,
  IconFileTypeDoc,
  IconPhoto,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Image,
  Modal,
  Paper,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { useRouter, useSearchParams } from "next/navigation";
import { API_ENDPOINT } from "@/service/api/endpoints";
import { showNotification } from "@mantine/notifications";
import { useCustomPost } from "@/Hooks/useCustomPost";
import { useSession } from "next-auth/react";
import { useCustomGet } from "@/Hooks/useCustomGet";
import { EmployeeDocData } from "../_components/Types";
import Loading from "@/components/loading";

interface FormValues {
  documentType: string;
  file: FileWithPath | null;
}

export default function Page() {
  const { data } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [opened, { open, close }] = useDisclosure(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // TABLE DATA
  const {
    data: EmployeeDocs,
    refetch,
    isLoading,
  } = useCustomGet<EmployeeDocData>({
    url: `${API_ENDPOINT.EMPLOYEE}/${data?.user?.id}/document-list`,
  });

  //API DATA
  const { data: DocumentType, refetch: DocumentTypeRefetch } = useCustomGet<{
    available_types: string[];
  }>({
    url: `${API_ENDPOINT.EMPLOYEE}/${data?.user?.id}/available-document-types`,
  });

  const REFECH = () => {
    refetch();
    DocumentTypeRefetch();
  };

  const form = useForm<FormValues>({
    initialValues: {
      documentType: "",
      file: null,
    },
    validate: {
      documentType: (value) => (value ? null : "Please select a document type"),
      file: (value) => (value ? null : "Please upload a file"),
    },
  });

  useEffect(() => {
    if (searchParams.get("openModal") === "true") {
      open();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const POST_ACTION = useCustomPost<FormData>({
    url: `${API_ENDPOINT.EMPLOYEE}/${data?.user?.id}/upload-document`,
    onSuccess: (data: any) => {
      close();
      form.reset();
      showNotification({
        title: "Success",
        message: data?.message || "Document uploaded successfully!",
        color: "green",
        icon: <IconCheck />,
        position: "bottom-right",
      });
      refetch();
    },
    onError: (error: any) => {
      showNotification({
        title: "Error",
        message: error?.message || "Something went wrong!",
        color: "red",
        icon: <IconX />,
        position: "bottom-right",
      });
    },
  });

  const handleSubmit = async (values: FormValues) => {
    if (!values.file) {
      showNotification({
        title: "Error",
        message: "No file selected",
        color: "red",
        icon: <IconX />,
        position: "bottom-right",
      });
      return;
    }

    const formData = new FormData();
    formData.append("document_type", values.documentType);
    formData.append("document", values.file);

    try {
      await POST_ACTION.mutateAsync(formData);
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: error?.message || "Something went wrong!",
        color: "red",
        icon: <IconX />,
        position: "bottom-right",
      });
    }
  };

  const handleDrop = (files: FileWithPath[]) => {
    const file = files[0];

    if (file) {
      form.setFieldValue("file", file);

      // Revoke previous preview to avoid memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      // Only generate preview URL if file is an image
      if (file.type.startsWith("image/")) {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Suspense fallback={<Loading />}>
      <>
        <div className="min-h-screen">
          <div className="container mx-auto p-6">
            <Flex justify={"space-between"}>
              <ActionIcon
                color={"#054EFA"}
                variant="filled"
                aria-label="Back"
                radius={"xl"}
                size={"xl"}
                // mb={"xl"}
                onClick={() => router.back()}
              >
                <IconArrowNarrowLeft />
              </ActionIcon>
              <Button
                size="md"
                mb={"xl"}
                variant="filled"
                radius={"xl"}
                color="#054EFA"
                onClick={open}
              >
                Add New Document
              </Button>
            </Flex>
            <DocsTable
              isLoading={isLoading}
              refetch={REFECH}
              data={EmployeeDocs?.documents}
            />
          </div>
        </div>
        <Modal
          centered
          size={"lg"}
          opened={opened}
          onClose={() => {
            close();
            form.reset();
            setPreviewUrl(null); // Clear preview URL
          }}
          title="Add Documents"
          closeOnClickOutside={false}
          // p={"xl"}
        >
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Flex mb={"lg"}>
              <Select
                w={"100%"}
                data={DocumentType?.available_types || []}
                withAsterisk
                label={"Select Document Type"}
                placeholder="Select Document Type"
                {...form.getInputProps("documentType")}
              />
            </Flex>

            <Stack gap={0}>
              <Text size="sm" fw={"500"} mb={"2"}>
                Upload Document{" "}
                {form.errors.file && <Text c={"red"}>form.errors.file</Text>}
              </Text>

              <Dropzone
                multiple={false}
                onDrop={handleDrop}
                onReject={(files) => {
                  form.setFieldError(
                    "file",
                    files[0]?.errors[0]?.message || "Invalid file"
                  );
                }}
                maxSize={512 * 1024 ** 2}
                accept={{
                  "image/png": [".png"],
                  "image/jpeg": [".jpg", ".jpeg"],
                  "application/pdf": [".pdf"],
                }}
              >
                <Group
                  justify="center"
                  gap="xl"
                  mih={20}
                  style={{ pointerEvents: "none" }}
                >
                  <Dropzone.Accept>
                    <IconUpload
                      size={52}
                      color="var(--mantine-color-blue-6)"
                      stroke={1.5}
                    />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX
                      size={52}
                      color="var(--mantine-color-red-6)"
                      stroke={1.5}
                    />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconPhoto
                      size={52}
                      color="var(--mantine-color-dimmed)"
                      stroke={1.5}
                    />
                  </Dropzone.Idle>

                  <div>
                    <Text size="xl" inline>
                      Drag images here or click to select files
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      Attach as many files as you like, each file should not
                      exceed 5MB
                    </Text>
                  </div>
                </Group>
              </Dropzone>
              <Paper mt={"md"} p={"md"} withBorder>
                {form.values?.file?.name && (
                  <div className="mt-2 z-10">
                    {form.values.file.type.startsWith("image/") &&
                    previewUrl ? (
                      <>
                        <Image
                          radius="md"
                          src={previewUrl}
                          alt={form.values.file.name}
                          w={"100%"}
                          h={200}
                          fit="fill"
                          style={{ marginTop: "10px" }}
                        />
                      </>
                    ) : (
                      <Group mt="sm">
                        <IconFileTypeDoc
                          size={40}
                          color="var(--mantine-color-dimmed)"
                        />
                        <Text size="sm">
                          No preview available for this file type
                        </Text>
                      </Group>
                    )}
                    <Text mt={"xs"}>
                      Selected file: {form.values.file.name} (
                      {(form.values.file.size / 1024).toFixed(2)} KB)
                    </Text>
                  </div>
                )}
              </Paper>
            </Stack>

            <div className="mt-6">
              <Button
                fullWidth
                size="lg"
                color="#054EFA"
                className="mt-4"
                variant="filled"
                type="submit"
                loading={POST_ACTION.isPending}
                disabled={POST_ACTION.isPending}
              >
                Upload
              </Button>
            </div>
          </form>
        </Modal>
      </>
    </Suspense>
  );
}
