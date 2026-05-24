import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { FaTrash } from "react-icons/fa";

import {
  Alert,
  Badge,
  Box,
  Button,
  Card as MantineCard,
  Flex,
  Group,
  Paper,
  Stack,
  Switch,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";

import {
  IconCheck,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";

import Tabs from "../../../components/Tabs/Tabs";

import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog";

import RichTextEditor from "../../../components/RichTextEditor/RichTextEditor";

import type { Tab } from "../../../types/Tab";
import type { Card } from "../../../types/Card";

import {
  saveCard,
  deleteCard,
} from "../../../services/cardService";

const EMPTY_CARD: Card = {
  title: "",
  description: "",
  icon: "",
  slug: "",
  content: "",
  active: true,
};

export default function AdminPage() {
  const [card, setCard] =
    useState<Card>(EMPTY_CARD);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState<"success" | "error">(
      "success"
    );

  const [
    deleteModalOpen,
    setDeleteModalOpen,
  ] = useState(false);

  const isNewCard = !card.id;

  const canSave =
    !saving &&
    (!isNewCard ||
      card.title.trim() !== "");

  const canDelete =
    !isNewCard && !saving;

  const additionalTabsEnabled =
    !isNewCard;

  function updateField<
    K extends keyof Card
  >(field: K, value: Card[K]) {
    setCard((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } =
      event.target;

    updateField(
      name as keyof Card,
      value
    );
  }

  async function handleSave(
    event?: FormEvent
  ) {
    event?.preventDefault();

    if (
      card.title.trim() === ""
    ) {
      setMessageType("error");

      setMessage(
        "O título é obrigatório."
      );

      return;
    }

    try {
      setSaving(true);

      setMessage("");

      const isEdit = !!card.id;

      const savedCard =
        await saveCard(card);

      setCard(savedCard);

      setMessageType("success");

      setMessage(
        isEdit
          ? "Card salvo com sucesso."
          : "Card criado com sucesso."
      );
    } catch (error) {
      console.error(
        "Erro ao salvar:",
        error
      );

      setMessageType("error");

      setMessage(
        "Erro ao salvar o card."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    if (!canDelete) {
      return;
    }

    setDeleteModalOpen(true);
  }

  async function confirmDelete() {
    if (!card.id) {
      return;
    }

    try {
      setSaving(true);

      setMessage("");

      await deleteCard(card.id);

      setCard(EMPTY_CARD);

      setMessageType("success");

      setMessage(
        "Card removido com sucesso."
      );
    } catch (error) {
      console.error(
        "Erro ao remover:",
        error
      );

      setMessageType("error");

      setMessage(
        "Erro ao remover o card."
      );
    } finally {
      setSaving(false);

      setDeleteModalOpen(false);
    }
  }

  const tabs: Tab[] = [
    {
      id: "card",
      label: "Card",

      content: (
        <Stack gap="lg">
          <TextInput
            label="Título"
            name="title"
            value={card.title}
            onChange={handleChange}
            placeholder="Digite o título"
            radius="lg"
            size="md"
          />

          <TextInput
            label="Descrição"
            name="description"
            value={card.description}
            onChange={handleChange}
            placeholder="Digite a descrição"
            radius="lg"
            size="md"
          />

          <TextInput
            label="Ícone"
            name="icon"
            value={card.icon}
            onChange={handleChange}
            placeholder="Ex.: FaUser"
            radius="lg"
            size="md"
          />

          <TextInput
            label="Slug"
            name="slug"
            value={card.slug}
            onChange={handleChange}
            placeholder="meu-card"
            radius="lg"
            size="md"
          />
        </Stack>
      ),
    },

    {
      id: "midias",
      label: "Mídias",

      disabled:
        !additionalTabsEnabled,

      content: (
        <RichTextEditor
          value={card.content}
          onChange={(
            value: string
          ) =>
            updateField(
              "content",
              value
            )
          }
        />
      ),
    },

    {
      id: "configuracoes",
      label: "Configurações",

      disabled:
        !additionalTabsEnabled,

      content: (
        <Stack gap="lg">
          <TextInput
            label="ID do Card"
            value={card.id || ""}
            readOnly
            radius="lg"
          />

          <TextInput
            label="Status"
            value={
              card.active
                ? "Ativo"
                : "Inativo"
            }
            readOnly
            radius="lg"
          />
        </Stack>
      ),
    },
  ];

  return (
    <Stack
      gap="xl"
      p="lg"
    >
      <Paper
        radius="2xl"
        p="xl"
        shadow="xl"
        style={{
          background:
            "linear-gradient(180deg, #111827 0%, #0f172a 100%)",

          border:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Flex
          justify="space-between"
          align="center"
          wrap="wrap"
          gap="lg"
        >
          <Box>
            <Group mb={8}>
              <ThemeIcon
                size={42}
                radius="xl"
                variant="gradient"
                gradient={{
                  from: "violet",
                  to: "blue",
                  deg: 135,
                }}
              >
                <IconInfoCircle size={20} />
              </ThemeIcon>

              <Title
                order={2}
                c="white"
              >
                {isNewCard
                  ? "Novo Card"
                  : "Editar Card"}
              </Title>
            </Group>

            <Text c="dimmed">
              Gerencie os dados do card
              e conteúdo do editor.
            </Text>
          </Box>

          <Group>
            <Badge
              size="lg"
              radius="xl"
              color={
                card.active
                  ? "green"
                  : "red"
              }
            >
              {card.active
                ? "Ativo"
                : "Inativo"}
            </Badge>

            <Switch
              checked={card.active}
              onChange={(e) =>
                updateField(
                  "active",
                  e.currentTarget.checked
                )
              }
              size="lg"
              color="violet"
            />

            <Button
              variant="light"
              color="red"
              radius="xl"
              leftSection={
                <FaTrash />
              }
              onClick={handleDelete}
              disabled={!canDelete}
            >
              Remover
            </Button>

            <Button
              radius="xl"
              variant="gradient"
              gradient={{
                from: "violet",
                to: "blue",
                deg: 135,
              }}
              onClick={handleSave}
              loading={saving}
              disabled={!canSave}
            >
              Salvar
            </Button>
          </Group>
        </Flex>
      </Paper>

      {message && (
        <Alert
          radius="xl"
          variant="light"
          color={
            messageType ===
            "success"
              ? "green"
              : "red"
          }
          icon={
            messageType ===
            "success" ? (
              <IconCheck size={18} />
            ) : (
              <IconX size={18} />
            )
          }
        >
          {message}
        </Alert>
      )}

      <MantineCard
        radius="2xl"
        shadow="xl"
        p="xl"
        style={{
          background:
            "linear-gradient(180deg, #0f172a 0%, #111827 100%)",

          border:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Tabs tabs={tabs} />
      </MantineCard>

      <ConfirmDialog
        open={deleteModalOpen}
        title="Confirmar exclusão"
        message="Deseja realmente remover este card?"
        confirmText="Remover"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() =>
          setDeleteModalOpen(false)
        }
      />
    </Stack>
  );
}