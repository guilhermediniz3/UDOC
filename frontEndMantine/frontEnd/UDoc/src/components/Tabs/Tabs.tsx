import { Tabs as MantineTabs } from "@mantine/core";

import type { Tab } from "../../types/Tab";

interface TabsProps {
  tabs: Tab[];
}

export default function Tabs({
  tabs,
}: TabsProps) {
  return (
    <MantineTabs
      defaultValue={tabs[0]?.id}
      variant="outline"
      radius="lg"
      keepMounted={false}
      styles={{
        root: {
          width: "100%",
        },

        list: {
          background:
            "linear-gradient(180deg, #111827 0%, #0f172a 100%)",

          border:
            "1px solid rgba(255,255,255,0.08)",

          borderRadius: "18px",

          padding: "8px",

          gap: "8px",

          marginBottom: "20px",

          boxShadow:
            "0 10px 40px rgba(0,0,0,0.25)",
        },

        tab: {
          color: "#94a3b8",

          fontWeight: 600,

          borderRadius: "12px",

          transition: "all 0.2s ease",

          paddingInline: "18px",

          height: "42px",
        },

        tabLabel: {
          fontSize: "14px",
        },

        panel: {
          paddingTop: "12px",
        },
      }}
    >
      <MantineTabs.List>
        {tabs.map((tab) => (
          <MantineTabs.Tab
            key={tab.id}
            value={tab.id}
          >
            {tab.label}
          </MantineTabs.Tab>
        ))}
      </MantineTabs.List>

      {tabs.map((tab) => (
        <MantineTabs.Panel
          key={tab.id}
          value={tab.id}
        >
          {tab.content}
        </MantineTabs.Panel>
      ))}
    </MantineTabs>
  );
}