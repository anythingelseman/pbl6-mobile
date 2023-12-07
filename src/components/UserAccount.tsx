import {
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import AppHeader from './AppHeader';
import SettingComponent from './SettingComponent';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useAuth} from '../context/AuthContext';

const UserAccount = ({navigation}: any) => {
  const {logout} = useAuth();
  const logoutHandle = async () => {
    logout();
  };
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.appHeaderContainer}>
        <AppHeader
          name="close"
          header={'My Profile'}
          action={() => navigation.goBack()}
        />
      </View>

      {/* <View style={styles.profileContainer}>
          <Image
            source={require('../assets/image/avatar.png')}
            style={styles.avatarImage}
          />
          <Text style={styles.avatarText}>John Doe</Text>
        </View> */}

      <View style={styles.profileContainer}>
        <SettingComponent
          icon="user"
          heading="Account"
          subheading="Edit Profile"
          subtitle="Change Password"
        />
        <SettingComponent
          icon="setting"
          heading="Settings"
          subheading="Theme"
          subtitle="Permissions"
        />
        {/* <SettingComponent
          icon="dollar"
          heading="Offers & Refferrals"
          subheading="Offer"
          subtitle="Refferrals"
        />
        <SettingComponent
          icon="info"
          heading="About"
          subheading="About Movies"
          subtitle="more"
        /> */}
        <TouchableOpacity
          onPress={logoutHandle}
          style={{
            padding: 12,
            backgroundColor: COLORS.Orange,
            marginVertical: 30,
            borderRadius: 6,
            shadowColor: COLORS.Orange,
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            paddingHorizontal: 40,
          }}>
          <Text
            style={{
              fontFamily: FONTFAMILY.poppins_bold,
              color: COLORS.White,
              textAlign: 'center',
              fontSize: FONTSIZE.size_20,
            }}>
            Log out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
  profileContainer: {
    alignItems: 'center',
    padding: SPACING.space_36,
  },
  avatarImage: {
    height: 80,
    width: 80,
    borderRadius: 80,
  },
  avatarText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    marginTop: SPACING.space_16,
    color: COLORS.White,
  },
});

export default UserAccount;
