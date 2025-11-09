import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Servico() {
  const navigation = useNavigation();
  return (
    <View style={estilos.container}>
      <Text>Verifique as Informações</Text>
    </View>
  
  );
}

const estilos = StyleSheet.create({
  container: {alignItems: 'center', flex: 1, padding: 20, backgroundColor: '#fff'},
})