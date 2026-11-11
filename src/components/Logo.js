import { Image } from 'react-native';

export default function Logo() {
  return (
    <Image
      source={require('../../assets/logo.png')}
      style={{ width: 170, height: 34 }}
      resizeMode="contain"
      accessibilityLabel="Little Lemon logo"
    />
  );
}
