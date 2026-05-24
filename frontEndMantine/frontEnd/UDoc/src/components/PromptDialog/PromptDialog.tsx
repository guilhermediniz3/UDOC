import { useEffect, useState } from "react";

import {
  Button,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
} from "@mantine/core";

import { IconPencil } from "@tabler/icons-react";

interface PromptDialogProps {
  open: boolean;
  title: string;
  message: string;
  placeholder?: string;
  initialValue?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export default function PromptDialog({
  open,
  title,
  message,
  placeholder = "",
  initialValue = "",
  confirmText = "Inserir",
  cancelText = "Cancelar",
  loading = false,
  onConfirm,
  onCancel,
}: PromptDialogProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) {
      setValue(initialValue ?? "");
    }
  }, [open, initialValue]);

  function handleConfirm() {
    const trimmedValue = value.trim();

    if (!trimmedValue || loading) {
      return;
    }

    onConfirm(trimmedValue);
  }

  return (
    <Modal
      opened={open}
      onClose={onCancel}
      centered
      size="lg"
      radius="xl"
      padding="xl"
      overlayProps={{
        blur: 6,
        backgroundOpacity: 0.55,
      }}
      transitionProps={{
        transition: "fade-up",
        duration: 220,
      }}
      withCloseButton={false}
      styles={{
        content: {
          background:
            "linear-gradient(180deg, #111827 0%, #0f172a 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 25px 80px rgba(0,0,0,0.55)",
        },
      }}
    >
      <Stack gap="xl">
        <Group gap="md">
          <ThemeIcon
            size={52}
            radius="xl"
            variant="gradient"
            gradient={{
              from: "violet",
              to: "blue",
              deg: 135,
            }}
          >
            <IconPencil size={24} />
          </ThemeIcon>

          <div>
            <Text
              size="xl"
              fw={800}
              c="white"
            >
              {title}
            </Text>

            <Text
              size="sm"
              c="dimmed"
              mt={4}
            >
              {message}
            </Text>
          </div>
        </Group>

        <Paper
          radius="xl"
          p="md"
          bg="rgba(255,255,255,0.03)"
          style={{
            border:
              "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <TextInput
            value={value}
            placeholder={placeholder}
            autoFocus
            size="lg"
            radius="lg"
            variant="filled"
            onChange={(e) =>
              setValue(e.currentTarget.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleConfirm();
              }

              if (e.key === "Escape") {
                e.preventDefault();
                onCancel();
              }
            }}
            styles={{
              input: {
                background: "#111827",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                color: "#fff",
                fontSize: "16px",
                height: "54px",
              },
            }}
          />
        </Paper>

        <Group justify="flex-end">
          <Button
            variant="subtle"
            color="gray"
            radius="xl"
            size="md"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            radius="xl"
            size="md"
            variant="gradient"
            gradient={{
              from: "violet",
              to: "blue",
              deg: 135,
            }}
            onClick={handleConfirm}
            loading={loading}
            disabled={!value.trim()}
          >
            {confirmText}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}