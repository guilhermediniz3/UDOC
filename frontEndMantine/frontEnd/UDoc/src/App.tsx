import {
  MantineProvider,
} from "@mantine/core";

import "@mantine/core/styles.css";

import Header from "./components/Header/Header";

import AppRoutes from "./routes/routes";

function App() {
  return (
    <MantineProvider
      defaultColorScheme="dark"
      theme={{
        primaryColor: "violet",
        defaultRadius: "md",
      }}
    >
      <Header />

      <AppRoutes />
    </MantineProvider>
  );
}

export default App;