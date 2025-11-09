// components/EscolherServico.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function EscolherServico() {
  const navigation = useNavigation();
  return (
    <ScrollView>
      <View style={estilos.container}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20, marginTop: '10%' }}>
          Qual sua necessidade?
        </Text>

        <Image source={require('../../assets/bateria.png')} style={estilos.imagem} />
        <TouchableOpacity style={estilos.botaoPreto} 
          onPress={() => navigation.navigate("Home", {
            screen: "Pagamento"
          })}
        >
          <Text style={estilos.textoBranco}>Bateria Descarregada</Text>
        </TouchableOpacity>

        <Image source={require('../../assets/pneuf.png')} style={estilos.imagem} />
        <TouchableOpacity style={estilos.botaoPreto} 
          onPress={() => navigation.navigate("Home", {
            screen: "Pagamento"
          })}
        >
          <Text style={estilos.textoBranco}>Pneu Furado</Text>
        </TouchableOpacity>
        
        <Image source={require('../../assets/guincho.png')} style={estilos.imagem} />
        <TouchableOpacity style={estilos.botaoPreto} 
          onPress={() => navigation.navigate("Home", {
            screen: "Pagamento"
          })}
        >
          <Text style={estilos.textoBranco}>Guincho</Text>
        </TouchableOpacity>

        <Image source={require('../../assets/revisaoGeral.png')} style={estilos.imagem} />
        <TouchableOpacity style={estilos.botaoPreto} 
          onPress={() => navigation.navigate("Home", {
            screen: "Pagamento"
          })}
        >
          <Text style={estilos.textoBranco}>Revisão Geral</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {alignItems: 'center', flex: 1, padding: 20, backgroundColor: '#fff'},
  botaoPreto: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    marginVertical: 5,
  },

  textoBranco: {
    color: '#fff',             
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagem: { 
    alignSelf: 'center',
    width: 240,
    height: 128
  },
})