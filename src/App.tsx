import React, { useState } from 'react';
import { Refine } from '@refinedev/core';
import { dataProvider } from './providers/dataProvider';
import { Layout } from './components/Layout';
import { ProductList } from './pages/products/list';
import { CmsStudio } from './pages/cms';

export function App() {
  const [activeTab, setActiveTab] = useState<'products' | 'cms'>('products');

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
        {
          name: 'pages',
          list: '/cms',
        },
      ]}
    >
      <Layout activeTab={activeTab} onSelectTab={setActiveTab}>
        {activeTab === 'products' ? <ProductList /> : <CmsStudio />}
      </Layout>
    </Refine>
  );
}

export default App;
