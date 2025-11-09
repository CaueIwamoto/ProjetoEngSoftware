import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default class Home extends React.Component {
  state = {
    region: null,
    carregando: true,
  };

  async componentDidMount() {
    if (Platform.OS === 'web') {
      Alert.alert('Aviso', 'Localização não é suportada no modo web.');
      this.setState({ carregando: false });
      return;
    }
    await this.pegarLocalizacaoUsuario();
  }

  pegarLocalizacaoUsuario = async () => {
    try {
      // pede permissão
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permissão negada',
          'Precisamos da sua localização para mostrar o mapa.'
        );
        this.setState({ carregando: false });
        return;
      }

      // pega posição
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      this.setState({
        region: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        },
        carregando: false,
      });
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível obter a localização.');
      this.setState({ carregando: false });
    }
  };

  render() {
    const { region, carregando } = this.state;

    if (carregando) {
      return (
        <View style={estilos.container}>
          <Text style={estilos.carregando}>Carregando mapa...</Text>
        </View>
      );
    }

    return (
      <View style={estilos.container}>
        {region ? (
          <MapView
            style={estilos.mapa}
            region={region}
            showsUserLocation={true}
            showsMyLocationButton={true}
            customMapStyle={[
              {
                featureType: 'poi', // "point of interest"
                elementType: 'labels',
                stylers: [{ visibility: 'off' }], // esconde todos os pontos
              },
            ]}
          />
        ) : (
          <Text style={estilos.carregando}>Não foi possível obter a localização.</Text>
        )}

        <TouchableOpacity style={estilos.botao}
          onPress={() => this.props.navigation.navigate("Servico")}
        >
          <Text style={estilos.textoBotao}>Solicitar Socorro</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapa: {
    flex: 1,
  },
  carregando: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
  },
  botao: {
    position: 'absolute',
    bottom: 40,
    left: '10%',
    right: '10%',
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 5,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
