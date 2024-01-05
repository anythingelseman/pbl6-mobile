import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './src/navigators/TabNavigator';
import MovieDetailsScreen from './src/screens/MovieDetailsScreen';
import SeatBookingScreen from './src/screens/SeatBookingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import {AuthProvider} from './src/context/AuthContext';
import PaymentScreen from './src/screens/PaymentScreen';
import PaymentReturnScreen from './src/screens/PaymentReturnScreen';
import UserDetailsScreen from './src/screens/UserDetailsScreen';
import ChangeUserDetailsScreen from './src/screens/ChangeUserDetailsScreen';
import BookingHistoryScreen from './src/screens/BookingHistoryScreen';
import BookingDetailsScreen from './src/screens/BookingDetailsScreen';
import ConfirmEmailScreen from './src/screens/ConfirmEmailScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen
            name="Tab"
            component={TabNavigator}
            options={{animation: 'default'}}
          />
          <Stack.Screen
            name="MovieDetails"
            component={MovieDetailsScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="SeatBooking"
            component={SeatBookingScreen}
            options={{animation: 'slide_from_bottom'}}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="Signup"
            component={SignUpScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="PaymentReturn"
            component={PaymentReturnScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="UserDetails"
            component={UserDetailsScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="ChangeUserDetails"
            component={ChangeUserDetailsScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="BookingHistory"
            component={BookingHistoryScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="BookingDetails"
            component={BookingDetailsScreen}
            options={{animation: 'slide_from_right'}}
          />
          <Stack.Screen
            name="ConfirmEmail"
            component={ConfirmEmailScreen}
            options={{animation: 'slide_from_right'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
