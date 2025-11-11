// components/EscolherServico.js
import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '../../../config/config'
import * as Location from 'expo-location';

export default function EscolherServico() {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "É necessário permitir acesso à localização.");
        setCarregando(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setLocation(loc.coords);
      setCarregando(false);
    })();
  }, []);

  const solicitar = async (servico) => {
    if (!location) {
      Alert.alert("Erro", "Não foi possível obter sua localização.");
      return;
    }

    const clienteUid = firebase.auth().currentUser?.uid;
    if (!clienteUid) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    // Mostra estado de "buscando"
    setBuscando(true);

    // Simula tempo de busca de prestadores (5 segundos)
    setTimeout(() => {
      setBuscando(false);

      const prestadores = {
        Guincho: ["AutoSocorro Diadema", "Guincho 24h Express", "Reboque Rápido"],
        Bateria: ["Oficina Elétrica Silva", "AutoPower Center", "SOS Baterias"],
        Pneu: ["Borracharia do Zé", "Pneu Rápido", "PitStop Diadema"],
        Revisao: ["Mecanica do Edu", "Automecanica do Bola", "AutoCar"]
      };

      const lista = prestadores[servico] || ["Prestador Genérico"];
      const escolhido = lista[Math.floor(Math.random() * lista.length)];

      Alert.alert(
        "🚨 Solicitação aceita!",
        `${escolhido} aceitou o serviço de ${servico.toLowerCase()}.`,
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("Home", { screen: "Pagamento" });
            },
          },
        ]
      );
    }, 5000);
  };

  if (carregando) {
    return (
      <View style={estilos.containerCentral}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Obtendo localização...</Text>
      </View>
    );
  }

  if (buscando) {
    return (
      <View style={estilos.containerCentral}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10 }}>Buscando prestadores próximos...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={estilos.container}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20, marginTop: '10%' }}>
          Qual sua necessidade?
        </Text>

        <Image source={require('../../../assets/bateria.png')} style={estilos.imagem} />
        <TouchableOpacity style={estilos.botaoPreto} 
          onPress={() => solicitar("Bateria")}
        >
          <Text style={estilos.textoBranco}>Bateria Descarregada</Text>
        </TouchableOpacity>

        <Image source={require('../../../assets/pneuf.png')} style={estilos.imagem} />
        <TouchableOpacity style={estilos.botaoPreto} 
          onPress={() => solicitar("Pneu")}
        >
          <Text style={estilos.textoBranco}>Pneu Furado</Text>
        </TouchableOpacity>
        
        <Image source={require('../../../assets/guincho.png')} style={estilos.imagem} />
        <TouchableOpacity style={estilos.botaoPreto} 
          onPress={() => solicitar("Guincho")}
        >
          <Text style={estilos.textoBranco}>Guincho</Text>
        </TouchableOpacity>

        <Image source={require('../../../assets/revisaoGeral.png')} style={estilos.imagem} />
        <TouchableOpacity style={estilos.botaoPreto} 
          onPress={() => solicitar("Revisao")}
        >
          <Text style={estilos.textoBranco}>Revisão Geral</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}


const estilos = StyleSheet.create({
  container: {alignItems: 'center', flex: 1, padding: 20, backgroundColor: '#fff'},
  containerCentral: {
    justifyContent: 'center', 
    alignItems: 'center', 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#fff'
  },
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