import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

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
  IconArrowLeft,
  IconCheck,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";

import {
  FaTrash,
} from "react-icons/fa";

import Tabs from "../../../components/Tabs/Tabs";

import RichTextEditor from "../../../components/RichTextEditor/RichTextEditor";

import type { Card } from "../../../types/Card";

import type { Tab } from "../../../types/Tab";

import {
  deleteCard,
  getCardById,
  saveCard,
  updateCard,
} from "../../../services/cardService";

const EMPTY_CARD: Card = {
  title: "",
  description: "",
  icon: "",
  content: "",
  active: true,
};

export default function Admin() {

  const navigate = useNavigate();

  const { id } = useParams();

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

  const isNewCard = !card.id;

  function showMessage(
    type: "success" | "error",
    text: string
  ) {

    setMessageType(type);

    setMessage(text);

    setTimeout(() => {

      setMessage("");

    }, 2500);
  }

  useEffect(() => {

    async function loadCard() {

      if (!id) {
        return;
      }

      try {

        const response =
          await getCardById(
            Number(id)
          );

        setCard(response);

      } catch (error) {

        console.error(error);

        showMessage(
          "error",
          "Erro ao carregar card."
        );
      }
    }

    loadCard();

  }, [id]);

  function updateField<
    K extends keyof Card
  >(
    field: K,
    value: Card[K]
  ) {

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

  async function handleToggleActive(
    checked: boolean
  ) {

    try {

      const updatedCard = {
        ...card,
        active: checked,
      };

      setCard(updatedCard);

      await updateCard(updatedCard);

      showMessage(
        "success",
        checked
          ? "Card ativado com sucesso."
          : "Card inativado com sucesso."
      );

    } catch (error) {

      console.error(error);

      showMessage(
        "error",
        "Erro ao alterar status."
      );
    }
  }

  async function handleSave(
    event?: FormEvent
  ) {

    event?.preventDefault();

    if (
      card.title.trim() === ""
    ) {

      showMessage(
        "error",
        "Título obrigatório."
      );

      return;
    }

    try {

      setSaving(true);

      const isEdit =
        !!card.id;

      const savedCard =
        await saveCard(card);

      setCard(savedCard);

      showMessage(
        "success",
        isEdit
          ? "Card salvo com sucesso."
          : "Card criado com sucesso."
      );

      if (
        !isEdit &&
        savedCard.id
      ) {

        navigate(
          `/admin/card/${savedCard.id}`
        );
      }

    } catch (error) {

      console.error(error);

      showMessage(
        "error",
        "Erro ao salvar."
      );

    } finally {

      setSaving(false);
    }
  }

  async function handleDelete() {

    if (!card.id) {
      return;
    }

    try {

      await deleteCard(card.id);

      showMessage(
        "success",
        "Card removido com sucesso."
      );

      setTimeout(() => {

        navigate("/admin/cards");

      }, 800);

    } catch (error) {

      console.error(error);

      showMessage(
        "error",
        "Erro ao remover card."
      );
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
          />

          <TextInput
            label="Descrição"
            name="description"
            value={card.description}
            onChange={handleChange}
            placeholder="Digite a descrição"
            radius="lg"
          />

          <TextInput
            label="Ícone"
            name="icon"
            value={card.icon}
            onChange={handleChange}
            placeholder="Ex.: FaUser"
            radius="lg"
          />

        </Stack>
      ),
    },

    {
      id: "midias",

      label: "Mídias",

      content: (
        <RichTextEditor
          value={
            card.content || ""
          }
          onChange={(value) =>
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

      content: (
        <Text c="dimmed">
          Configurações futuras do card.
        </Text>
      ),
    },
  ];

  return (
    <Box p="lg">

      <Paper
        p="xl"
        radius="24px"
        mb="xl"
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
        >

          <Group>

            <ThemeIcon
              size={56}
              radius="xl"
              variant="gradient"
              gradient={{
                from: "violet",
                to: "blue",
              }}
            >
              <IconInfoCircle size={28} />
            </ThemeIcon>

            <div>

              <Title
                order={2}
                c="white"
              >
                {isNewCard
                  ? "Novo Card"
                  : "Editar Card"}
              </Title>

              <Text c="dimmed">
                Gerencie os dados do card.
              </Text>

            </div>

          </Group>

          <Group>

            <Button
              variant="light"
              color="gray"
              radius="xl"
              leftSection={
                <IconArrowLeft size={18} />
              }
              onClick={() =>
                navigate("/admin/cards")
              }
            >
              Voltar
            </Button>

            <Badge
              color={
                card.active
                  ? "green"
                  : "red"
              }
              radius="xl"
              size="lg"
            >
              {card.active
                ? "ATIVO"
                : "INATIVO"}
            </Badge>

            <Switch
              checked={
                card.active ?? false
              }
              onChange={(event) =>
                handleToggleActive(
                  event.currentTarget.checked
                )
              }
              size="lg"
              color="violet"
            />

            <Button
              color="red"
              radius="xl"
              leftSection={
                <FaTrash />
              }
              onClick={handleDelete}
            >
              Remover
            </Button>

            <Button
              radius="xl"
              variant="gradient"
              gradient={{
                from: "violet",
                to: "blue",
              }}
              loading={saving}
              onClick={handleSave}
            >
              Salvar
            </Button>

          </Group>

        </Flex>

      </Paper>

      {message && (

        <Alert
          mb="lg"
          radius="xl"
          color={
            messageType ===
            "success"
              ? "green"
              : "red"
          }
          icon={
            messageType ===
            "success"
              ? <IconCheck />
              : <IconX />
          }
        >
          {message}
        </Alert>

      )}

      <MantineCard
        radius="24px"
        p="xl"
        style={{
          background:
            "linear-gradient(180deg, #111827 0%, #0f172a 100%)",

          border:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >

        <Tabs tabs={tabs} />

      </MantineCard>

    </Box>
  );
}