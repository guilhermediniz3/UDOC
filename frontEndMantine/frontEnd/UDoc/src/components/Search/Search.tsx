import {
  TextInput,
} from "@mantine/core";

import {
  IconSearch,
} from "@tabler/icons-react";

interface SearchProps {
  value: string;

  onChange: (
    value: string
  ) => void;
}

export default function Search({
  value,
  onChange,
}: SearchProps) {
  return (
    <TextInput
      placeholder="Buscar cards..."
      value={value}
      onChange={(event) =>
        onChange(
          event.currentTarget.value
        )
      }
      leftSection={
        <IconSearch size={18} />
      }
      radius="xl"
      size="md"

      styles={{
        root: {
          width: "100%",
          maxWidth: "520px",
        },

        input: {
          height: "52px",

          background:
            "rgba(255,255,255,0.04)",

          border:
            "1px solid rgba(255,255,255,0.08)",

          color: "#ffffff",

          backdropFilter:
            "blur(14px)",

          transition:
            "all 0.25s ease",

          fontSize: "15px",

          paddingLeft: "46px",
        },

        section: {
          color:
            "rgba(255,255,255,0.55)",
        },
      }}
    />
  );
}