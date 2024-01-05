import React, {useEffect, useMemo, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  ImageBackground,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  ToastAndroid,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import AppHeader from '../components/AppHeader';
import LinearGradient from 'react-native-linear-gradient';
import CustomIcon from '../components/CustomIcon';
import CategoryHeader from '../components/CategoryHeader';
import CastCard from '../components/CastCard';
import apiClient from '../services/apiClient';
import {useAuth} from '../context/AuthContext';
import addRating from '../services/addRating';

const MovieDetailsScreen = ({navigation, route}: any) => {
  const [movieData, setMovieData] = useState<any>(undefined);
  const [cinemaData, setCinemaData] = useState<any>(undefined);
  const [scheduleData, setScheduleData] = useState<any>(undefined);
  const [selectedCinema, setSelectedCinema] = useState<any>(undefined);
  const [selectedDate, setSelectedDate] = useState<any>();
  const [selectedDateIndex, setSelectedDateIndex] = useState<any>();
  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const {user} = useAuth();

  useEffect(() => {
    (async () => {
      const response = await apiClient.get(`/film/${route.params.filmId}`);
      setMovieData(response.data.data);
    })();
    (async () => {
      const response = await apiClient.get(
        `/schedule/film/${route.params.filmId}`,
      );
      setScheduleData(response.data.data);
    })();
    (async () => {
      const response = await apiClient.get(`/cinema`);
      setCinemaData(response.data.data);
      setSelectedCinema(response.data.data[0].id);
    })();
  }, []);

  function convertToHoursAndMinutes(minutes: number) {
    // Calculate hours and remaining minutes
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    // Construct the result string
    const result = `${hours}h${remainingMinutes}m`;

    return result;
  }

  const stars = Array(10).fill(0);

  const generateDate = () => {
    const date = new Date();
    let weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let weekdays = [];
    for (let i = 0; i < 7; i++) {
      let tempDate = {
        date: new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDate(),
        day: weekday[
          new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDay()
        ],
        dateValue: new Date(date.getTime() + i * 24 * 60 * 60 * 1000),
      };
      weekdays.push(tempDate);
    }
    return weekdays;
  };

  const getArrayForCinemaId = (cinemaId: string | number) => {
    for (const city in scheduleData) {
      const cinemaData = scheduleData[city][cinemaId];
      if (cinemaData) {
        return cinemaData;
      }
    }
    return [];
  };

  function formatTimeFromDate(dateString: string | number | Date) {
    const dateObject = new Date(dateString);

    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();

    const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

    return formattedTime;
  }

  const availableSchedules = useMemo(() => {
    if (!scheduleData || !selectedDate) return [];
    const selectedDateObject = new Date(selectedDate);
    const schedules = getArrayForCinemaId(selectedCinema).filter(
      (item: {startTime: string | number | Date}) => {
        // Parse startTime as Date object
        const startTimeDate = new Date(item.startTime);
        // Check if startTime is on the same day as currentDate
        const isSameDay =
          startTimeDate.getDate() === selectedDateObject.getDate() &&
          startTimeDate.getMonth() === selectedDateObject.getMonth() &&
          startTimeDate.getFullYear() === selectedDateObject.getFullYear();
        // Check if startTime is later than the current time
        const isLaterThanNow = startTimeDate > new Date();
        // Return true if both conditions are met
        return isSameDay && isLaterThanNow;
      },
    );
    return schedules;
  }, [selectedCinema, selectedDate, scheduleData]);

  const [dateArray, setDateArray] = useState<any[]>(generateDate());

  if (
    movieData == undefined ||
    movieData == null ||
    cinemaData == undefined ||
    cinemaData == null ||
    scheduleData == undefined ||
    scheduleData == null
  ) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.appHeaderContainer}>
          <AppHeader
            name="close"
            header={''}
            action={() => navigation.goBack()}
          />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} color={COLORS.Blue} />
        </View>
      </ScrollView>
    );
  }
  const ratingHandler = async () => {
    await addRating({filmId: movieData.id, score: rating});
    const response = await apiClient.get(`/film/${route.params.filmId}`);
    setMovieData(response.data.data);
    setModalOpen(false);
  };

  return (
    <ScrollView
      style={styles.container}
      bounces={false}
      showsVerticalScrollIndicator={false}>
      <StatusBar hidden />

      <Modal visible={modalOpen} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              height: '50%',
              backgroundColor: 'white',
              marginHorizontal: SPACING.space_24,
              borderRadius: 6,
            }}>
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 10,
              }}>
              <Image
                source={{uri: movieData?.image[0]}}
                style={{width: '30%', aspectRatio: 200 / 300}}
              />
            </View>
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontFamily: FONTFAMILY.nunitosans_semibold,
                  color: COLORS.Black,
                  fontSize: 20,
                }}>
                Chấm điểm
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontFamily: FONTFAMILY.nunitosans_semibold,
                  color: COLORS.Black,
                  fontSize: 16,
                }}>
                {movieData?.name}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontFamily: FONTFAMILY.nunitosans_semibold,
                  color: COLORS.Black,
                  fontSize: 16,
                }}>
                {rating}
              </Text>

              <View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 4,
                    marginTop: 10,
                  }}>
                  {stars.map((_, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setRating(index + 1)}>
                        <CustomIcon
                          name="star"
                          size={25}
                          color={index < rating ? COLORS.Yellow : 'grey'}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
                marginTop: 10,
              }}>
              <TouchableOpacity
                onPress={() => setModalOpen(false)}
                style={{
                  width: '50%',
                  backgroundColor: COLORS.FaintWhite,
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: COLORS.Black,
                    textAlign: 'center',
                    alignSelf: 'center',
                    fontSize: 16,
                    fontFamily: FONTFAMILY.nunitosans_semibold,
                  }}>
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={ratingHandler}
                style={{
                  width: '50%',
                  backgroundColor: COLORS.Blue,
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: COLORS.White,
                    textAlign: 'center',
                    fontSize: 16,
                    fontFamily: FONTFAMILY.nunitosans_semibold,
                  }}>
                  Xác nhận
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View>
        <ImageBackground
          source={{
            uri: movieData?.image[1],
          }}
          style={styles.imageBG}>
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
        <View style={styles.imageBG}></View>
        <Image source={{uri: movieData?.image[0]}} style={styles.cardImage} />
      </View>

      <View style={styles.timeContainer}>
        <CustomIcon name="clock" style={styles.clockIcon} />
        <Text style={styles.runtimeText}>
          {convertToHoursAndMinutes(movieData.duration)}
        </Text>
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: SPACING.space_10,
        }}>
        <CustomIcon name="star" style={styles.starIcon} />
        <Text
          style={{
            color: COLORS.Black,
            fontSize: FONTSIZE.size_18,
            fontFamily: FONTFAMILY.nunitosans_semibold,
            marginLeft: SPACING.space_8,
          }}>
          {movieData.score
            ? `${movieData.score} (${movieData.numberOfVotes})`
            : 'Chưa có đánh giá'}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          if (user) setModalOpen(true);
          else {
            ToastAndroid.show('Bạn phải đăng nhập để chấm điểm', 2000);
          }
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: SPACING.space_8,
          }}>
          <Text
            style={{
              color: COLORS.Black,
              fontSize: FONTSIZE.size_14,
              fontFamily: FONTFAMILY.nunitosans_semibold,
            }}>
            Chấm điểm
          </Text>
        </View>
      </TouchableOpacity>

      <View>
        <Text style={styles.title}>{movieData?.name}</Text>
        <View style={styles.genreContainer}>
          {movieData?.category.split(', ').map((name: any) => {
            return (
              <View style={styles.genreBox} key={name}>
                <Text style={styles.genreText}>{name}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.descriptionText}>{movieData?.description}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Diễn viên</Text>
          <Text
            style={{
              color: COLORS.Black,
              fontFamily: FONTFAMILY.nunitosans_regular,
            }}>
            {movieData.actor}
          </Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Đạo diễn</Text>
          <Text
            style={{
              color: COLORS.Black,
              fontFamily: FONTFAMILY.nunitosans_regular,
            }}>
            {movieData.director}
          </Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Nước</Text>
          <Text
            style={{
              color: COLORS.Black,
              fontFamily: FONTFAMILY.nunitosans_regular,
            }}>
            {movieData.country}
          </Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.inputTitle}>Chọn rạp</Text>
        <View
          style={{
            backgroundColor: COLORS.FaintWhite,
            borderRadius: BORDERRADIUS.radius_25,
            marginBottom: SPACING.space_20,
          }}>
          <Picker
            style={{
              color: COLORS.Black,
            }}
            selectedValue={selectedCinema}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedCinema(itemValue)
            }>
            {cinemaData.map(
              (cinema: {
                [x: string]: any;
                name: string | undefined;
                id: React.Key | null | undefined;
              }) => {
                return (
                  <Picker.Item
                    label={`${cinema.name} - ${cinema.city}`}
                    value={cinema.id}
                    key={cinema.id}
                  />
                );
              },
            )}
          </Picker>
        </View>
      </View>

      <View>
        <FlatList
          data={dateArray}
          keyExtractor={item => item.date}
          horizontal
          bounces={false}
          contentContainerStyle={styles.containerGap24}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedDateIndex(index);
                  setSelectedDate(item.dateValue);
                }}>
                <View
                  style={[
                    styles.dateContainer,
                    index == 0
                      ? {marginLeft: SPACING.space_24}
                      : index == dateArray.length - 1
                      ? {marginRight: SPACING.space_24}
                      : {},
                    index == selectedDateIndex
                      ? {backgroundColor: COLORS.Blue}
                      : {},
                  ]}>
                  <Text style={styles.dateText}>{item.date}</Text>
                  <Text style={styles.dayText}>{item.day}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {availableSchedules && (
        <View style={styles.OutterContainer}>
          <FlatList
            data={availableSchedules}
            keyExtractor={item => item.id}
            horizontal
            bounces={false}
            contentContainerStyle={styles.containerGap24}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (!user) navigation.push('Login');
                    else
                      navigation.push('SeatBooking', {
                        BgImage: movieData.image[1],
                        PosterImage: movieData.image[0],
                        filmId: route.params.filmId,
                        scheduleId: item.id,
                      });
                  }}>
                  <View
                    style={[
                      styles.timeDiv,
                      index == 0
                        ? {marginLeft: SPACING.space_24}
                        : index == dateArray.length - 1
                        ? {marginRight: SPACING.space_24}
                        : {},
                      index == 69 ? {backgroundColor: COLORS.Blue} : {},
                    ]}>
                    <Text style={styles.timeText}>
                      {formatTimeFromDate(item.startTime)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: COLORS.White,
  },
  loadingContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },

  scrollViewContainer: {
    flex: 1,
  },
  infoTitle: {
    color: COLORS.Black,
    fontSize: FONTSIZE.size_16,
    marginBottom: SPACING.space_2,
    fontFamily: FONTFAMILY.nunitosans_regular,
  },
  inputTitle: {
    marginTop: SPACING.space_4,
    textAlign: 'center',
    color: COLORS.Black,
    fontSize: FONTSIZE.size_20,
    marginBottom: SPACING.space_10,
    fontFamily: FONTFAMILY.nunitosans_regular,
  },

  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
  imageBG: {
    width: '100%',
    aspectRatio: 3072 / 1727,
  },
  linearGradient: {
    height: '100%',
  },
  cardImage: {
    width: '60%',
    aspectRatio: 200 / 300,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  clockIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.Black,
    marginRight: SPACING.space_8,
  },
  timeContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING.space_15,
  },
  infoBox: {
    marginBottom: SPACING.space_8,
  },
  runtimeText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.Black,
  },
  title: {
    fontFamily: FONTFAMILY.nunitosans_semibold,
    fontSize: FONTSIZE.size_24,
    color: COLORS.Black,
    marginHorizontal: SPACING.space_36,
    marginVertical: SPACING.space_15,
    textAlign: 'center',
  },
  genreContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: SPACING.space_20,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: SPACING.space_12,
  },
  genreBox: {
    borderColor: COLORS.Black,
    borderWidth: 1,
    paddingHorizontal: SPACING.space_10,
    paddingVertical: SPACING.space_4,
    borderRadius: BORDERRADIUS.radius_25,
  },
  genreText: {
    fontFamily: FONTFAMILY.nunitosans_regular,
    fontSize: FONTSIZE.size_10,
    color: COLORS.Black,
  },
  tagline: {
    fontFamily: FONTFAMILY.nunitosans_regular,
    fontSize: FONTSIZE.size_14,
    fontStyle: 'italic',
    color: COLORS.Black,
    marginHorizontal: SPACING.space_36,
    marginVertical: SPACING.space_15,
    textAlign: 'center',
  },
  infoContainer: {
    marginHorizontal: SPACING.space_24,
  },
  rateContainer: {
    flexDirection: 'row',
    gap: SPACING.space_10,
    alignItems: 'center',
  },
  starIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.Yellow,
  },
  descriptionText: {
    fontFamily: FONTFAMILY.nunitosans_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.Black,
    textAlign: 'justify',
    marginBottom: SPACING.space_10,
  },
  containerGap24: {
    gap: SPACING.space_24,
  },
  buttonBG: {
    alignItems: 'center',
    marginVertical: SPACING.space_24,
  },
  buttonText: {
    borderRadius: BORDERRADIUS.radius_25 * 2,
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_10,
    backgroundColor: COLORS.Blue,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
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
  timeText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.Black,
  },
  timeDiv: {
    paddingVertical: SPACING.space_10,
    borderWidth: 1,
    borderColor: COLORS.Black,
    paddingHorizontal: SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_25,
    backgroundColor: COLORS.White,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MovieDetailsScreen;
