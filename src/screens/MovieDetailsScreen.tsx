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

const MovieDetailsScreen = ({navigation, route}: any) => {
  const [movieData, setMovieData] = useState<any>(undefined);
  const [cinemaData, setCinemaData] = useState<any>(undefined);
  const [scheduleData, setScheduleData] = useState<any>(undefined);
  const [selectedCinema, setSelectedCinema] = useState<any>(undefined);
  const [selectedDate, setSelectedDate] = useState<any>();
  const [selectedDateIndex, setSelectedDateIndex] = useState<any>();

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
        const isLaterThanNow = startTimeDate > selectedDateObject;

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
          source={{
            uri: movieData?.image[1],
          }}
          style={styles.imageBG}>
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
        <View style={styles.imageBG}></View>
        <Image source={{uri: movieData?.image[0]}} style={styles.cardImage} />
      </View>

      <View style={styles.timeContainer}>
        <CustomIcon name="clock" style={styles.clockIcon} />
        <Text style={styles.runtimeText}>
          {convertToHoursAndMinutes(movieData.duration)}
        </Text>
      </View>

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
          <Text style={styles.infoTitle}>Actor</Text>
          <Text>{movieData.actor}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Director</Text>
          <Text>{movieData.director}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Country</Text>
          <Text>{movieData.country}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.inputTitle}>Select cinema</Text>
        <Picker
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
                      ? {backgroundColor: COLORS.Orange}
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
                <TouchableOpacity onPress={() => {}}>
                  <View
                    style={[
                      styles.timeDiv,
                      index == 0
                        ? {marginLeft: SPACING.space_24}
                        : index == dateArray.length - 1
                        ? {marginRight: SPACING.space_24}
                        : {},
                      index == 69 ? {backgroundColor: COLORS.Orange} : {},
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

      <View>
        <View>
          <TouchableOpacity
            style={styles.buttonBG}
            onPress={() => {
              navigation.push('SeatBooking', {
                BgImage: movieData.image[1],
                PosterImage: movieData.image[0],
              });
            }}>
            <Text style={styles.buttonText}>Select Seats</Text>
          </TouchableOpacity>
        </View>
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
  loadingContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },

  scrollViewContainer: {
    flex: 1,
  },
  infoTitle: {
    color: COLORS.White,
    fontSize: FONTSIZE.size_16,
    marginBottom: SPACING.space_2,
  },
  inputTitle: {
    marginTop: SPACING.space_4,
    textAlign: 'center',
    color: COLORS.White,
    fontSize: FONTSIZE.size_20,
    marginBottom: SPACING.space_2,
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
    color: COLORS.WhiteRGBA50,
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
    color: COLORS.White,
  },
  title: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
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
    borderColor: COLORS.WhiteRGBA50,
    borderWidth: 1,
    paddingHorizontal: SPACING.space_10,
    paddingVertical: SPACING.space_4,
    borderRadius: BORDERRADIUS.radius_25,
  },
  genreText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_10,
    color: COLORS.WhiteRGBA75,
  },
  tagline: {
    fontFamily: FONTFAMILY.poppins_thin,
    fontSize: FONTSIZE.size_14,
    fontStyle: 'italic',
    color: COLORS.White,
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
    fontFamily: FONTFAMILY.poppins_light,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
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
    backgroundColor: COLORS.Orange,
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
    color: COLORS.White,
  },
  timeDiv: {
    paddingVertical: SPACING.space_10,
    borderWidth: 1,
    borderColor: COLORS.WhiteRGBA50,
    paddingHorizontal: SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_25,
    backgroundColor: COLORS.DarkGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MovieDetailsScreen;
