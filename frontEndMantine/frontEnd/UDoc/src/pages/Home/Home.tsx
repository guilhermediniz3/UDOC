import {
  Container,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Group,
  Loader,
  Center,
} from "@mantine/core";

import { IconLayoutGrid } from "@tabler/icons-react";

import { useEffect, useState } from "react";

import type { Card as CardType } from "../../types/Card";

import { getCards } from "../../services/cardService";

import Card from "../../components/Card/Card";

import Search from "../../components/Search/Search";

import PaginationComponent from "../../components/Pagination/Pagination";

export default function Home() {
  const [cards, setCards] = useState<CardType[]>([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [size, setSize] = useState(10);

  const [totalPages, setTotalPages] =
    useState(1);

  async function loadCards() {
    try {
      setLoading(true);

      const response = await getCards({
        page: page - 1,
        size,
        search,
      });

      console.log(
        "Cards carregados:",
        response
      );

      setCards(response.content);

      setTotalPages(response.totalPages);
    } catch (error) {
      console.error(
        "Erro ao carregar cards:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCards();
  }, [page, size, search]);

  return (
    <Container
      size="xl"
      py="xl"
    >
      {/* HEADER */}
      <div
        style={{
          position: "relative",

          overflow: "hidden",

          borderRadius: 24,

          padding: 32,

          marginBottom: 32,

          background:
            "rgba(15, 23, 42, 0.35)",

          backdropFilter:
            "blur(18px)",

          border:
            "1px solid rgba(255,255,255,0.04)",

          boxShadow:
            "0 10px 30px rgba(0,0,0,0.16)",
        }}
      >
        {/* GLOW */}
        <div
          style={{
            position: "absolute",

            top: -120,

            right: -120,

            width: 260,

            height: 260,

            borderRadius: "50%",

            background:
              "radial-gradient(circle, rgba(124,58,237,0.12) 0%, rgba(124,58,237,0) 72%)",

            pointerEvents: "none",
          }}
        />

        <Group
          justify="space-between"
          align="center"
          gap="xl"
        >
          {/* LEFT */}
          <Stack gap={6}>
            <div
              style={{
                display: "flex",

                alignItems: "center",

                gap: 18,
              }}
            >
              <div
                style={{
                  width: 58,

                  height: 58,

                  borderRadius: 18,

                  display: "flex",

                  alignItems: "center",

                  justifyContent:
                    "center",

                  background:
                    "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",

                  boxShadow:
                    "0 10px 25px rgba(124,58,237,0.20)",
                }}
              >
                <IconLayoutGrid
                  size={28}
                  color="#fff"
                />
              </div>

              <div>
                <Title
                  order={1}
                  c="white"
                >
                  Dashboard
                </Title>

                <Text c="dimmed">
                  Gerencie documentos,
                  conteúdos e cards do
                  sistema.
                </Text>
              </div>
            </div>
          </Stack>

          {/* SEARCH */}
          <div
            style={{
              width: 340,
            }}
          >
            <Search
              value={search}
              onChange={(value) => {
                setPage(1);

                setSearch(value);
              }}
            />
          </div>
        </Group>
      </div>

      {/* LOADING */}
      {loading ? (
        <Center py={80}>
          <Loader
            size="lg"
            color="violet"
          />
        </Center>
      ) : (
        <>
          {/* GRID */}
          <SimpleGrid
            cols={{
              base: 1,
              sm: 2,
              md: 2,
              lg: 3,
              xl: 4,
            }}
            spacing={28}
            verticalSpacing={28}
          >
            {cards.map((card) => (
              <Card
                key={card.id}
                title={card.title}
                description={
                  card.description
                }
                icon={card.icon}
              />
            ))}
          </SimpleGrid>

          {/* PAGINATION */}
          <PaginationComponent
            page={page}
            totalPages={totalPages}
            size={size}
            onPageChange={setPage}
            onSizeChange={(value) => {
              setPage(1);

              setSize(value);
            }}
          />
        </>
      )}
    </Container>
  );
}