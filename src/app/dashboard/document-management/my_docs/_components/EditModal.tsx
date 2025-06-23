/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Flex,
  Select,
  Stack,
  Text,
  Group,
  Paper,
  Image,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconUpload,
  IconX,
  IconPhoto,
  IconFileTypeDoc,
} from "@tabler/icons-react";
import { Dropzone, FileWithPath } from "@mantine/dropzone";

interface EditModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: { document_type: string; file?: File }) => void;
  initialValues: { documentType: string; file?: File; documentUrl?: string };
  isLoading?: boolean;
  documentTypes?: string[];
}

export function EditModal({
  opened,
  onClose,
  onSubmit,
  initialValues,
  isLoading = false,
  documentTypes = [],
}: EditModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      document_type: initialValues.documentType || "",
      file: initialValues.file || undefined,
    },
    validate: {
      document_type: (value) => (value ? null : "Document type is required"),
      // File is optional for editing
      file: (value, values) =>
        !value && !values.document_type ? "A file is required" : null,
    },
  });


  // Initialize form values when initialValues change
  useEffect(() => {
    if (initialValues) {
      form.setValues({
        document_type: initialValues.documentType || "",
        file: initialValues.file || undefined,
      });
      // Set previewUrl to documentUrl only if no file is selected
      if (!form.values.file && initialValues.documentUrl) {
        setPreviewUrl(initialValues.documentUrl);
      }
    }
  }, [initialValues]);

  // Update previewUrl when a new file is selected
  useEffect(() => {
    if (form.values.file) {
      const url = URL.createObjectURL(form.values.file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url); // Cleanup on file change or unmount
    }
    // Do not reset to documentUrl here to prevent overwriting
  }, [form.values.file]);

  const handleDrop = (files: FileWithPath[]) => {
    const file = files[0];
    if (file) {
      form.setFieldValue("file", file);
      // Only generate preview for image files
      if (file.type.startsWith("image/")) {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      } else {
        setPreviewUrl(null); // Non-image files show no preview
      }
    }
  };

  const handleSubmit = (values: typeof form.values) => {
    onSubmit(values);
    form.reset();
    setPreviewUrl(null);
    onClose();
  };

  return (
    <Modal
      centered
      size="lg"
      opened={opened}
      onClose={() => {
        onClose();
        form.reset();
        setPreviewUrl(null);
      }}
      title="Edit Document"
      closeOnClickOutside={false}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Flex mb="lg">
          <Select
            w="100%"
            data={documentTypes}
            label="Select Document Type"
            placeholder="Select Document Type"
            {...form.getInputProps("document_type")}
            // Removed readOnly to allow editing
          />
        </Flex>

        <Stack gap={0}>
          <Text size="sm" fw={500} mb={2}>
            Upload Document{" "}
            {form.errors.file && <Text c="red">{form.errors.file}</Text>}
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
            maxSize={512 * 1024 ** 2} // 512MB
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
                  Attach a file, should not exceed 512MB
                </Text>
              </div>
            </Group>
          </Dropzone>

          <Paper mt="md" p="md" withBorder>
            {form.values?.file?.name || initialValues.documentUrl ? (
              <div className="mt-2 z-10">
                {form.values.file?.type.startsWith("image/") ||
                (previewUrl &&
                  (previewUrl.endsWith(".png") ||
                    previewUrl.endsWith(".jpg") ||
                    previewUrl.endsWith(".jpeg"))) ? (
                  <Image
                    radius="md"
                    src={previewUrl}
                    alt={form.values.file?.name || "Document preview"}
                    w="100%"
                    h={200}
                    fit="contain" // Changed to contain for better image display
                    style={{ marginTop: "10px" }}
                  />
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
                <Text mt="xs" truncate>
                  Selected file: {form.values.file?.name || "Existing document"}{" "}
                  (
                  {(form.values.file?.size
                    ? form.values.file.size / 1024
                    : "N/A"
                  ).toString()}{" "}
                  KB)
                </Text>
              </div>
            ) : null}
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
            loading={isLoading}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
