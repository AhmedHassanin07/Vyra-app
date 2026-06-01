import React from 'react';
import { View, Text } from 'react-native';

export default function IndexPage() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
      <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 12 }}>Vyra test screen</Text>
      <Text style={{ fontSize: 16 }}>If you can see this, rendering works.</Text>
    </View>
  );
}
