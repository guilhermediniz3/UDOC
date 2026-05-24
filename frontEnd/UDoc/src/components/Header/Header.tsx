import "./index.css";

import {
  ActionIcon,
} from "@mantine/core";

import {
  IconMoon,
  IconSun,
} from "@tabler/icons-react";

interface HeaderProps {

  colorScheme:
    "light" | "dark";

  toggleTheme:
    () => void;
}

function Header({
  colorScheme,
  toggleTheme,
}: HeaderProps) {

  const dark =
    colorScheme === "dark";

  return (
    <header className="header">

      <h1>UDoc</h1>

      <nav>

        <a href="#">
          Dashboard
        </a>

        <a href="#">
          Documentos
        </a>

        <a href="#">
          Templates
        </a>

        <ActionIcon
          variant="light"
          radius="xl"
          size="lg"
          onClick={toggleTheme}
        >

          {dark ? (

            <IconSun size={20} />

          ) : (

            <IconMoon size={20} />

          )}

        </ActionIcon>

      </nav>

    </header>
  );
}

export default Header;