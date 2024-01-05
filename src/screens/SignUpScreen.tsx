import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, FONTFAMILY, FONTSIZE} from '../theme/theme';
import AppHeader from '../components/AppHeader';
import {useState} from 'react';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useAuth} from './../context/AuthContext';
import DatePicker from 'react-native-date-picker';
import apiClient from '../services/apiClient';
import {err} from 'react-native-svg';
const LoginScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dateString, setDateString] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const handleSubmit = () => {
  //   navigation.navigate('ConfirmEmail');
  // };

  const handleSubmit = async () => {
    if (phone.length < 8 || phone.length > 10) {
      ToastAndroid.show('Số điện thoại phải từ 8 đến 10 số', 2000);
      return;
    }
    if (!username) {
      ToastAndroid.show('Tên đăng nhập không được để trống', 2000);
      return;
    }

    if (!email) {
      ToastAndroid.show('Email không được để trống', 2000);
      return;
    }

    if (!password) {
      ToastAndroid.show('Mật khẩu không được để trống', 2000);
      return;
    }

    if (!name) {
      ToastAndroid.show('Tên không được để trống', 2000);
      return;
    }

    if (!address) {
      ToastAndroid.show('Địa chỉ không được để trống', 2000);
      return;
    }

    if (!phone) {
      ToastAndroid.show('Số điện thoại không được để trông', 2000);
      return;
    }

    if (!confirmPassword) {
      ToastAndroid.show('Xin hãy xác nhận lại mật khẩu', 2000);
      return;
    }

    if (password !== confirmPassword) {
      ToastAndroid.show('Mật khẩu xác nhận không trùng khớp', 2000);
      return;
    }

    if (!date) {
      ToastAndroid.show('Ngày sinh không được để trống', 2000);
      return;
    }

    const formData = {
      username: username,
      email: email,
      password: password,
      customerName: name,
      address: address,
      phoneNumber: phone,
      dateOfBirth: date,
    };

    console.log(formData);

    try {
      setIsLoading(true);
      const response = await apiClient.post(
        `/customer`,
        JSON.stringify(formData),
      );
      const result = response.data;
      if (result.succeeded == true) {
        ToastAndroid.show('Đăng ký thành công', 2000);
        navigation.navigate('ConfirmEmail');
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      console.log(error);
      ToastAndroid.show(error.response.data.messages[0], 2000);
    }
  };

  return (
    <ScrollView
      style={{display: 'flex', flex: 1, backgroundColor: COLORS.White}}>
      <View
        style={{
          marginHorizontal: 36,
          marginTop: 40,
        }}>
        <AppHeader
          name="close"
          header={'Đăng ký'}
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
              marginTop: 18,
            }}>
            Đăng ký ngay
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: FONTSIZE.size_30,
              color: COLORS.Blue,
              fontFamily: FONTFAMILY.nunitosans_bold,
              marginBottom: 18,
            }}>
            Nhận ưu đãi
          </Text>
          {/* <Text
            style={{
              fontFamily: FONTFAMILY.nunitosans_bold,
              fontSize: FONTSIZE.size_20,
              maxWidth: '80%',
              textAlign: 'center',
              color: COLORS.Black,
            }}>
            Tạo ngay tài khoản
          </Text> */}
        </View>
        <View
          style={{
            marginVertical: 10,
          }}>
          <TextInput
            value={name}
            onChangeText={text => setName(text)}
            placeholder="Họ và tên"
            placeholderTextColor={COLORS.Black}
            style={{
              color: COLORS.Black,
              fontFamily: FONTFAMILY.nunitosans_regular,
              fontSize: FONTSIZE.size_16,
              padding: 12,
              backgroundColor: COLORS.FaintWhite,
              borderRadius: 6,
              marginVertical: 12,
            }}
          />

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
            }}
          />

          <TextInput
            value={username}
            onChangeText={text => setUsername(text)}
            placeholder="Nhập tên đăng nhập"
            placeholderTextColor={COLORS.Black}
            style={{
              color: COLORS.Black,
              fontFamily: FONTFAMILY.nunitosans_regular,
              fontSize: FONTSIZE.size_16,
              padding: 12,
              backgroundColor: COLORS.FaintWhite,
              borderRadius: 6,
              marginVertical: 12,
            }}
          />

          <TextInput
            value={address}
            onChangeText={text => setAddress(text)}
            placeholder="Nhập địa chỉ"
            placeholderTextColor={COLORS.Black}
            style={{
              color: COLORS.Black,
              fontFamily: FONTFAMILY.nunitosans_regular,
              fontSize: FONTSIZE.size_16,
              padding: 12,
              backgroundColor: COLORS.FaintWhite,
              borderRadius: 6,
              marginVertical: 12,
            }}
          />

          <TextInput
            value={phone}
            onChangeText={text => setPhone(text)}
            placeholder="Nhập số điện thoại"
            placeholderTextColor={COLORS.Black}
            style={{
              color: COLORS.Black,
              fontFamily: FONTFAMILY.nunitosans_regular,
              fontSize: FONTSIZE.size_16,
              padding: 12,
              backgroundColor: COLORS.FaintWhite,
              borderRadius: 6,
              marginVertical: 12,
            }}
          />
          <DatePicker
            maximumDate={new Date()}
            modal
            open={open}
            date={new Date()}
            onConfirm={date => {
              setOpen(false);
              setDate(date);
              setDateString(date.toLocaleDateString());
              console.log(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
            title="Ngày sinh"
            mode="date"
            confirmText="Xác nhận"
            cancelText="Hủy"
          />
          <TouchableOpacity onPress={() => setOpen(true)}>
            <TextInput
              editable={false}
              value={dateString ? dateString : 'Ngày sinh'}
              placeholder="Ngày sinh"
              placeholderTextColor={COLORS.Black}
              style={{
                color: COLORS.Black,
                fontFamily: FONTFAMILY.nunitosans_regular,
                fontSize: FONTSIZE.size_16,
                padding: 12,
                backgroundColor: COLORS.FaintWhite,
                borderRadius: 6,
                marginVertical: 12,
              }}
            />
          </TouchableOpacity>

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
              marginVertical: 12,
            }}
          />

          <TextInput
            value={confirmPassword}
            secureTextEntry
            onChangeText={text => setConfirmPassword(text)}
            placeholder="Xác nhận mật khẩu"
            placeholderTextColor={COLORS.Black}
            style={{
              color: COLORS.Black,
              fontFamily: FONTFAMILY.nunitosans_regular,
              fontSize: FONTSIZE.size_16,
              padding: 12,
              backgroundColor: COLORS.FaintWhite,
              borderRadius: 6,
              marginVertical: 12,
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
            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
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
            Đã có tài khoản ?
          </Text>
          <Text
            style={{
              fontFamily: FONTFAMILY.nunitosans_semibold,
              color: COLORS.Black,
              textAlign: 'center',
              fontSize: FONTSIZE.size_16,
            }}>
            Đăng nhập ngay
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
