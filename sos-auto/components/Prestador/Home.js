import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert, TouchableOpacity, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import firebase from "../../config/config";

export default function Home({ route }) {
  const { uid } = route.params;
  const [razaoSocial, setRazaoSocial] = useState("");
  const [location, setLocation] = useState(null);
  const [servicoAtivo, setServicoAtivo] = useState(null); // guarda dados do serviço aceito
  const [clienteLocation, setClienteLocation] = useState(null);

  // 🔹 Carrega dados do prestador
  useEffect(() => {
    const ref = firebase.database().ref(`usuarios/${uid}`);
    ref.once("value")
      .then((snapshot) => {
        if (snapshot.exists()) {
          setRazaoSocial(snapshot.val().razaoSocial || "");
        }
      })
      .catch((err) => console.log("Erro:", err));
  }, []);

  // 🔹 Pega localização atual do prestador
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Ative o GPS para ver o mapa.");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  // 🔹 Simula novas solicitações
  useEffect(() => {
    if (servicoAtivo) return; // se já estiver em serviço, não mostrar alertas

    const nomesClientes = [
    "Carlos Andrade",
    "Mariana Silva",
    "João Pereira",
    "Fernanda Souza",
    "Lucas Martins",
    "Ana Beatriz",
    "Rafael Gomes",
    "Patrícia Oliveira",
    "Gustavo Ferreira",
    "Juliana Costa",
    "Eduardo Moreira",
    "Bianca Rocha",
    "Cauê Meira",
    "David Gabriel"
  ];
    const interval = setInterval(() => {
      const servicos = ["Guincho", "Troca de bateria", "Pneu furado", "Revisão"];
      const servico = servicos[Math.floor(Math.random() * servicos.length)];
        // Escolhe um nome da lista
      const cliente = nomesClientes[Math.floor(Math.random() * nomesClientes.length)];

      // gera coordenadas aleatórias próximas do prestador (só pra simulação)
      if (location) {
        const randomOffset = () => (Math.random() - 1.5) / 100;
        const clienteCoords = {
          latitude: location.latitude + randomOffset(),
          longitude: location.longitude + randomOffset(),
        };

        Alert.alert(
          "🚨 Nova Solicitação!",
          `Serviço: ${servico}\nCliente: ${cliente}`,
          [
            { text: "Ignorar" },
            {
              text: "Aceitar",
              onPress: () => {
                setServicoAtivo({ servico, cliente });
                setClienteLocation(clienteCoords);
                Alert.alert("✅ Solicitação aceita!", `Rumo ao cliente ${cliente}`);
              },
            },
          ]
        );
      }
    }, 15000); // a cada 15 segundos

    return () => clearInterval(interval);
  }, [location, servicoAtivo]);

  // 🔹 Se não tiver localização ainda
  if (!location) {
    return (
      <View style={estilos.container}>
        <Text style={estilos.texto}>Obtendo localização...</Text>
      </View>
    );
  }

  // 🔹 Se estiver com um serviço ativo → mostra o mapa
  if (servicoAtivo && clienteLocation) {
    return (
      <View style={estilos.containerMapa}>
        <Text style={estilos.titulo}>A caminho do cliente 🚗</Text>
        <Text style={estilos.texto}>
          Serviço: {servicoAtivo.servico} {"\n"}Cliente: {servicoAtivo.cliente}
        </Text>

        <MapView
          style={estilos.mapa}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={location}
            title="Você"
            pinColor="blue"
          />
          <Marker
            coordinate={clienteLocation}
            title="Cliente"
            pinColor="red"
          />
        </MapView>

        <TouchableOpacity
          style={estilos.botao}
          onPress={() => {
            Alert.alert("Serviço concluído!");
            setServicoAtivo(null);
          }}
        >
          <Text style={estilos.textoBotao}>Finalizar Serviço</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 🔹 Tela normal (sem serviço)
  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Olá {razaoSocial || "Prestador"}</Text>
      <Text style={estilos.texto}>Aguardando solicitações...</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    marginTop: "20%",
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  texto: {
    fontSize: 18,
    textAlign: "center",
  },
  containerMapa: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  mapa: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.6,
    marginVertical: 20,
  },
  botao: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  textoBotao: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
