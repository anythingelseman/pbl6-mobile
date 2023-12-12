import React, {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import LinearGradient from 'react-native-linear-gradient';
import AppHeader from '../components/AppHeader';
import CustomIcon from '../components/CustomIcon';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useBookingStore} from '../store/booking-store';
import getFilmById from '../services/getFilm';
import getScheduleById from '../services/getScheduleById';
import {Room} from '../types/Room';
import getRoomById from '../services/getRoomById';
import {TSeat} from '../types/TSeat';
import {Seats} from '../components/Seats';
import {useAuth} from '../context/AuthContext';
import reserveSeats from '../services/reserveSeats';
import createBooking from '../services/createBooking';

const SeatBookingScreen = ({navigation, route}: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useAuth();
  const {
    schedule,
    film,
    step,
    setStep,
    selectedSeats,
    selectSeat,
    selectedPaymentMethod,
  } = useBookingStore();
  const [room, setRoom] = useState<Room>();
  const {setFilm, setSchedule, setInitialState} = useBookingStore();
  useLayoutEffect(() => {
    setInitialState();
  }, []);

  useEffect(() => {
    getFilmById(Number(route.params.filmId)).then(data => {
      setFilm(data);
    });
    getScheduleById(Number(route.params.scheduleId)).then(data => {
      setSchedule(data);
      getRoomById(data.roomId).then(roomData => {
        setRoom(roomData);
      });
    });
  }, []);

  const onSelectSeat = (seat: TSeat) => {
    selectSeat(seat);
  };

  const BookSeats = async () => {
    if (selectedSeats.length <= 0) {
      ToastAndroid.show('Bạn chưa chọn ghế', 2000);
      return;
    }
    try {
      setIsLoading(true);
      const numberSeats = selectedSeats.map(seat => {
        return seat.numberSeat;
      });
      await reserveSeats({
        scheduleId: schedule?.id!,
        customerId: user.userId,
        numberSeats: numberSeats,
      });

      const data = await createBooking({
        customerId: user.userId,
        scheduleId: schedule?.id!,
        numberSeats: numberSeats,
        paymentDestinationId: selectedPaymentMethod,
      });
      navigation.replace('Payment', {paymentUrl: data.messages[0]});
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      ToastAndroid.show(
        'Ghế đã được đặt bởi người khác, vui lòng chọn ghế khác',
        2000,
      );
    }
  };
  if (!room || !schedule || !film) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{flex: 1}}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.appHeaderContainer}>
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
      style={styles.container}
      bounces={false}
      showsVerticalScrollIndicator={false}>
      <StatusBar hidden />
      <View>
        <ImageBackground
          source={{uri: route.params?.BgImage}}
          style={styles.ImageBG}>
          <LinearGradient
            colors={[COLORS.WhiteRGBA15, COLORS.White]}
            style={styles.linearGradient}>
            <View style={styles.appHeaderContainer}>
              <AppHeader
                name="close"
                header={''}
                action={() => navigation.goBack()}
              />
            </View>
          </LinearGradient>
        </ImageBackground>
        <Text style={styles.screenText}>Màn hình</Text>
      </View>

      <View style={styles.seatContainer}>
        <Seats
          seats={schedule?.scheduleSeats!}
          nrows={room.numberRow}
          ncols={room.numberColumn}
          onSelectSeat={onSelectSeat}
          selectedSeats={selectedSeats}
        />

        <Text
          style={{
            marginTop: 20,
            textAlign: 'center',
            color: COLORS.Black,
            fontFamily: FONTFAMILY.nunitosans_medium,
          }}>
          Giá vé: {schedule.price} VND
        </Text>
        <View style={styles.seatRadioContainer}>
          <View style={styles.radioContainer}>
            <CustomIcon
              name="radio"
              style={[styles.radioIcon, {color: COLORS.Black}]}
            />
            <Text style={styles.radioText}>Còn trống</Text>
          </View>
          <View style={styles.radioContainer}>
            <CustomIcon
              name="radio"
              style={[styles.radioIcon, {color: COLORS.FaintWhite}]}
            />
            <Text style={styles.radioText}>Đã bán</Text>
          </View>
          <View style={styles.radioContainer}>
            <CustomIcon
              name="radio"
              style={[styles.radioIcon, {color: COLORS.Blue}]}
            />
            <Text style={styles.radioText}>Đang chọn</Text>
          </View>
        </View>
      </View>

      <View style={{alignItems: 'center'}}>
        <View style={{marginVertical: 8}}>
          <Text style={styles.totalPriceText}>Ghế đã chọn</Text>
          {selectedSeats.length > 0 ? (
            <Text
              style={{
                color: COLORS.Black,
                fontSize: FONTSIZE.size_20,
                fontFamily: FONTFAMILY.nunitosans_medium,
                textAlign: 'center',
              }}>
              {selectedSeats.map(seat => seat.seatCode).join(',')}
            </Text>
          ) : (
            <Text
              style={{
                marginTop: 4,
                color: COLORS.Black,
                fontSize: FONTSIZE.size_14,
                fontFamily: FONTFAMILY.nunitosans_medium,
                textAlign: 'center',
              }}>
              Bạn chưa chọn ghế nào
            </Text>
          )}
        </View>
        <View style={{marginVertical: 8}}>
          <Text style={styles.totalPriceText}>Tổng số tiền</Text>
          <Text style={styles.price}>
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(schedule.price * selectedSeats.length)}
          </Text>
        </View>
      </View>

      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'row',
          marginBottom: 10,
        }}>
        <TouchableOpacity
          onPress={BookSeats}
          style={{maxWidth: '50%'}}
          disabled={isLoading}>
          {!isLoading && <Text style={styles.buttonText}>Mua vé</Text>}
          {isLoading && (
            <View style={{alignSelf: 'center'}}>
              <ActivityIndicator size={'large'} color={COLORS.Blue} />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: COLORS.White,
  },
  ImageBG: {
    width: '100%',
    aspectRatio: 3072 / 1727,
  },
  linearGradient: {
    height: '100%',
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
  screenText: {
    textAlign: 'center',
    fontFamily: FONTFAMILY.nunitosans_regular,
    fontSize: FONTSIZE.size_10,
    color: COLORS.Black,
  },
  seatContainer: {
    marginVertical: SPACING.space_20,
  },
  containerGap20: {
    gap: SPACING.space_20,
  },
  seatRow: {
    flexDirection: 'row',
    gap: SPACING.space_20,
    justifyContent: 'center',
  },
  seatIcon: {
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  seatRadioContainer: {
    flexDirection: 'row',
    marginTop: SPACING.space_28,
    marginBottom: SPACING.space_10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  radioContainer: {
    flexDirection: 'row',
    gap: SPACING.space_10,
    alignItems: 'center',
  },
  radioIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.White,
  },
  radioText: {
    fontFamily: FONTFAMILY.nunitosans_medium,
    fontSize: FONTSIZE.size_12,
    color: COLORS.Black,
  },
  containerGap24: {
    gap: SPACING.space_24,
  },
  dateContainer: {
    width: SPACING.space_10 * 7,
    height: SPACING.space_10 * 10,
    borderRadius: SPACING.space_10 * 10,
    backgroundColor: COLORS.DarkGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  dayText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.White,
  },
  OutterContainer: {
    marginVertical: SPACING.space_24,
  },
  timeContainer: {
    paddingVertical: SPACING.space_10,
    borderWidth: 1,
    borderColor: COLORS.WhiteRGBA50,
    paddingHorizontal: SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_25,
    backgroundColor: COLORS.DarkGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  buttonPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.space_24,
    paddingBottom: SPACING.space_24,
  },
  totalPriceText: {
    fontFamily: FONTFAMILY.nunitosans_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.Black,
    textAlign: 'center',
  },
  price: {
    fontFamily: FONTFAMILY.nunitosans_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.Black,
    textAlign: 'center',
  },
  buttonText: {
    borderRadius: BORDERRADIUS.radius_25,
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_10,
    fontFamily: FONTFAMILY.nunitosans_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.White,
    backgroundColor: COLORS.Blue,
    textAlign: 'center',
  },
});

export default SeatBookingScreen;
