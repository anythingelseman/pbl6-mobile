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
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    login(email, password, navigation, setIsLoading);
  };

  return (
    <SafeAreaView
      style={{display: 'flex', flex: 1, backgroundColor: COLORS.White}}>
      <View
        style={{
          marginHorizontal: 36,
          marginTop: 40,
        }}>
        <AppHeader
          name="close"
          header={'Đăng nhập'}
          action={() => navigation.goBack()}
        />
      </View>
      <View style={{padding: 16}}>
        <View
          style={{
            alignItems: 'center',
            paddingHorizontal: 12,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: FONTSIZE.size_30,
              color: COLORS.Blue,
              fontFamily: FONTFAMILY.nunitosans_bold,
              marginVertical: 18,
            }}>
            Đăng nhập ngay Xem phim hay
          </Text>
          <Text
            style={{
              fontFamily: FONTFAMILY.nunitosans_bold,
              fontSize: FONTSIZE.size_20,
              maxWidth: '80%',
              textAlign: 'center',
              color: COLORS.Black,
            }}>
            Chào mừng bạn trở lại !
          </Text>
        </View>
        <View
          style={{
            marginVertical: 18,
          }}>
          <TextInput
            value={email}
            onChangeText={text => setEmail(text)}
            placeholder="Nhập email"
            placeholderTextColor={COLORS.Black}
            style={{
              color: COLORS.Black,
              fontFamily: FONTFAMILY.nunitosans_regular,
              fontSize: FONTSIZE.size_16,
              padding: 12,
              backgroundColor: COLORS.FaintWhite,
              borderRadius: 6,
              marginVertical: 12,
              marginBottom: 30,
            }}
          />

          <TextInput
            value={password}
            secureTextEntry
            onChangeText={text => setPassword(text)}
            placeholder="Nhập mật khẩu"
            placeholderTextColor={COLORS.Black}
            style={{
              color: COLORS.Black,
              fontFamily: FONTFAMILY.nunitosans_regular,
              fontSize: FONTSIZE.size_16,
              padding: 12,
              backgroundColor: COLORS.FaintWhite,
              borderRadius: 6,
              marginVertical: 6,
            }}
          />
        </View>
        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            padding: 12,
            backgroundColor: COLORS.Blue,
            marginVertical: 18,
            borderRadius: 6,
            shadowColor: COLORS.Blue,
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.3,
            shadowRadius: 6,
          }}>
          <Text
            disabled={isLoading}
            style={{
              fontFamily: FONTFAMILY.nunitosans_bold,
              color: COLORS.White,
              textAlign: 'center',
              fontSize: FONTSIZE.size_20,
            }}>
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          style={{
            padding: 12,
          }}>
          <Text
            style={{
              fontFamily: FONTFAMILY.nunitosans_semibold,
              color: COLORS.Black,
              textAlign: 'center',
              fontSize: FONTSIZE.size_16,
            }}>
            Chưa có tài khoản ?
          </Text>
          <Text
            style={{
              fontFamily: FONTFAMILY.nunitosans_semibold,
              color: COLORS.Black,
              textAlign: 'center',
              fontSize: FONTSIZE.size_16,
            }}>
            Đăng ký ngay
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
