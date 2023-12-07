import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Image,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import AppHeader from '../components/AppHeader';
import SettingComponent from '../components/SettingComponent';
import CustomIcon from '../components/CustomIcon';
const {height} = Dimensions.get('window');

const NotLoggedIn = ({navigation}: any) => {
  return (
    <SafeAreaView
      style={{display: 'flex', flex: 1, backgroundColor: COLORS.Black}}>
      <View>
        <ImageBackground
          style={{height: height / 2.5, marginTop: 2}}
          resizeMode="contain"
          source={require('../assets/image/popcorn.png')}
        />
        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: 24,
          }}>
          <Text
            style={{
              fontSize: FONTSIZE.size_30,
              color: COLORS.White,
              fontFamily: FONTFAMILY.poppins_bold,
              textAlign: 'center',
            }}>
            Watch your favorite movie here
          </Text>
          <Text
            style={{
              fontSize: FONTSIZE.size_16,
              color: COLORS.White,
              fontFamily: FONTFAMILY.poppins_bold,
              textAlign: 'center',
              marginTop: 2,
            }}>
            Dive into a world of film magic and discover captivating stories at
            our cinema.
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 36,
            flexDirection: 'row',
            gap: 10,
          }}>
          <TouchableOpacity
            onPress={() => navigation.push('Login')}
            style={{
              backgroundColor: COLORS.Orange,
              paddingVertical: 9,
              paddingHorizontal: 12,
              width: '48%',
              borderRadius: 6,
            }}>
            <Text
              style={{
                fontFamily: FONTFAMILY.poppins_bold,
                fontSize: FONTSIZE.size_16,
                textAlign: 'center',
                color: COLORS.White,
              }}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.push('Signup')}
            style={{
              backgroundColor: COLORS.Orange,
              paddingVertical: 9,
              paddingHorizontal: 12,
              width: '48%',
              borderRadius: 6,
            }}>
            <Text
              style={{
                fontFamily: FONTFAMILY.poppins_bold,
                fontSize: FONTSIZE.size_16,
                textAlign: 'center',
                color: COLORS.White,
              }}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NotLoggedIn;
