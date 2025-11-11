import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';
import firebase from '../../../config/config';

import localConfig from '../../../config/localConfig';
Geocoder.init(localConfig.GOOGLE_MAPS_API_KEY);

export default class Home extends React.Component {
  state = {
    region: null,
    carregando: true,
    prestadores: [], // lista dos prestadores com coordenadas
  };

  async componentDidMount() {
    if (Platform.OS === 'web') {
      Alert.alert('Aviso', 'Localização não é suportada no modo web.');
      this.setState({ carregando: false });
      return;
    }

    await this.pegarLocalizacaoUsuario();
    await this.carregarPrestadores();
  }

  // pega localização do cliente
  pegarLocalizacaoUsuario = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permissão negada',
          'Precisamos da sua localização para mostrar o mapa.'
        );
        this.setState({ carregando: false });
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      this.setState({
        region: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        },
        carregando: false,
      });
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível obter a localização.');
      this.setState({ carregando: false });
    }
  };

  // busca os prestadores e geocodifica o endereço
  carregarPrestadores = async () => {
    try {
      const snapshot = await firebase.database().ref('usuarios').once('value');
      const data = snapshot.val() || {};

      const prestadores = Object.keys(data)
        .filter((id) => data[id].tipo === 'prestador')
        .map(async (id) => {
          const p = data[id];
          const enderecoCompleto = `${p.endereco.rua}, ${p.endereco.numero}, ${p.endereco.bairro}, ${p.endereco.cidade}, ${p.endereco.cep}`;
          try {
            const geo = await Geocoder.from(enderecoCompleto);
            const { lat, lng } = geo.results[0].geometry.location;
            return {
              id,
              nome: p.razaoSocial,
              servicos: p.servicos,
              latitude: lat,
              longitude: lng,
            };
          } catch (error) {
            console.log('Erro ao geocodificar', enderecoCompleto, error);
            return null;
          }
        });

      const resultados = (await Promise.all(prestadores)).filter((p) => p);
      this.setState({ prestadores: resultados });
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível carregar os prestadores.');
    }
  };

  render() {
    const { region, carregando, prestadores } = this.state;

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
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ]}
          >
            {/* marcadores dos prestadores */}
            {prestadores.map((p) => (
              <Marker
                key={p.id}
                coordinate={{
                  latitude: p.latitude,
                  longitude: p.longitude,
                }}
                title={p.nome}
                description={p.servicos}
              />
            ))}
          </MapView>
        ) : (
          <Text style={estilos.carregando}>Não foi possível obter a localização.</Text>
        )}

        <TouchableOpacity
          style={estilos.botao}
          onPress={() => this.props.navigation.navigate('Servico')}
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
