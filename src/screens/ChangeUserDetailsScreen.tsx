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
const ChangeUserDetailsScreen = ({navigation, route}: any) => {
  const [name, setName] = useState(route.params.customer.customerName);
  const [address, setAddress] = useState(route.params.customer.address);
  const [phone, setPhone] = useState(route.params.customer.phoneNumber);
  const [dateString, setDateString] = useState(
    new Date(route.params.customer.dateOfBirth).toLocaleDateString(),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date>(
    new Date(route.params.customer.dateOfBirth),
  );
  const [open, setOpen] = useState(false);
  const {user} = useAuth();

  const handleSubmit = async () => {
    if (phone.length < 8 || phone.length > 10) {
      ToastAndroid.show('Số điện thoại phải từ 8 đến 10 số', 2000);
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

    if (!date) {
      ToastAndroid.show('Ngày sinh không được để trống', 2000);
      return;
    }

    const formData = {
      id: user.userId,
      customerName: name,
      address: address,
      phoneNumber: phone,
      dateOfBirth: date,
    };

    console.log(formData);

    try {
      setIsLoading(true);
      const response = await apiClient.put(
        `/customer`,
        JSON.stringify(formData),
      );
      const result = response.data;
      if (result.succeeded == true) {
        ToastAndroid.show('Thay đổi thành công', 2000);
        navigation.navigate('Home');
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
          header={'Thay đổi thông tin'}
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
            Thay đổi thông tin
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
          <Text
            style={{
              color: COLORS.Black,
              fontFamily: FONTFAMILY.nunitosans_bold,
              fontSize: FONTSIZE.size_16,
              marginTop: 6,
            }}>
            Họ và tên
          </Text>
          <TextInput
            value={name}
            onChangeText={text => setName(text)}
            placeholder="Họ và tên"
            placeholderTextColor={COLORS.BlackRGB10}
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
          <Text
            style={{
              color: COLORS.Black,
              fontFamily: FONTFAMILY.nunitosans_bold,
              fontSize: FONTSIZE.size_16,
              marginTop: 6,
            }}>
            Địa chỉ
          </Text>
          <TextInput
            value={address}
            onChangeText={text => setAddress(text)}
            placeholder="Nhập địa chỉ"
            placeholderTextColor={COLORS.BlackRGB10}
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
          <Text
            style={{
              color: COLORS.Black,
              fontFamily: FONTFAMILY.nunitosans_bold,
              fontSize: FONTSIZE.size_16,
              marginTop: 6,
            }}>
            Số điện thoại
          </Text>
          <TextInput
            value={phone}
            onChangeText={text => setPhone(text)}
            placeholder="Nhập số điện thoại"
            placeholderTextColor={COLORS.BlackRGB10}
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
          <Text
            style={{
              color: COLORS.Black,
              fontFamily: FONTFAMILY.nunitosans_bold,
              fontSize: FONTSIZE.size_16,
              marginTop: 6,
            }}>
            Ngày sinh
          </Text>
          <DatePicker
            maximumDate={new Date()}
            modal
            open={open}
            date={date}
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
              placeholderTextColor={COLORS.BlackRGB10}
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
            {isLoading ? 'Đang thay đổi...' : 'Xác nhận'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ChangeUserDetailsScreen;
