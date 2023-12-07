import {
  SafeAreaView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, FONTFAMILY, FONTSIZE} from '../theme/theme';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import AppHeader from '../components/AppHeader';
import {useState} from 'react';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useAuth} from './../context/AuthContext';
const LoginScreen = ({navigation}: any) => {
  const {login} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    login(email, password, navigation);
  };

  return (
    <SafeAreaView
      style={{display: 'flex', flex: 1, backgroundColor: COLORS.Black}}>
      <View
        style={{
          marginHorizontal: 36,
          marginTop: 40,
        }}>
        <AppHeader
          name="close"
          header={'Login'}
          action={() => navigation.goBack()}
        />
      </View>
      <View style={{padding: 12}}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: FONTSIZE.size_30,
              color: COLORS.Orange,
              fontFamily: FONTFAMILY.poppins_bold,
              marginVertical: 18,
            }}>
            Login here
          </Text>
          <Text
            style={{
              fontFamily: FONTFAMILY.poppins_bold,
              fontSize: FONTSIZE.size_20,
              maxWidth: '80%',
              textAlign: 'center',
            }}>
            Welcome back you've been missed !
          </Text>
        </View>
        <View
          style={{
            marginVertical: 18,
          }}>
          <TextInput
            value={email}
            onChangeText={text => setEmail(text)}
            placeholder="Email"
            placeholderTextColor={COLORS.WhiteRGBA15}
            style={{
              fontFamily: FONTFAMILY.poppins_regular,
              fontSize: FONTSIZE.size_16,
              padding: 12,
              backgroundColor: COLORS.Grey,
              borderRadius: 6,
              marginVertical: 12,
              marginBottom: 30,
            }}
          />

          <TextInput
            value={password}
            secureTextEntry
            onChangeText={text => setPassword(text)}
            placeholder="Password"
            placeholderTextColor={COLORS.WhiteRGBA15}
            style={{
              fontFamily: FONTFAMILY.poppins_regular,
              fontSize: FONTSIZE.size_16,
              padding: 12,
              backgroundColor: COLORS.Grey,
              borderRadius: 6,
              marginVertical: 6,
            }}
          />
        </View>
        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            padding: 12,
            backgroundColor: COLORS.Orange,
            marginVertical: 18,
            borderRadius: 6,
            shadowColor: COLORS.Orange,
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.3,
            shadowRadius: 6,
          }}>
          <Text
            style={{
              fontFamily: FONTFAMILY.poppins_bold,
              color: COLORS.White,
              textAlign: 'center',
              fontSize: FONTSIZE.size_20,
            }}>
            Sign in
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          style={{
            padding: 12,
          }}>
          <Text
            style={{
              fontFamily: FONTFAMILY.poppins_semibold,
              color: COLORS.White,
              textAlign: 'center',
              fontSize: FONTSIZE.size_14,
            }}>
            Create new account
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
