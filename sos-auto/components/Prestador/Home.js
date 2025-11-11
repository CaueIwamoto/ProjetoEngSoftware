import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity, Alert } from 'react-native';
import firebase from "../../config/config"

export default function Home({ route }) {
  const { uid } = route.params;
  const [razaoSocial, setRazaoSocial] = useState("");

  useEffect(() => {
    // carrega razão social
    const ref = firebase.database().ref(`usuarios/${uid}`);
    ref.once("value")
      .then(snapshot => {
        if (snapshot.exists()) {
          setRazaoSocial(snapshot.val().razaoSocial || "");
        }
      })
      .catch(err => console.log("Erro:", err));
  }, []);

  useEffect(() => {
    // simula notificações de tempos em tempos (ex: a cada 10 segundos)
    const interval = setInterval(() => {
      // gera serviço aleatório só pra parecer real
      const servicos = ["Guincho", "Troca de bateria", "Pneu furado", "Pane elétrica"];
      const servico = servicos[Math.floor(Math.random() * servicos.length)];
      const cliente = `Cliente_${Math.floor(Math.random() * 1000)}`;

      Alert.alert(
        "🚨 Nova Solicitação!",
        `Serviço: ${servico}\nCliente: ${cliente}`,
        [
          { text: "Ignorar" },
          { text: "Aceitar", onPress: () => Alert.alert("✅ Solicitação aceita!") }
        ]
      );
    }, 10000); // 10 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Olá {razaoSocial || "Prestador"}
      </Text>

      <Text style={{ marginTop: 15, fontSize: 16 }}>
        Aguardando solicitações...
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {alignItems: 'center'},
  titulo: { fontSize: 30, alignSelf: 'center', marginVertical: 5 },
  textoGrande: { fontSize: 40, alignSelf: 'center', marginVertical: 5 },
  input: {height: 40, padding: 10, fontSize: 15, borderColor: 'gray',
  borderWidth: 1, margin: 10, borderRadius: 8 },
});
