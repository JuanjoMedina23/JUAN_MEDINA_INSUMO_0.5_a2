import React from 'react';
import { View, Text } from 'react-native';
import Layout from './_layout';  // Importa el componente correctamente como Layout (no _layout)

const Index = () => {
  return (
    <View>
      <Text>Este es el componente index</Text>
      <Layout />  {/* Aquí usas el componente Layout */}
    </View>
  );
};

export default Index;
