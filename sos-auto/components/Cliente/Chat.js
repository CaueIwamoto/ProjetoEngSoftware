import React from 'react';
import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity } from 'react-native';
import firebase from '../../config/config';

class Chat extends React.Component {
  render() {
    return (
      <View style={estilos.tela}>
        <Text style={estilos.titulo}>Chat</Text>
        ))}
      </View>
    );
  }
}

const estilos = StyleSheet.create({
  tela: { flex: 1, padding: 16, backgroundColor: '#fff' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});


export default Chat;