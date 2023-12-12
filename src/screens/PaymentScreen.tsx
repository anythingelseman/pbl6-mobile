import {useState} from 'react';
import {Modal, Text, View} from 'react-native';
import WebView from 'react-native-webview';
import AppHeader from '../components/AppHeader';
import {COLORS, SPACING} from '../theme/theme';

const PaymentScreen = ({navigation, route}: any) => {
  const handleNavigationStateChange = (navState: any) => {
    console.log(navState.url);
    if (navState.url.includes('pbl6-phi.vercel.app/payment/return')) {
      navigation.replace('PaymentReturn', {paymentReturnUrl: navState.url});
    }
  };
  return (
    <View style={{display: 'flex', flex: 1, backgroundColor: COLORS.White}}>
      <View
        style={{
          marginHorizontal: SPACING.space_20,
          marginTop: SPACING.space_20,
          marginBottom: 3,
        }}>
        <AppHeader
          name="close"
          header={'Trang thanh toán'}
          action={() => navigation.goBack()}
        />
      </View>
      <WebView
        onNavigationStateChange={handleNavigationStateChange}
        source={{
          uri: route.params.paymentUrl,
        }}
        style={{flex: 1}}
      />
    </View>
  );
};

export default PaymentScreen;
