import {
  ActivityIndicator,
  Button,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import AppHeader from '../components/AppHeader';
import {useEffect, useState} from 'react';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useAuth} from './../context/AuthContext';
import DatePicker from 'react-native-date-picker';
import apiClient from '../services/apiClient';
import {getCustomerById} from '../services/getCustomerById';
import CustomIcon from '../components/CustomIcon';
const UserDetailsScreen = ({navigation}: any) => {
  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useAuth();
  useEffect(() => {
    setIsLoading(true);

    getCustomerById(user.userId)
      .then(data => {
        setCustomer(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (!customer) {
    return (
      <ScrollView
        style={{
          display: 'flex',
          flex: 1,
          backgroundColor: COLORS.FaintWhite,
        }}
        contentContainerStyle={{flex: 1}}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            marginHorizontal: SPACING.space_36,
            marginTop: SPACING.space_20 * 2,
          }}>
          <AppHeader
            name="close"
            header={''}
            action={() => navigation.goBack()}
          />
        </View>
        <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={'large'} color={COLORS.Blue} />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={{
        display: 'flex',
        flex: 1,
        backgroundColor: COLORS.FaintWhite,
      }}>
      <View
        style={{
          marginHorizontal: 36,
          marginTop: 20,
        }}>
        <AppHeader
          name="close"
          header={''}
          action={() => navigation.goBack()}
        />
      </View>
      <View
        style={{
          justifyContent: 'center',
        }}>
        <View
          style={{
            backgroundColor: COLORS.White,
            marginHorizontal: 30,
            marginTop: 40,
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
              marginBottom: 12,
            }}>
            Thông tin tài khoản
          </Text>
          <CustomIcon
            name="user"
            style={{
              color: COLORS.Blue,
              textAlign: 'center',
              fontSize: 80,
              fontFamily: FONTFAMILY.nunitosans_bold,
              marginBottom: 12,
            }}
          />

          <View style={{marginTop: 6}}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 8,
                marginBottom: 8,
              }}>
              <Text
                style={{
                  color: COLORS.Black,
                  fontSize: FONTSIZE.size_14,
                  fontFamily: FONTFAMILY.nunitosans_semibold,
                }}>
                Họ và tên:
              </Text>
              <Text
                style={{
                  color: COLORS.Black,
                  fontSize: FONTSIZE.size_14,
                  fontFamily: FONTFAMILY.nunitosans_semibold,
                }}>
                {customer.customerName}
              </Text>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 8,
                marginBottom: 8,
              }}>
              <Text
                style={{
                  color: COLORS.Black,
                  fontSize: FONTSIZE.size_14,
                  fontFamily: FONTFAMILY.nunitosans_semibold,
                }}>
                Số điện thoại:
              </Text>
              <Text
                style={{
                  color: COLORS.Black,
                  fontSize: FONTSIZE.size_14,
                  fontFamily: FONTFAMILY.nunitosans_semibold,
                }}>
                {customer.phoneNumber}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 8,
                marginBottom: 8,
              }}>
              <Text
                style={{
                  color: COLORS.Black,
                  fontSize: FONTSIZE.size_14,
                  fontFamily: FONTFAMILY.nunitosans_semibold,
                }}>
                Địa chỉ
              </Text>
              <Text
                style={{
                  color: COLORS.Black,
                  fontSize: FONTSIZE.size_14,
                  fontFamily: FONTFAMILY.nunitosans_semibold,
                }}>
                {customer.address}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 8,
                marginBottom: 8,
              }}>
              <Text
                style={{
                  color: COLORS.Black,
                  fontSize: FONTSIZE.size_14,
                  fontFamily: FONTFAMILY.nunitosans_semibold,
                }}>
                Ngày sinh
              </Text>
              <Text
                style={{
                  color: COLORS.Black,
                  fontSize: FONTSIZE.size_14,
                  fontFamily: FONTFAMILY.nunitosans_semibold,
                }}>
                {customer.dateOfBirth.split('T')[0]}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ChangeUserDetails', {customer: customer});
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
              Thay đổi thông tin
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default UserDetailsScreen;
