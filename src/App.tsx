import React, { useState } from 'react';
import { Refine } from '@refinedev/core';
import { dataProvider } from './providers/dataProvider';
import { Layout } from './components/Layout';
import { ProductList } from './pages/products/list';
import { LaneList } from './pages/lanes/list';

export function App() {
  const [activeTab, setActiveTab] = useState<'products' | 'lanes'>('products');

  return (
    <Refine
      dataProvider={dataProvider}
      resources={[
        {
          name: 'products',
          list: '/',
        },
        {
          name: 'lanes',
          list: '/lanes',
        },
      ]}
    >
      <Layout activeTab={activeTab} onSelectTab={setActiveTab}>
        {activeTab === 'products' ? <ProductList /> : <LaneList />}
      </Layout>
    </Refine>
  );
}

export default App;
