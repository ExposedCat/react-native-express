import Config from 'react-native-config';

export const ENDPOINT =
  Config.ENDPOINT ?? (__DEV__ ? 'http://192.168.0.80:3000' : 'http://93.115.18.57:3001');
