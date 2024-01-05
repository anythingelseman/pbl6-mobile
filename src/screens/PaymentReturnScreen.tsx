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

const PaymentReturnScreen = ({navigation, route}: any) => {
  const [booking, setBooking] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const queryString = route.params.paymentReturnUrl.split('?')[1];
    const params: Record<string, string> = {};
    if (queryString) {
      queryString
        .split('&')
        .forEach((pair: {split: (arg0: string) => [any, any]}) => {
          const [key, value] = pair.split('=');
          params[key] = value;
        });
    }
    const paymentId = params.PaymentId;

    getBookingById(paymentId)
      .then(data => {
        setBooking(data);
      })
      .finally(() => setIsLoading(false));
  }, [route.params.paymentReturnUrl]);

  const seats = useMemo(() => {
    if (!booking || !booking.tickets) return '';

    return booking.tickets.map((t: any) => t.seatCode).join(',');
  }, [booking]);

  const transformDate = (dateObject: Date) => {
    return dateObject.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
      <View style={{marginTop: 10}}>
        <AppHeader
          name="close"
          header={''}
          action={() => navigation.goBack()}
        />
      </View>
      <View
        style={{
          backgroundColor: COLORS.White,
          marginHorizontal: 30,
          marginVertical: 20,
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
          Đặt vé thành công
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
          Cảm ơn quý khách vì đã lựa chọn chúng tôi
        </Text>
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
              Phim
            </Text>
            <Text
              style={{
                color: COLORS.Black,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.nunitosans_semibold,
              }}>
              {booking.filmName}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>
            <Text
              style={{
                color: COLORS.Black,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.nunitosans_semibold,
              }}>
              Giờ chiếu
            </Text>
            <Text
              style={{
                color: COLORS.Black,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.nunitosans_semibold,
              }}>
              {transformDate(new Date(booking.startTime))}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>
            <Text
              style={{
                color: COLORS.Black,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.nunitosans_semibold,
              }}>
              Rạp phim
            </Text>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{
                color: COLORS.Black,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.nunitosans_semibold,
              }}>
              {booking.cinemaName}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>
            <Text
              style={{
                color: COLORS.Black,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.nunitosans_semibold,
              }}>
              Phòng chiếu
            </Text>
            <Text
              style={{
                color: COLORS.Black,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.nunitosans_semibold,
              }}>
              {booking.roomName}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>
            <Text
              style={{
                color: COLORS.Black,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.nunitosans_semibold,
              }}>
              Ghế đã chọn
            </Text>
            <Text
              style={{
                color: COLORS.Black,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.nunitosans_semibold,
              }}>
              {seats}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>
            <Text
              style={{
                color: COLORS.Black,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.nunitosans_semibold,
              }}>
              Thời gian đặt
            </Text>
            <Text
              style={{
                color: COLORS.Black,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.nunitosans_semibold,
              }}>
              {transformDate(new Date(booking.bookingDate))}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>
            <Text
              style={{
                color: COLORS.Black,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.nunitosans_semibold,
              }}>
              Số tiền thanh toán
            </Text>
            <Text
              style={{
                color: COLORS.Black,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.nunitosans_semibold,
              }}>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(booking.totalPrice)}
            </Text>
          </View>
        </View>
        <View style={{alignItems: 'center', marginTop: 12}}>
          <QRCode
            logo={{uri: `data:image/jpeg;base64,${booking.qrCode}`}}
            logoSize={30}
            logoBackgroundColor="transparent"
          />
        </View>
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

export default PaymentReturnScreen;
