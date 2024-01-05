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

const BookingDetailsScreen = ({navigation, route}: any) => {
  const [booking, setBooking] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const paymentId = route.params.PaymentId;

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
        <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={'large'} color={COLORS.Blue} />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      style={{
        display: 'flex',
        flex: 1,
        backgroundColor: COLORS.FaintWhite,
      }}>
      <View style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
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
            Chi tiết vé đặt
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
                  maxWidth: '60%',
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
                style={{
                  color: COLORS.Black,
                  fontSize: FONTSIZE.size_14,
                  fontFamily: FONTFAMILY.nunitosans_semibold,
                  maxWidth: '60%',
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
              navigation.navigate('BookingHistory');
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
              Quay lại
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default BookingDetailsScreen;
