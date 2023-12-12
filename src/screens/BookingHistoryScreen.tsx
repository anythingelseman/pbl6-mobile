import {
  ActivityIndicator,
  Button,
  Dimensions,
  Image,
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
import {getBookingByCustomer} from '../services/getBookingByCustomer';
import getFilm from '../services/getFilms';
const BookingHistoryScreen = ({navigation}: any) => {
  const [booking, setBooking] = useState<any>(null);
  const [film, setFilm] = useState<any>(null);
  const {user} = useAuth();

  const getImageByFilmName = (filmName: string) => {
    return film?.find((item: any) => item.name === filmName)?.image;
  };

  useEffect(() => {
    getFilm().then(data => {
      setFilm(data);
    });

    getBookingByCustomer(user.userId).then(data => {
      setBooking(data);
    });
  }, []);

  if (!booking) {
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
            header={'Lịch sử đặt vé'}
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
          header={'Lịch sử đặt vé'}
          action={() => navigation.goBack()}
        />
      </View>
      <View>
        <Text
          style={{
            color: COLORS.Blue,
            textAlign: 'center',
            fontSize: 26,
            fontFamily: FONTFAMILY.nunitosans_bold,
            marginBottom: 12,
            marginTop: 18,
          }}>
          Lịch sử đặt vé
        </Text>
        <View>
          {booking.map((item: any) => {
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  navigation.navigate('BookingDetails', {
                    PaymentId: item.bookingRefId,
                  });
                }}>
                <View
                  style={{
                    backgroundColor: COLORS.White,
                    marginHorizontal: 20,
                    marginBottom: 12,
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'row',
                    borderRadius: 6,
                    gap: 12,
                  }}>
                  <Image
                    style={{
                      width: '20%',
                      aspectRatio: 200 / 300,
                      borderRadius: 6,
                    }}
                    source={{uri: getImageByFilmName(item.filmName)}}
                  />
                  <View
                    style={{
                      display: 'flex',
                      alignContent: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: COLORS.Black,
                        fontFamily: FONTFAMILY.nunitosans_bold,
                        fontSize: 16,
                      }}>
                      {item.filmName}
                    </Text>
                    <Text style={{color: COLORS.Black}}>
                      {new Date(item.bookingDate).toLocaleString()}
                    </Text>
                    <Text style={{color: COLORS.Black}}>{item.cinemaName}</Text>
                    <Text style={{color: COLORS.Black}}>
                      {item.totalPrice} VND
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default BookingHistoryScreen;
