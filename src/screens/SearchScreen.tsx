import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {COLORS, SPACING} from '../theme/theme';
import {baseImagePath, searchMovies} from '../api/apicalls';
import InputHeader from '../components/InputHeader';
import SubMovieCard from '../components/SubMovieCard';
import apiClient from '../services/apiClient';

const {width, height} = Dimensions.get('screen');

const SearchScreen = ({navigation}: any) => {
  const [searchList, setSearchList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const searchMoviesFunction = async (name: string) => {
    try {
      setIsFetching(true);
      let response = await apiClient.get(`/film?Keyword=${name}&OrderBy=id`);
      setSearchList(response.data.data);
      setIsFetching(false);
    } catch (error) {
      console.error('Something went wrong in searchMoviesFunction ', error);
    }
  };

  if (isFetching) {
    return (
      <View style={styles.container}>
        <View style={styles.InputHeaderContainer}>
          <InputHeader searchFunction={searchMoviesFunction} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} color={COLORS.Orange} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <View>
        <FlatList
          data={searchList}
          keyExtractor={(item: any) => item.id}
          bounces={false}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.InputHeaderContainer}>
              <InputHeader searchFunction={searchMoviesFunction} />
            </View>
          }
          contentContainerStyle={styles.centerContainer}
          renderItem={({item, index}) => (
            <SubMovieCard
              shoudlMarginatedAtEnd={false}
              shouldMarginatedAround={true}
              cardFunction={() => {
                navigation.push('MovieDetails', {filmId: item.id});
              }}
              cardWidth={width / 2 - SPACING.space_12 * 2}
              title={item.name}
              imagePath={item.image}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    width,
    alignItems: 'center',
    backgroundColor: COLORS.Black,
  },
  InputHeaderContainer: {
    display: 'flex',
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_28,
    marginBottom: SPACING.space_28 - SPACING.space_12,
  },
  centerContainer: {
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});

export default SearchScreen;
