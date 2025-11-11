import React, {useState} from 'react';
import { Alert, View, Text, TextInput, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import firebase from './config/config';

const Abas = createBottomTabNavigator();
const Pilha = createStackNavigator();
const Stack = createStackNavigator();

import Servico from "./components/Cliente/HomeStackCliente/Servico";
import Pagamento from "./components/Cliente/HomeStackCliente/Pagamento";
import Home from './components/Cliente/HomeStackCliente/Home'

import Buscar from './components/Cliente/Buscar'
import Chat from './components/Cliente/Chat'
import Perfil from './components/Cliente/Perfil'

//Telas Prestador
import HomePrestador from "./components/Prestador/Home"
import Avaliacoes from "./components/Prestador/Avaliacoes"
import PerfilPrestador from "./components/Prestador/Perfil"
import ChatPrestador from "./components/Prestador/Chat"



// --- Tela de Login ---
class Login extends React.Component {
  state = { usuario: '', senha: '' };

  logar = () => {
     const email = this.state.usuario.toLowerCase(); 
     const password = this.state.senha.toLowerCase(); 
     firebase.auth() .signInWithEmailAndPassword(email, password) 
     .then((userCredential) => { 
       const user = userCredential.user; 
       const uid = user.uid; 
       Alert.alert("Logado!", "Login realizado com sucesso!"); 
       firebase.database().ref(`usuarios/${uid}`).once("value")
        .then(snapshot => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            console.log("Tipo:", userData.tipo); // cliente ou prestador

            if (userData.tipo === "cliente") {
              this.props.navigation.replace("AppTabsCliente", { uid, email });
            } else {
              this.props.navigation.replace("AppTabsPrestador", { uid, email });
            }
          } else {
            Alert.alert("Usuário não encontrado no banco.");
          }
        })
        .catch(err => {
          console.log("Erro ao buscar dados:", err);
        });
       }) 
       .catch(error => { 
         const errorCode = error.code; 
         if (errorCode === "auth/invalid-email") { Alert.alert("Formato do email inválido"); } 
         else if (errorCode === "auth/user-not-found") { Alert.alert("Usuário não encontrado"); } 
         else if (errorCode === "auth/wrong-password") { Alert.alert("Senha incorreta"); } 
         else { Alert.alert("Erro: " + error.message); } 
        }); 
  
  };



  render() {
    return (
      <View style={{ padding: 20 }, {backgroundColor: '#fff'}, {height: '100%'}, {marginTop: '20%'}}>
        <Text style={estilos.titulo}>SOS Auto</Text>
        <Image source={require('./assets/logo.png')} style={estilos.imagem} />
        <Text style={estilos.texto}>Login</Text>
        <Text style={{fontSize: 14, alignSelf: 'center', marginVertical: 5}}>
          Digite seu Email e senha para acessar o app
        </Text>

        <TextInput
          style={estilos.input}
          placeholder="email@dominio.com"
          placeholderTextColor="#999"   
          onChangeText={texto => this.setState({ usuario: texto })}
        />

        <TextInput 
          style={estilos.input} 
          placeholder="senha"
          placeholderTextColor="#999"  
          secureTextEntry 
          onChangeText={texto => this.setState({ senha: texto })} 
        />

        <View style={estilos.container}>
          <TouchableOpacity style={estilos.botaoPreto} onPress={this.logar}>
            <Text style={estilos.textoBranco}>Continuar</Text>
          </TouchableOpacity>

          <Text style={estilos.ou}>Ou</Text>

          <TouchableOpacity style={estilos.botaoCinza} 
            onPress={() => this.props.navigation.navigate("Cadastro")}
          >
            <Text style={estilos.textoPreto}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>

      </View>
      
    );
  }
}


// --- Tela de Cadastro ---
class Cadastro extends React.Component {
  state = { 
    tipo: 'cliente',
    user: '',
    password: '',
    nome: '',
    sobrenome: '',
    cpf: '',
    celular: '',
    razaoSocial: '',
    cnpj: '',
    servicos: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    cep: '',
  };

  gravar = () => {
    const email = this.state.user.toLowerCase();
    const password = this.state.password.toLowerCase();

    firebase.auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const userId = userCredential.user.uid;

      if (this.state.tipo === 'cliente') {
        // se for cliente
        firebase.database().ref('usuarios/' + userId).set({
          tipo: 'cliente',
          nome: this.state.nome,
          sobrenome: this.state.sobrenome,
          cpf: this.state.cpf,
          celular: this.state.celular,
          email: email,
        });
      } else {
        // se for prestador
        firebase.database().ref('usuarios/' + userId).set({
          tipo: 'prestador',
          razaoSocial: this.state.razaoSocial,
          cnpj: this.state.cnpj,
          servicos: this.state.servicos,
          celular: this.state.celular,
          email: email,
          endereco: {
            cidade: this.state.cidade,
            bairro: this.state.bairro,
            rua: this.state.rua,
            numero: this.state.numero,
            cep: this.state.cep,
          },
          
        });
      }

      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      this.props.navigation.goBack();
    })
      .catch(error => Alert.alert('Erro', error.message));
  };

  
  render() {
    const { tipo } = this.state;

    return (
      
      <View style={{ padding: 20 }, {backgroundColor: '#fff'}, {marginTop: '10%'}}>

        <View style={{backgroundColor: '#d3d3d3'}}>
          <Text style={estilos.titulo}>SOS Auto</Text>
          <Text style={estilos.texto}>Cadastro</Text>
        </View>

        <View style={estilos.switchContainer}>
          <TouchableOpacity
            style={[
              estilos.botaoSwitch,
              tipo === 'cliente' ? estilos.botaoAtivo : estilos.botaoInativo,
            ]}
            onPress={texto => this.setState({ tipo: 'cliente' })} 
          >
            <Text style={tipo === 'cliente' ? estilos.textoAtivo : estilos.textoInativo}>
              Cliente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              estilos.botaoSwitch,
              tipo === 'prestador' ? estilos.botaoAtivo : estilos.botaoInativo,
            ]}
            onPress={texto => this.setState({ tipo: 'prestador' })} 
          >
            <Text style={tipo === 'prestador' ? estilos.textoAtivo : estilos.textoInativo}>
              Prestador
            </Text>
          </TouchableOpacity>
        </View>

        {tipo === 'cliente' ? (
        <View>
          <Text style={estilos.textoCadastro}>Nome:</Text>
          <TextInput 
            placeholder="Nome"
            placeholderTextColor="#999"
            style={estilos.input} 
            onChangeText={texto => this.setState({ nome: texto })} 
          />

          <Text style={estilos.textoCadastro}>Sobrenome:</Text>
          <TextInput 
            placeholder="Sobrenome"
            placeholderTextColor="#999"
            style={estilos.input} 
            onChangeText={texto => this.setState({ sobrenome: texto })} 
          />

          <Text style={estilos.textoCadastro}>CPF:</Text>
          <TextInput 
            placeholder="XXX.XXX.XXX-XX"
            placeholderTextColor="#999"
            style={estilos.input} 
            keyboardType="numeric"
            maxLength={11} 
            onChangeText={texto => this.setState({ cpf: texto })} 
          />

          <Text style={estilos.textoCadastro}>Email:</Text>
          <TextInput 
            placeholder="email@dominio.com.br"
            placeholderTextColor="#999"
            style={estilos.input} 
            onChangeText={texto => this.setState({ user: texto })} 
          />
          
          <Text style={estilos.textoCadastro}>Numero Celular:</Text>
          <TextInput 
            placeholder="(DDD) XXXX-XXXXX"
            placeholderTextColor="#999"
            style={estilos.input} 
            keyboardType="numeric"
            maxLength={11} 
            onChangeText={texto => this.setState({ celular: texto })} 
          />

          <Text style={estilos.textoCadastro}>Senha:</Text>
          <TextInput 
            placeholder="Senha..."
            placeholderTextColor="#999"
            style={estilos.input} 
            secureTextEntry onChangeText={texto => this.setState({ password: texto})}
          />

          <View style={estilos.container}>
            <TouchableOpacity 
                style={estilos.botaoPreto} 
                onPress={(this.gravar)}
              >
                <Text style={estilos.textoBranco}>Cadastre-se</Text>
            </TouchableOpacity>
            <Text style={estilos.ou}>Já tenho Cadastro</Text>
            <TouchableOpacity 
              style={estilos.botaoCinza} 
              onPress={() => this.props.navigation.navigate("Login")}
            >
              <Text style={estilos.textoPreto}>Login</Text>
            </TouchableOpacity>
          </View>

        </View>

        ): (
        <ScrollView>
          <View style={{paddingBottom: 250}}>
            <Text style={estilos.textoCadastro}>Nome/Razão Social:</Text>
            <TextInput 
              placeholder="Nome/Razão Social"
              placeholderTextColor="#999"
              style={estilos.input} 
              onChangeText={texto => this.setState({ razaoSocial: texto })} 
            />

            <Text style={estilos.textoCadastro}>Tipos de Serviço:</Text>
            <TextInput 
              placeholder="Guincho, Borracheiro, Mecânico, etc..."
              placeholderTextColor="#999"
              style={estilos.input} 
              onChangeText={texto => this.setState({ servicos: texto })} 
            />

            <Text style={estilos.textoCadastro}>CNPJ:</Text>
            <TextInput 
              placeholder="XX.XXX.XXX/XXXX.XX"
              placeholderTextColor="#999"
              style={estilos.input} 
              onChangeText={texto => this.setState({ cnpj: texto })} 
            />

            <Text style={estilos.textoCadastro}>Email:</Text>
            <TextInput 
              placeholder="email@dominio.com.br"
              placeholderTextColor="#999"
              style={estilos.input} 
              onChangeText={texto => this.setState({ user: texto })} 
            />
            
            <Text style={estilos.textoCadastro}>Numero Celular:</Text>
            <TextInput 
              placeholder="(DDD) XXXX-XXXX"
              placeholderTextColor="#999"
              style={estilos.input} 
              onChangeText={texto => this.setState({ celular: texto })} 
            />

            <Text style={estilos.textoCadastro}>Senha:</Text>
            <TextInput 
              placeholder="Senha..."
              placeholderTextColor="#999"
              style={estilos.input} 
              secureTextEntry onChangeText={texto => this.setState({ password: texto})}
            />

            <Text style={estilos.textoCadastro}>Numero Celular:</Text>
            <TextInput 
              placeholder="(DDD) XXXX-XXXX"
              placeholderTextColor="#999"
              style={estilos.input} 
              onChangeText={texto => this.setState({ celular: texto })} 
            />

            <Text style={estilos.texto}>Endereço</Text>
            <Text style={estilos.textoCadastro}>Cidade:</Text>
            <TextInput 
              placeholder="Cidade"
              placeholderTextColor="#999"
              style={estilos.input} 
              onChangeText={texto => this.setState({ cidade: texto })} 
            />

            <Text style={estilos.textoCadastro}>Bairro:</Text>
            <TextInput 
              placeholder="Bairro"
              placeholderTextColor="#999"
              style={estilos.input} 
              onChangeText={texto => this.setState({ bairro: texto })} 
            />

            <Text style={estilos.textoCadastro}>Rua:</Text>
            <TextInput 
              placeholder="Rua"
              placeholderTextColor="#999"
              style={estilos.input} 
              onChangeText={texto => this.setState({ rua: texto })} 
            />

            <Text style={estilos.textoCadastro}>Número:</Text>
            <TextInput 
              placeholder="XXX"
              placeholderTextColor="#999"
              style={estilos.input} 
              onChangeText={texto => this.setState({ numero: texto })} 
            />

            <Text style={estilos.textoCadastro}>CEP:</Text>
            <TextInput 
              placeholder="XXXXX-XXX"
              placeholderTextColor="#999"
              style={estilos.input} 
              onChangeText={texto => this.setState({ cep: texto })} 
            />

            <View style={estilos.container}>
              <TouchableOpacity 
                  style={estilos.botaoPreto} 
                  onPress={(this.gravar)}
                >
                  <Text style={estilos.textoBranco}>Cadastre-se</Text>
              </TouchableOpacity>
              <Text style={estilos.ou}>Já tenho Cadastro</Text>
              <TouchableOpacity 
                style={estilos.botaoCinza} 
                onPress={() => this.props.navigation.navigate("Login")}
              >
                <Text style={estilos.textoPreto}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      
        )}  

        

        


      </View>
    );
  }
}

// --- Abas do App Final ---
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Mapa" component={Home} />
      <Stack.Screen name="Servico" component={Servico} />
      <Stack.Screen name="Pagamento" component={Pagamento} />
    </Stack.Navigator>
  );
}
function AppTabsCliente({ route }) {
  const { uid, email } = route.params;
  return (
    <Abas.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let icone;
          if (route.name === 'Home') icone = 'home';
          else if (route.name === 'Buscar') icone = 'magnify';
          else if (route.name === 'Chat') icone = 'chat-processing';
          else if (route.name === 'Perfil') icone = 'account';
          return <MaterialCommunityIcons name={icone} color={color} size={size} />;
        },
        headerShown: false,
      })}
    >
      <Abas.Screen name="Home" component={HomeStack} initialParams={{ uid, email }}/>
      <Abas.Screen name="Buscar" component={Buscar} initialParams={{ uid, email }}/>
      <Abas.Screen name="Chat" component={Chat} initialParams={{ uid, email }}/>
      <Abas.Screen name="Perfil" component={Perfil} initialParams={{ uid, email }}/>
    </Abas.Navigator>
  );
}


function AppTabsPrestador({ route }) {
  const { uid, email } = route.params;
  return (
    <Abas.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let icone;
          if (route.name === 'Home') icone = 'home';
          else if (route.name === 'Avaliações') icone = 'star-outline';
          else if (route.name === 'Chat') icone = 'chat-processing';
          else if (route.name === 'Perfil') icone = 'account';
          return <MaterialCommunityIcons name={icone} color={color} size={size} />;
        },
        headerShown: false,
      })}
    >
      <Abas.Screen name="Home" component={HomePrestador} initialParams={{ uid, email }} />
      <Abas.Screen name="Avaliações" component={Avaliacoes} initialParams={{ uid, email }} />
      <Abas.Screen name="Chat" component={ChatPrestador} initialParams={{ uid, email }} />
      <Abas.Screen name="Perfil" component={PerfilPrestador} initialParams={{ uid, email }} />
    </Abas.Navigator>
  );
}


// --- App principal com Pilha ---
export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Pilha.Navigator screenOptions={{ headerShown: false }}>
          <Pilha.Screen name="Login" component={Login} />
          <Pilha.Screen name="Cadastro" component={Cadastro} />
          <Pilha.Screen name="AppTabsCliente" component={AppTabsCliente} />
          <Pilha.Screen name="AppTabsPrestador" component={AppTabsPrestador} />
        </Pilha.Navigator>
      </NavigationContainer>
    );
  }
}

const estilos = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    marginBottom: 50,
    marginTop: 10
  },
  botaoSwitch: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  botaoAtivo: {
    backgroundColor: '#000',
  },
  botaoInativo: {
    backgroundColor: '#ccc',
  },
  textoAtivo: {
    color: '#fff',
    fontWeight: 'bold',
  },
  textoInativo: {
    color: '#000',
    fontWeight: 'bold',
  },
  //-------------------------------------
  container: {alignItems: 'center'},
  titulo: { fontSize: 30, alignSelf: 'center', marginVertical: 5 },
  texto: { fontSize: 20, alignSelf: 'center', marginVertical: 5 },
  textoCadastro: { fontSize: 15, marginVertical: 0, marginLeft: 10 },
  input: {height: 40, padding: 10, fontSize: 15, borderColor: 'gray',
  borderWidth: 1, margin: 10, borderRadius: 8 },

  imagem: { width: 196, height: 196, alignSelf: 'center', marginVertical: 5},

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

  botaoCinza: {
    backgroundColor: '#ccc',  
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    marginVertical: 5,
  },

  textoPreto: {
    color: '#000',             
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  ou: {
    fontSize: 10,
    alignSelf: 'center',
    marginVertical: 5,
  },
});
