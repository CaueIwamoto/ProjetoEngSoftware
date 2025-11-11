import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Pagamento() {
  const navigation = useNavigation();
  return (
    <View style={{ padding: 20 }, {backgroundColor: '#fff'}, {height: '100%'}, {marginTop: '20%'}}>
      <Text style={estilos.texto}>Verifique as Informações</Text>
      <Text>Resumo de Valores</Text>
    </View>
  
  );
}

const estilos = StyleSheet.create({
  container: {alignItems: 'center'},
  titulo: { fontSize: 30, alignSelf: 'center', marginVertical: 5 },
  texto: { fontSize: 20, alignSelf: 'center', marginVertical: 5 },
  textoGrande: { fontSize: 40, alignSelf: 'center', marginVertical: 5 },
  input: {height: 40, padding: 10, fontSize: 15, borderColor: 'gray',
  borderWidth: 1, margin: 10, borderRadius: 8 },
})