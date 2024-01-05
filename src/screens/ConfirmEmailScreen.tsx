import {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppHeader from '../components/AppHeader';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import {getBookingById} from '../services/getBookingById';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomIcon from '../components/CustomIcon';
import QRCode from 'react-native-qrcode-svg';

const ConfirmEmailScreen = ({navigation}: any) => {
  return (
    <ScrollView
      style={{
        display: 'flex',
        flex: 1,
        backgroundColor: COLORS.FaintWhite,
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.White,
          marginHorizontal: 30,
          marginVertical: 145,
          borderRadius: 6,
          paddingHorizontal: 12,
          paddingVertical: 20,
        }}>
        <Text
          style={{
            color: COLORS.Blue,
            textAlign: 'center',
            fontSize: 26,
            fontFamily: FONTFAMILY.nunitosans_bold,
          }}>
          Đăng ký thành công
        </Text>
        <CustomIcon
          name="ticket"
          style={{
            color: COLORS.Blue,
            textAlign: 'center',
            fontSize: 80,
            fontFamily: FONTFAMILY.nunitosans_bold,
          }}
        />
        <Text
          style={{
            color: COLORS.Blue,
            textAlign: 'center',
            fontSize: 20,
            fontFamily: FONTFAMILY.nunitosans_bold,
          }}>
          Kiểm tra email của bạn
        </Text>

        <Text
          style={{
            marginTop: 10,
            color: COLORS.Blue,
            textAlign: 'center',
            fontSize: 16,
            fontFamily: FONTFAMILY.nunitosans_regular,
          }}>
          Vui lòng kiểm tra email và nhấn nút xác nhận được gửi trong email để
          xác thực email của bạn
        </Text>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Home');
          }}
          style={{
            padding: 6,
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
            style={{
              fontFamily: FONTFAMILY.nunitosans_bold,
              color: COLORS.White,
              textAlign: 'center',
              fontSize: FONTSIZE.size_16,
            }}>
            Trở về trang chủ
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ConfirmEmailScreen;
