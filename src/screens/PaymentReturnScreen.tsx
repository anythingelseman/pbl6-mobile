import {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  View,
} from 'react-native';
import AppHeader from '../components/AppHeader';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import {getBookingById} from '../services/getBookingById';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomIcon from '../components/CustomIcon';

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
          backgroundColor: COLORS.Black,
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
          <ActivityIndicator size={'large'} color={COLORS.Orange} />
        </View>
      </ScrollView>
    );
  }

  return (
    <View
      style={{
        display: 'flex',
        flex: 1,
        backgroundColor: COLORS.Black,
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
          backgroundColor: COLORS.Grey,
          marginHorizontal: 30,
          marginVertical: 20,
          borderRadius: 6,
          paddingHorizontal: 12,
          paddingVertical: 20,
        }}>
        <Text
          style={{
            color: COLORS.Orange,
            textAlign: 'center',
            fontSize: 26,
            fontFamily: FONTFAMILY.poppins_bold,
          }}>
          Booking succesfully
        </Text>
        <CustomIcon
          name="ticket"
          style={{
            color: COLORS.Orange,
            textAlign: 'center',
            fontSize: 80,
            fontFamily: FONTFAMILY.poppins_bold,
          }}
        />
        <Text
          style={{
            color: COLORS.Orange,
            textAlign: 'center',
            fontSize: 20,
            fontFamily: FONTFAMILY.poppins_bold,
          }}>
          Thank you for choosing our cinema
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
                color: COLORS.White,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.poppins_semibold,
              }}>
              Film
            </Text>
            <Text
              style={{
                color: COLORS.White,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.poppins_semibold,
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
                color: COLORS.White,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.poppins_semibold,
              }}>
              Premiere time
            </Text>
            <Text
              style={{
                color: COLORS.White,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.poppins_semibold,
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
                color: COLORS.White,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.poppins_semibold,
              }}>
              Cinema
            </Text>
            <Text
              style={{
                color: COLORS.White,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.poppins_semibold,
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
                color: COLORS.White,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.poppins_semibold,
              }}>
              Room
            </Text>
            <Text
              style={{
                color: COLORS.White,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.poppins_semibold,
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
                color: COLORS.White,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.poppins_semibold,
              }}>
              Seats
            </Text>
            <Text
              style={{
                color: COLORS.White,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.poppins_semibold,
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
                color: COLORS.White,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.poppins_semibold,
              }}>
              Booking time
            </Text>
            <Text
              style={{
                color: COLORS.White,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.poppins_semibold,
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
                color: COLORS.White,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.poppins_semibold,
              }}>
              Total amount paid
            </Text>
            <Text
              style={{
                color: COLORS.White,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.poppins_semibold,
              }}>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(booking.totalPrice)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PaymentReturnScreen;
