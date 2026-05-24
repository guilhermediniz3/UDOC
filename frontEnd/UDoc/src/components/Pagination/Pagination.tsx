import {
  Group,
  Pagination,
  Select,
} from "@mantine/core";

interface PaginationProps {
  page: number;

  totalPages: number;

  size: number;

  onPageChange: (
    page: number
  ) => void;

  onSizeChange: (
    size: number
  ) => void;
}

function PaginationComponent({
  page,
  totalPages,
  size,
  onPageChange,
  onSizeChange,
}: PaginationProps) {
  return (
    <Group
      justify="space-between"
      mt={40}
    >
      <Pagination
        value={page}
        onChange={onPageChange}
        total={totalPages}
        radius="xl"
        size="md"
      />

      <Select
        w={150}
        radius="xl"
        value={String(size)}
        onChange={(value) => {
          if (!value) return;

          onSizeChange(Number(value));
        }}
        data={[
          {
            value: "10",
            label: "10 / página",
          },
          {
            value: "20",
            label: "20 / página",
          },
          {
            value: "50",
            label: "50 / página",
          },
          {
            value: "100",
            label: "100 / página",
          },
        ]}
      />
    </Group>
  );
}

export default PaginationComponent;