import * as React from 'react';

import NotLoggedIn from '../components/NotLoggedIn';
import UserAccount from '../components/UserAccount';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useState, useEffect} from 'react';
import {useAuth} from '../context/AuthContext';

const UserAccountScreen = ({navigation}: any) => {
  const {user} = useAuth();

  if (user) return <UserAccount />;
  else return <NotLoggedIn navigation={navigation} />;
};

export default UserAccountScreen;
