import {
  MantineProvider,
} from "@mantine/core";

import {
  ColorSchemeScript,
} from "@mantine/core";

import {
  useLocalStorage,
} from "@mantine/hooks";

import "@mantine/core/styles.css";

import Header from "./components/Header/Header";

import AppRoutes from "./routes/routes";

function App() {

  const [
    colorScheme,
    setColorScheme,
  ] = useLocalStorage<"light" | "dark">({
    key: "udoc-theme",
    defaultValue: "dark",
  });

  return (
    <>
      <ColorSchemeScript
        defaultColorScheme={colorScheme}
      />

      <MantineProvider
        forceColorScheme={colorScheme}
        theme={{
          primaryColor: "violet",
          defaultRadius: "md",
        }}
      >

        <Header
          colorScheme={colorScheme}
          toggleTheme={() =>
            setColorScheme(
              colorScheme === "dark"
                ? "light"
                : "dark"
            )
          }
        />

        <AppRoutes />

      </MantineProvider>
    </>
  );
}

export default App;