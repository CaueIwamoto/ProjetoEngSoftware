import React, {route, useState} from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default class Pagamento extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      servico: 'Pneu furado / Troca do pneu', // vem do serviço escolhido
      precoServico: 100, // exemplo fixo
      distanciaKm: Math.floor(Math.random() * 6) + 2, // gera entre 2 e 7 km
      forma: null
    };
    
  }

  selecionarForma(forma) {
    this.setState({ forma });
  }

  calcularFrete = () => {
    // exemplo: R$ 3 por km
    return this.state.distanciaKm * 3;
  };

  calcularTempo = () => {
    // 3 a 4 minutos por km
    const min = this.state.distanciaKm * 3;
    const max = this.state.distanciaKm * 4;
    return `${min}-${max} minutos`;
  };

  render() {
    
    const frete = this.calcularFrete();
    const total = this.state.precoServico + frete;
    const { servico, prestador } = this.props.route.params;
    const { forma } = this.state;
    const chavePix = `${prestador.toLowerCase().replace(/\s/g, '')}@sosauto.com.br`;
    const tempo = this.calcularTempo();

    return (
      <View style={{backgroundColor: '#fff'}, {marginTop: '20%'}}>
          <Text style={estilos.titulo}>Verifique os Valores</Text>
        <View style={estilos.container}>
          <Text style={estilos.textoEsquerda}>Resumo de valores</Text>

          <View style={estilos.linha}>
            <Text style={estilos.textoEsquerda}>Tipo de Serviço - {servico}</Text>
            <Text style={estilos.textoDireita}>R${this.state.precoServico.toFixed(2)}</Text>
          </View>

          <View style={estilos.linha}>
            <Text style={estilos.textoEsquerda}>Frete - {this.state.distanciaKm} km</Text>
            <Text style={estilos.textoDireita}>R${frete.toFixed(2)}</Text>
          </View>

          <View style={estilos.linha}>
            <Text style={estilos.textoEsquerda}>Tempo Estimado</Text>
            <Text style={estilos.textoDireita}>{tempo}</Text>
          </View>

          <View style={estilos.linhaTotal}>
            <Text style={estilos.textoTotal}>Preço Total:</Text>
            <Text style={estilos.valorTotal}>R${total.toFixed(2)}</Text>
          </View>
        </View>

         (
        <View style={estilos.container}>
          <Text style={estilos.titulo}>Forma de Pagamento</Text>

           {/* Opções */}
          <TouchableOpacity
            style={estilos.opcao}
            onPress={() => this.selecionarForma("Pix")}
          >
            <Text style={[estilos.texto, forma === "Pix" && estilos.selecionado]}>
              ○ Pix
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.opcao}
            onPress={() => this.selecionarForma("Dinheiro")}
          >
            <Text
              style={[estilos.texto, forma === "Dinheiro" && estilos.selecionado]}
            >
              ○ Dinheiro
            </Text>
          </TouchableOpacity>

          {/* Mostra informações conforme a escolha */}
          {forma === "Pix" && (
            <View style={estilos.caixaInfo}>
              <Text style={estilos.infoTitulo}>Chave Pix:</Text>
              <Text style={estilos.infoTexto}>{chavePix}</Text>
            </View>
          )}

          {forma === "Dinheiro" && (
            <View style={estilos.caixaInfo}>
              <Text style={estilos.infoTitulo}>Pagamento em dinheiro</Text>
              <Text style={estilos.infoTexto}>
                Efetue o pagamento diretamente ao prestador.
              </Text>
            </View>
          )}

          {/* Botão confirmar */}
          <TouchableOpacity style={estilos.botao}>
            <Text style={estilos.textoBotao}
            onPress={() => {
              Alert.alert(
                "Serviço Confirmado",
                "Seu pagamento foi realizado com sucesso!",
                [
                  {
                    text: "OK",
                    onPress: () => this.props.navigation.navigate("Finalizado", {
                      prestador,
                      servico,
                      tempoEstimado: 15
                    }),
                  },
                ]
              );
            }}
            >
            Confirmar Serviço</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

const estilos = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
  },
  titulo: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  textoEsquerda: {
    fontSize: 16,
  },
  textoDireita: {
    fontSize: 16,
  },
  linhaTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
  },
  textoTotal: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  valorTotal: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  opcao: {
    marginVertical: 8,
  },
  texto: {
    fontSize: 16,
  },
  selecionado: {
    fontWeight: "bold",
    color: "#000",
  },
  caixaInfo: {
    marginTop: 20,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 10,
  },
  infoTitulo: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  infoTexto: {
    fontSize: 15,
  },
  botao: {
    marginTop: 30,
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
  },
  textoBotao: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});