import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, FONTFAMILY, FONTSIZE} from '../theme/theme';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import AppHeader from '../components/AppHeader';

const SignUpScreen = ({navigation}: any) => {
  const signUpHandle = () => {};
  return (
    <SafeAreaView
      style={{display: 'flex', flex: 1, backgroundColor: COLORS.Black}}>
      <View
        style={{
          marginHorizontal: 36,
          marginTop: 40,
        }}>
        <AppHeader
          name="close"
          header={'Sign up'}
          action={() => navigation.goBack()}
        />
      </View>
      <View style={{padding: 12}}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: FONTSIZE.size_30,
              color: COLORS.Orange,
              fontFamily: FONTFAMILY.poppins_bold,
              marginVertical: 18,
            }}>
            Create account
          </Text>
          <Text
            style={{
              fontFamily: FONTFAMILY.poppins_bold,
              fontSize: FONTSIZE.size_20,
              maxWidth: '80%',
              textAlign: 'center',
            }}>
            Create an account so you can explore all the existing films
          </Text>
        </View>
        <View
          style={{
            marginVertical: 18,
          }}>
          <TextInput
            placeholder="Email"
            placeholderTextColor={COLORS.WhiteRGBA15}
            style={{
              fontFamily: FONTFAMILY.poppins_regular,
              fontSize: FONTSIZE.size_16,
              padding: 12,
              backgroundColor: COLORS.Grey,
              borderRadius: 6,
              marginVertical: 12,
              marginBottom: 30,
            }}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor={COLORS.WhiteRGBA15}
            style={{
              fontFamily: FONTFAMILY.poppins_regular,
              fontSize: FONTSIZE.size_16,
              padding: 12,
              backgroundColor: COLORS.Grey,
              borderRadius: 6,
              marginVertical: 6,
            }}
          />
        </View>
        <TouchableOpacity
          onPress={signUpHandle}
          style={{
            padding: 12,
            backgroundColor: COLORS.Orange,
            marginVertical: 18,
            borderRadius: 6,
            shadowColor: COLORS.Orange,
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.3,
            shadowRadius: 6,
          }}>
          <Text
            style={{
              fontFamily: FONTFAMILY.poppins_bold,
              color: COLORS.White,
              textAlign: 'center',
              fontSize: FONTSIZE.size_20,
            }}>
            Sign up
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={{
            padding: 12,
          }}>
          <Text
            style={{
              fontFamily: FONTFAMILY.poppins_semibold,
              color: COLORS.White,
              textAlign: 'center',
              fontSize: FONTSIZE.size_14,
            }}>
            Already have an account ?
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;
