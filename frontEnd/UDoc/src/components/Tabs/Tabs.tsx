import { useState } from 'react';
import './index.css';

import type { Tab } from '../../types/Tab';

interface TabsProps {
  tabs: Tab[];
}

export default function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  const activeContent = tabs.find(
    (tab) => tab.id === activeTab
  )?.content;

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab-button ${
              activeTab === tab.id ? 'active' : ''
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tabs-content">{activeContent}</div>
    </div>
  );
}