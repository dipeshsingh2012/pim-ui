import React from 'react';
import { Refine } from '@refinedev/core';
import { dataProvider } from './providers/dataProvider';
import { Layout } from './components/Layout';
import { ProductList } from './pages/products/list';

export function App() {
  return (
    <Refine
      dataProvider={dataProvider}
      resources={[
        {
          name: 'products',
          list: '/',
        },
      ]}
    >
      <Layout>
        <ProductList />
      </Layout>
    </Refine>
  );
}

export default App;
