import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Modal,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";

import {
  useDisclosure,
} from "@mantine/hooks";

import {
  IconCopy,
  IconEdit,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  cloneCard,
  deleteCard,
  getCards,
} from "../../services/cardService";

import type { Card }
from "../../types/Card";

export default function AdminListCards() {

  const navigate =
    useNavigate();

  const [cards, setCards] =
    useState<Card[]>([]);

  const [search, setSearch] =
    useState("");

  const [
    activeFilter,
    setActiveFilter,
  ] = useState<
    string | null
  >(null);

  const [page, setPage] =
    useState(1);

  const [size, setSize] =
    useState("10");

  const [
    totalPages,
    setTotalPages,
  ] = useState(1);

  const [
    opened,
    {
      open,
      close,
    },
  ] = useDisclosure(false);

  const [
    selectedCardId,
    setSelectedCardId,
  ] = useState<number | null>(
    null
  );

  async function loadCards() {

    const response =
      await getCards({

        page: page - 1,

        size: Number(size),

        search,

        active:
          activeFilter === null
            ? null
            : activeFilter ===
              "true",
      });

    setCards(
      response.content
    );

    setTotalPages(
      response.totalPages
    );
  }

  useEffect(() => {

    loadCards();

  }, [
    search,
    activeFilter,
    page,
    size,
  ]);

  async function handleDelete() {

    if (!selectedCardId) {
      return;
    }

    await deleteCard(
      selectedCardId
    );

    close();

    loadCards();
  }

  async function handleClone(
    id: number
  ) {

    await cloneCard(id);

    loadCards();
  }

  return (
    <Stack
      p="30px"
      gap="20px"
      bg="#111111"
      mih="100vh"
    >

      <Modal
        opened={opened}
        onClose={close}
        centered
        radius="xl"
        title="Remover card"
      >

        <Text mb="lg">
          Deseja remover este card?
        </Text>

        <Group justify="flex-end">

          <Button
            variant="default"
            onClick={close}
          >
            Cancelar
          </Button>

          <Button
            color="red"
            onClick={handleDelete}
          >
            Remover
          </Button>

        </Group>

      </Modal>

      <Paper
        p="30px"
        radius="24px"
        style={{
          background:
            "linear-gradient(180deg, #111827 0%, #0f172a 100%)",

          border:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >

        <Group
          justify="space-between"
          align="center"
        >

          <div>

            <Text
              c="white"
              fw={700}
              fz={36}
            >
              Administração de Cards
            </Text>

            <Text c="dimmed">
              Gerencie os cards do sistema
            </Text>

          </div>

          <Button
            leftSection={
              <IconPlus size={18} />
            }
            radius="xl"
            size="md"
            variant="gradient"
            gradient={{
              from: "violet",
              to: "blue",
            }}
            onClick={() =>
              navigate(
                "/admin/card"
              )
            }
          >
            Novo Card
          </Button>

        </Group>

      </Paper>

      <Paper
        p="20px"
        radius="24px"
        style={{
          background:
            "linear-gradient(180deg, #111827 0%, #0f172a 100%)",

          border:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >

        <Group mb="20px">

          <TextInput
            placeholder="Buscar card..."
            leftSection={
              <IconSearch size={18} />
            }
            value={search}
            onChange={(
              event
            ) => {

              setPage(1);

              setSearch(
                event.currentTarget
                  .value
              );
            }}
            radius="xl"
            size="md"
            w={320}
          />

          <Select
            placeholder="Status"
            radius="xl"
            size="md"
            w={180}
            value={
              activeFilter
            }
            onChange={(
              value
            ) => {

              setPage(1);

              setActiveFilter(
                value
              );
            }}
            data={[
              {
                value: "true",
                label: "Ativos",
              },

              {
                value: "false",
                label: "Inativos",
              },
            ]}
            clearable
          />

        </Group>

        <Table
          highlightOnHover
          verticalSpacing="md"
        >

          <Table.Thead>

            <Table.Tr>

              <Table.Th>
                Título
              </Table.Th>

              <Table.Th>
                Descrição
              </Table.Th>

              <Table.Th>
                Status
              </Table.Th>

              <Table.Th>
                Ações
              </Table.Th>

            </Table.Tr>

          </Table.Thead>

          <Table.Tbody>

            {cards.map(
              (card) => (

                <Table.Tr
                  key={card.id}
                >

                  <Table.Td>

                    <Text
                      fw={600}
                      c="white"
                    >
                      {
                        card.title
                      }
                    </Text>

                  </Table.Td>

                  <Table.Td>

                    <Text c="dimmed">
                      {
                        card.description
                      }
                    </Text>

                  </Table.Td>

                  <Table.Td>

                    <Badge
                      color={
                        card.active
                          ? "green"
                          : "red"
                      }
                      radius="xl"
                    >
                      {card.active
                        ? "ATIVO"
                        : "INATIVO"}
                    </Badge>

                  </Table.Td>

                  <Table.Td>

                    <Group gap="xs">

                      <ActionIcon
                        variant="light"
                        color="blue"
                        radius="xl"
                        onClick={() =>
                          navigate(
                            `/admin/card/${card.id}`
                          )
                        }
                      >

                        <IconEdit size={18} />

                      </ActionIcon>

                      <ActionIcon
                        variant="light"
                        color="violet"
                        radius="xl"
                        onClick={() =>
                          handleClone(
                            card.id
                          )
                        }
                      >

                        <IconCopy size={18} />

                      </ActionIcon>

                      <ActionIcon
                        variant="light"
                        color="red"
                        radius="xl"
                        onClick={() => {

                          setSelectedCardId(
                            card.id
                          );

                          open();
                        }}
                      >

                        <IconTrash size={18} />

                      </ActionIcon>

                    </Group>

                  </Table.Td>

                </Table.Tr>

              )
            )}

          </Table.Tbody>

        </Table>

        <Group
          justify="space-between"
          mt="xl"
        >

          <Pagination
            value={page}
            onChange={setPage}
            total={totalPages}
            radius="xl"
            color="violet"
          />

          <Select
            value={size}
            onChange={(
              value
            ) => {

              setPage(1);

              setSize(
                value || "10"
              );
            }}
            data={[
              {
                value: "10",
                label:
                  "10 / página",
              },

              {
                value: "20",
                label:
                  "20 / página",
              },

              {
                value: "50",
                label:
                  "50 / página",
              },

              {
                value: "100",
                label:
                  "100 / página",
              },
            ]}
            w={150}
            radius="xl"
          />

        </Group>

      </Paper>

    </Stack>
  );
}