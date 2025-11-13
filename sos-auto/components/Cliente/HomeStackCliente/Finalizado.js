import React, { Component } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";

export default class Finalizado extends Component {
  constructor(props) {
    super(props);
    const { tempoEstimado } = this.props.route.params;

    this.state = {
      tempoRestante: tempoEstimado || 15, // em minutos
    };
  }

  componentDidMount() {
    // Atualiza a cada minuto (60.000 ms)
    this.timer = setInterval(() => {
      this.setState((prevState) => {
        if (prevState.tempoRestante > 1) {
          return { tempoRestante: prevState.tempoRestante - 1 };
        } else {
          clearInterval(this.timer);
          Alert.alert("Prestador chegou!", "O profissional está no local.");
          return { tempoRestante: 0 };
        }
      });
    }, 60000);
  }

  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
  }

  render() {
    const { prestador, servico } = this.props.route.params;
    const { tempoRestante } = this.state;

    return (
      <View style={estilos.container}>
        <Text style={estilos.titulo}>Serviço Confirmado ✅</Text>
        <Text style={estilos.texto}>Serviço: {servico}</Text>
        <Text style={estilos.texto}>Prestador: {prestador}</Text>
        <Text style={estilos.tempo}>
          Tempo estimado de chegada: {tempoRestante} min
        </Text>

        <Text style={estilos.status}>
          {tempoRestante > 0
            ? "Seu prestador está a caminho..."
            : "Prestador chegou!"}
        </Text>
      </View>
    );
  }
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  texto: {
    fontSize: 18,
    marginBottom: 10,
  },
  tempo: {
    fontSize: 20,
    fontWeight: "600",
    color: "#007BFF",
    marginTop: 20,
  },
  status: {
    fontSize: 18,
    marginTop: 10,
    color: "gray",
  },
});
