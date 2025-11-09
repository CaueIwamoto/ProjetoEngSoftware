import React from 'react';
import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity } from 'react-native';
import firebase from '../config/config';
import {WebView} from 'react-native-webview';

class Buscar extends React.Component {
  render() {
    return (
      <View style={estilos.tela}>
        <Text style={estilos.titulo}>Buscar</Text>
        <WebView source={{ uri: 'https://www.google.com/maps' }} style={{ flex: 1 }}/ >
      </View>
    );
  }
}

const estilos = StyleSheet.create({
  tela: { flex: 1, padding: 16, backgroundColor: '#fff' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});


export default Buscar;