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
      ToastAndroid.show('Please select at least a seat', 2000);
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
        'The selected seats are already reserved. Please choose different seats.',
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
          <ActivityIndicator size={'large'} color={COLORS.Orange} />
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
            colors={[COLORS.BlackRGB10, COLORS.Black]}
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
        <Text style={styles.screenText}>Screen this side</Text>
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
            color: COLORS.White,
            fontFamily: FONTFAMILY.poppins_medium,
          }}>
          Ticket price: {schedule.price} VND
        </Text>
        <View style={styles.seatRadioContainer}>
          <View style={styles.radioContainer}>
            <CustomIcon name="radio" style={styles.radioIcon} />
            <Text style={styles.radioText}>Available</Text>
          </View>
          <View style={styles.radioContainer}>
            <CustomIcon
              name="radio"
              style={[styles.radioIcon, {color: COLORS.Grey}]}
            />
            <Text style={styles.radioText}>Taken</Text>
          </View>
          <View style={styles.radioContainer}>
            <CustomIcon
              name="radio"
              style={[styles.radioIcon, {color: COLORS.Orange}]}
            />
            <Text style={styles.radioText}>Selected</Text>
          </View>
        </View>
      </View>

      <View style={{alignItems: 'center'}}>
        <View style={{marginVertical: 8}}>
          <Text style={styles.totalPriceText}>Selected Seats</Text>
          {selectedSeats.length > 0 ? (
            <Text
              style={{
                color: COLORS.White,
                fontSize: FONTSIZE.size_20,
                fontFamily: FONTFAMILY.poppins_medium,
                textAlign: 'center',
              }}>
              {selectedSeats.map(seat => seat.seatCode).join(',')}
            </Text>
          ) : (
            <Text>You havent chose any seats</Text>
          )}
        </View>
        <View style={{marginVertical: 8}}>
          <Text style={styles.totalPriceText}>Total Price</Text>
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
          {!isLoading && <Text style={styles.buttonText}>Buy Tickets</Text>}
          {isLoading && (
            <View style={{alignSelf: 'center'}}>
              <ActivityIndicator size={'large'} color={COLORS.Orange} />
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
    backgroundColor: COLORS.Black,
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
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_10,
    color: COLORS.White,
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
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_12,
    color: COLORS.White,
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
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.White,
    textAlign: 'center',
  },
  price: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
    textAlign: 'center',
  },
  buttonText: {
    borderRadius: BORDERRADIUS.radius_25,
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_10,
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.White,
    backgroundColor: COLORS.Orange,
    textAlign: 'center',
  },
});

export default SeatBookingScreen;
