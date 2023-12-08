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
import {useAuth} from '../context/AuthContext';

const MovieDetailsScreen = ({navigation, route}: any) => {
  const [movieData, setMovieData] = useState<any>(undefined);
  const [cinemaData, setCinemaData] = useState<any>(undefined);
  const [scheduleData, setScheduleData] = useState<any>(undefined);
  const [selectedCinema, setSelectedCinema] = useState<any>(undefined);
  const [selectedDate, setSelectedDate] = useState<any>();
  const [selectedDateIndex, setSelectedDateIndex] = useState<any>();

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
                <TouchableOpacity
                  onPress={() => {
                    // if (!user) navigation.push('Login');
                    // else
                    //   navigation.push('SeatBooking', {
                    //     BgImage: movieData.image[1],
                    //     PosterImage: movieData.image[0],
                    //     filmId: route.params.filmId,
                    //     scheduleId: item.id,
                    //   });
                    navigation.navigate('PaymentReturn', {
                      paymentReturnUrl:
                        'https://pbl6-phi.vercel.app/payment/return?PaymentId=638376284941770432&PaymentStatus=00&PaymentMessage=Payment+Success&PaymentDate=20231208173513&Amount=7000000&Signature=f5b5672a-fee6-4a7f-be81-4255cb9e330c&QRCode=iVBORw0KGgoAAAANSUhEUgAAASIAAAEiCAYAAABdvt%2B2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAABS7SURBVHhe7dZRiiS7EkTBu%2F9Nv7cBG3AIIUVlu8H5dKTM6knmv%2F9VVT3WD1FVPdcPUVU91w9RVT3XD1FVPdcPUVU91w9RVT3XD1FVPdcPUVU91w9RVT3XD1FVPdcPUVU91w9RVT3XD1FVPdcPUVU91w9RVT3XD1FVPdcPUVU91w9RVT3XD1FVPdcPUVU91w9RVT3XD1FVPdcPUVU91w9RVT3XD1FVPdcPUVU91w9RVT3XD1FVPdcPUVU91w9RVT3XD1FVPdcPUVU91w9RVT3XD1FVPdcPUVU91w9RVT3XD1FVPdcPUVU91w9RVT23%2FkP033%2F%2FNZTSdlJKW3Wazmj7%2F7%2FRD9GPltJ2UkpbdZrOaP0Qjemltn6I%2FkVntH6IxvRSWz9E%2F6IzWj9EY3qprR%2Bif9EZrR%2BiMb3U1g%2FRv%2BiM1g%2FRmF5q64foX3RG64doTC%2B19UP0Lzqj9UM0ppfa%2BiH6F53R%2BiEa00tt%2FRD9i85o%2FRCN6aWqr9CzqZS26jSdMSmlrfoKPZvabv0N9VLVV%2BjZVEpbdZrOmJTSVn2Fnk1tt%2F6GeqnqK%2FRsKqWtOk1nTEppq75Cz6a2W39DvVT1FXo2ldJWnaYzJqW0VV%2BhZ1Pbrb%2BhXqr6Cj2bSmmrTtMZk1Laqq%2FQs6nt1t9QL1V9hZ5NpbRVp%2BmMSSlt1Vfo2dR262%2Bol6q%2BQs%2BmUtqq03TGpJS26iv0bGq79TfUS1VfoWdTKW3VaTpjUkpb9RV6NrXd%2Bhvqpaqv0LOplLbqNJ0xKaWt%2Bgo9m9pu%2FQ31UtVX6NlUSlt1ms6YlNJWfYWeTW23%2FoZ6qSql7Y1S2qqUtpNS2qrTdIZKaXujlLZqu%2FU31EtVKW1vlNJWpbSdlNJWnaYzVErbG6W0Vdutv6Feqkppe6OUtiql7aSUtuo0naFS2t4opa3abv0N9VJVStsbpbRVKW0npbRVp%2BkMldL2Rilt1Xbrb6iXqlLa3iilrUppOymlrTpNZ6iUtjdKaau2W39DvVSV0vZGKW1VSttJKW3VaTpDpbS9UUpbtd36G%2BqlqpS2N0ppq1LaTkppq07TGSql7Y1S2qrt1t9QL1WltL1RSluV0nZSSlt1ms5QKW1vlNJWbbf%2BhnqpKqXtjVLaqpS2k1LaqtN0hkppe6OUtmq79TfUS1UpbW%2BU0laltJ2U0ladpjNUStsbpbRV262%2FoV6qSml7o5S2KqWtOk1nTEppq1La3iilrdpu%2FQ31UlVK2xultFUpbdVpOmNSSluV0vZGKW3VdutvqJeqUtreKKWtSmmrTtMZk1LaqpS2N0ppq7Zbf0O9VJXS9kYpbVVKW3WazpiU0laltL1RSlu13fob6qWqlLY3SmmrUtqq03TGpJS2KqXtjVLaqu3W31AvVaW0vVFKW5XSVp2mMyaltFUpbW%2BU0lZtt%2F6Geqkqpe2NUtqqlLbqNJ0xKaWtSml7o5S2arv1N9RLVSltb5TSVqW0VafpjEkpbVVK2xultFXbrb%2BhXqpKaXujlLYqpa06TWdMSmmrUtreKKWt2m79DfVSVUrbG6W0VSlt1Wk6Y1JKW5XS9kYpbdV262%2Bol6pS2t4opa1KaatO0xnqNJ2hUtreKKWt2m79DfVSVUrbG6W0VSlt1Wk6Q52mM1RK2xultFXbrb%2BhXqpKaXujlLYqpa06TWeo03SGSml7o5S2arv1N9RLVSltb5TSVqW0VafpDHWazlApbW%2BU0lZtt%2F6Geqkqpe2NUtqqlLbqNJ2hTtMZKqXtjVLaqu3W31AvVaW0vVFKW5XSVp2mM9RpOkOltL1RSlu13fob6qWqlLY3SmmrUtqq03SGOk1nqJS2N0ppq7Zbf0O9VJXS9kYpbVVKW3WazlCn6QyV0vZGKW3VdutvqJeqUtreKKWtSmmrTtMZ6jSdoVLa3iilrdpu%2FQ31UlVK2xultFUpbdVpOkOdpjNUStsbpbRV262%2FoV6q%2Bgo9m9pOd1an6Qz1FXo2td36G%2Bqlqq%2FQs6ntdGd1ms5QX6FnU9utv6FeqvoKPZvaTndWp%2BkM9RV6NrXd%2Bhvqpaqv0LOp7XRndZrOUF%2BhZ1Pbrb%2BhXqr6Cj2b2k53VqfpDPUVeja13fob6qWqr9Czqe10Z3WazlBfoWdT262%2FoV6q%2Bgo9m9pOd1an6Qz1FXo2td36G%2Bqlqq%2FQs6ntdGd1ms5QX6FnU9utv6FeqvoKPZvaTndWp%2BkM9RV6NrXd%2Bhvqpaqv0LOp7XRndZrOUF%2BhZ1Pbrb%2BhXmrLfzZtVUpbldJWpbRt6%2F%2BZ90P0q6W0VSltVUpbldK2rf9n3g%2FRr5bSVqW0VSltVUrbtv6feT9Ev1pKW5XSVqW0VSlt2%2Fp%2F5v0Q%2FWopbVVKW5XSVqW0bev%2FmfdD9KultFUpbVVKW5XStq3%2FZ94P0a%2BW0laltFUpbVVK27b%2Bn3k%2FRL9aSluV0laltFUpbdv6f%2Bb9EP1qKW1VSluV0laltG3r%2F5n3Q%2FSrpbRVKW1VSluV0rat%2F2e%2B%2F0NUM%2FqjVK%2FoLqq%2Brb%2Fwx%2BkftXpFd1H1bf2FP07%2FqNUruouqb%2Bsv%2FHH6R61e0V1UfVt%2F4Y%2FTP2r1iu6i6tv6C3%2Bc%2FlGrV3QXVd%2FWX%2Fjj9I9avaK7qPq2%2FsIfp3%2FU6hXdRdW39Rf%2BOP2jVq%2FoLqq%2Brb%2Fwx%2BkftXpFd1H1bZ%2F5hfXHOymlrUppOymlrUppOymlrUpp%2B4ttt%2F%2BGIb38SSltVUrbSSltVUrbSSltVUrbX2y7%2FTcM6eVPSmmrUtpOSmmrUtpOSmmrUtr%2BYtvtv2FIL39SSluV0nZSSluV0nZSSluV0vYX227%2FDUN6%2BZNS2qqUtpNS2qqUtpNS2qqUtr%2FYdvtvGNLLn5TSVqW0nZTSVqW0nZTSVqW0%2FcW223%2FDkF7%2BpJS2KqXtpJS2KqXtpJS2KqXtL7bd%2FhuG9PInpbRVKW0npbRVKW0npbRVKW1%2Fse323zCklz8ppa1KaTsppa1KaTsppa1KafuLbbf%2FhiG9%2FEkpbVVK20kpbVVK20kpbVVK219su%2FU31EtVKW0npbRVKW3VaTpjUkpbldJWvaK7TNpu%2FQ31UlVK20kpbVVKW3WazpiU0laltFWv6C6Ttlt%2FQ71UldJ2UkpbldJWnaYzJqW0VSlt1Su6y6Tt1t9QL1WltJ2U0laltFWn6YxJKW1VSlv1iu4yabv1N9RLVSltJ6W0VSlt1Wk6Y1JKW5XSVr2iu0zabv0N9VJVSttJKW1VSlt1ms6YlNJWpbRVr%2Bguk7Zbf0O9VJXSdlJKW5XSVp2mMyaltFUpbdUrusuk7dbfUC9VpbSdlNJWpbRVp%2BmMSSltVUpb9YruMmm79TfUS1UpbSeltFUpbdVpOmNSSluV0la9ortM2m79DfVSVUrbSSltVUpbdZrOmJTSVqW0Va%2FoLpO223%2FD5fSj3yil7aTtdOdJKW1v9BX9EA3pj%2BNGKW0nbac7T0ppe6Ov6IdoSH8cN0ppO2k73XlSStsbfUU%2FREP647hRSttJ2%2BnOk1La3ugr%2BiEa0h%2FHjVLaTtpOd56U0vZGX9EP0ZD%2BOG6U0nbSdrrzpJS2N%2FqKfoiG9Mdxo5S2k7bTnSeltL3RV%2FRDNKQ%2FjhultJ20ne48KaXtjb6iH6Ih%2FXHcKKXtpO1050kpbW%2F0Ff0QDemP40YpbSdtpztPSml7o69Y%2FyR6%2Beo0naFS2qqUtuoV3UWltFUpbSeltFUpbdV262%2Bol6pO0xkqpa1Kaate0V1USluV0nZSSluV0lZtt%2F6GeqnqNJ2hUtqqlLbqFd1FpbRVKW0npbRVKW3VdutvqJeqTtMZKqWtSmmrXtFdVEpbldJ2UkpbldJWbbf%2Bhnqp6jSdoVLaqpS26hXdRaW0VSltJ6W0VSlt1Xbrb6iXqk7TGSqlrUppq17RXVRKW5XSdlJKW5XSVm23%2FoZ6qeo0naFS2qqUtuoV3UWltFUpbSeltFUpbdV262%2Bol6pO0xkqpa1Kaate0V1USluV0nZSSluV0lZtt%2F6GeqnqNJ2hUtqqlLbqFd1FpbRVKW0npbRVKW3VdutvqJeqTtMZKqWtSmmrXtFdVEpbldJ2UkpbldJWbbf%2FhiG9fJXSVqW0nZTS9kav6C43Ok1nTNpu%2Fw1Devkqpa1KaTsppe2NXtFdbnSazpi03f4bhvTyVUpbldJ2UkrbG72iu9zoNJ0xabv9Nwzp5auUtiql7aSUtjd6RXe50Wk6Y9J2%2B28Y0stXKW1VSttJKW1v9IrucqPTdMak7fbfMKSXr1LaqpS2k1La3ugV3eVGp%2BmMSdvtv2FIL1%2BltFUpbSeltL3RK7rLjU7TGZO223%2FDkF6%2BSmmrUtpOSml7o1d0lxudpjMmbbf%2FhiG9fJXSVqW0nZTS9kav6C43Ok1nTNpu%2Fw1Devkqpa1KaTsppe2NXtFdbnSazpi03f4b1oj%2BKG%2F0iu6yqZS2k7brh%2Bjj9Ed5o1d0l02ltJ20XT9EH6c%2Fyhu9ortsKqXtpO36Ifo4%2FVHe6BXdZVMpbSdt1w%2FRx%2BmP8kav6C6bSmk7abt%2BiD5Of5Q3ekV32VRK20nb9UP0cfqjvNErusumUtpO2q4foo%2FTH%2BWNXtFdNpXSdtJ2%2FRB9nP4ob%2FSK7rKplLaTtuuH6OP0R3mjV3SXTaW0nbTd%2Bhvqpbbzf9Cn6Qy1ne58o7%2BmH6IfLaWtOk1nqO105xv9Nf0Q%2FWgpbdVpOkNtpzvf6K%2Fph%2BhHS2mrTtMZajvd%2BUZ%2FTT9EP1pKW3WazlDb6c43%2Bmv6IfrRUtqq03SG2k53vtFf0w%2FRj5bSVp2mM9R2uvON%2Fpp%2BiH60lLbqNJ2httOdb%2FTX9EP0o6W0VafpDLWd7nyjv6Yfoh8tpa06TWeo7XTnG%2F01n%2FkQfYWeTZ2mMyaltFUpbSeltFUpbdVXrH8SvXz1FXo2dZrOmJTSVqW0nZTSVqW0VV%2Bx%2Fkn08tVX6NnUaTpjUkpbldJ2UkpbldJWfcX6J9HLV1%2BhZ1On6YxJKW1VSttJKW1VSlv1FeufRC9ffYWeTZ2mMyaltFUpbSeltFUpbdVXrH8SvXz1FXo2dZrOmJTSVqW0nZTSVqW0VV%2Bx%2Fkn08tVX6NnUaTpjUkpbldJ2UkpbldJWfcX6J9HLV1%2BhZ1On6YxJKW1VSttJKW1VSlv1FeufRC9ffYWeTZ2mMyaltFUpbSeltFUpbdVXrH8SvXz1FXo2dZrOmJTSVqW0nZTSVqW0VV%2Bx%2Fkn08lVK2xultFUpbdUruotKaatS2v5i262%2FoV6qSml7o5S2KqWtekV3USltVUrbX2y79TfUS1UpbW%2BU0laltFWv6C4qpa1KafuLbbf%2BhnqpKqXtjVLaqpS26hXdRaW0VSltf7Ht1t9QL1WltL1RSluV0la9oruolLYqpe0vtt36G%2BqlqpS2N0ppq1Laqld0F5XSVqW0%2FcW2W39DvVSV0vZGKW1VSlv1iu6iUtqqlLa%2F2Hbrb6iXqlLa3iilrUppq17RXVRKW5XS9hfbbv0N9VJVStsbpbRVKW3VK7qLSmmrUtr%2BYtutv6Feqkppe6OUtiqlrXpFd1EpbVVK219su%2FU31EtVKW1vlNJWnaYzVEpbldJWnaYzVErbSV%2Bx%2Fkn08lVK2xultFWn6QyV0laltFWn6QyV0nbSV6x%2FEr18ldL2Rilt1Wk6Q6W0VSlt1Wk6Q6W0nfQV659EL1%2BltL1RSlt1ms5QKW1VSlt1ms5QKW0nfcX6J9HLVyltb5TSVp2mM1RKW5XSVp2mM1RK20lfsf5J9PJVStsbpbRVp%2BkMldJWpbRVp%2BkMldJ20lesfxK9fJXS9kYpbdVpOkOltFUpbdVpOkOltJ30FeufRC9fpbS9UUpbdZrOUCltVUpbdZrOUCltJ33F%2BifRy1cpbW%2BU0ladpjNUSluV0ladpjNUSttJX7H%2BSfTyVUrbG6W0VafpDJXSVqW0VafpDJXSdtJXrH8SvXyV0vZGKW1VSttJKW1VSttNpbRVKW3VdutvqJeqUtreKKWtSmk7KaWtSmm7qZS2KqWt2m79DfVSVUrbG6W0VSltJ6W0VSltN5XSVqW0Vdutv6Feqkppe6OUtiql7aSUtiql7aZS2qqUtmq79TfUS1UpbW%2BU0laltJ2U0laltN1USluV0lZtt%2F6Geqkqpe2NUtqqlLaTUtqqlLabSmmrUtqq7dbfUC9VpbS9UUpbldJ2UkpbldJ2UyltVUpbtd36G%2BqlqpS2N0ppq1LaTkppq1LabiqlrUppq7Zbf0O9VJXS9kYpbVVK20kpbVVK202ltFUpbdV262%2Bol6pS2t4opa1KaTsppa1KabuplLYqpa3abv0N9VLVV%2BjZVEpbldJ2U6fpDJXSVv01659YP5L6Cj2bSmmrUtpu6jSdoVLaqr9m%2FRPrR1JfoWdTKW1VSttNnaYzVEpb9desf2L9SOor9Gwqpa1Kabup03SGSmmr%2Fpr1T6wfSX2Fnk2ltFUpbTd1ms5QKW3VX7P%2BifUjqa%2FQs6mUtiql7aZO0xkqpa36a9Y%2FsX4k9RV6NpXSVqW03dRpOkOltFV%2Fzfon1o%2BkvkLPplLaqpS2mzpNZ6iUtuqvWf%2FE%2BpHUV%2BjZVEpbldJ2U6fpDJXSVv01659YP5L6Cj2bSmmrUtpu6jSdoVLaqr9m%2FRPrR2rvfjbdZVJK20lfoWdT2%2FVD9KO9ortMSmk76Sv0bGq7foh%2BtFd0l0kpbSd9hZ5NbdcP0Y%2F2iu4yKaXtpK%2FQs6nt%2BiH60V7RXSaltJ30FXo2tV0%2FRD%2FaK7rLpJS2k75Cz6a264foR3tFd5mU0nbSV%2BjZ1Hb9EP1or%2Bguk1LaTvoKPZvarh%2BiH%2B0V3WVSSttJX6FnU9v1Q%2FSjvaK7TEppO%2Bkr9Gxqu%2B%2F8IlX1s%2Fohqqrn%2BiGqquf6Iaqq5%2Fohqqrn%2BiGqquf6Iaqq5%2Fohqqrn%2BiGqquf6Iaqq5%2Fohqqrn%2BiGqquf6Iaqq5%2Fohqqrn%2BiGqquf6Iaqq5%2Fohqqrn%2BiGqquf6Iaqq5%2Fohqqrn%2BiGqquf6Iaqq5%2Fohqqrn%2BiGqquf6Iaqq5%2Fohqqrn%2BiGqquf6Iaqq5%2Fohqqrn%2BiGqquf6Iaqq5%2Fohqqrn%2BiGqquf6Iaqq5%2Fohqqrn%2BiGqquf6Iaqq5%2Fohqqrn%2BiGqquf6Iaqqx%2F73v%2F8DQEhao6HLgBwAAAAASUVORK5CYII%3D',
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
