// admob.ts
import { Platform } from 'react-native';

// 開発中は __DEV__ が true になります。本番ビルドでは false です。
const isDevelopment = __DEV__;

// テストID
const testBannerId = Platform.select({
  ios: 'ca-app-pub-3940256099942544/2934735716',
}) as string;

const testRewardedId = Platform.select({
  ios: 'ca-app-pub-3940256099942544/1712485313',
}) as string;

const productionBannerId = Platform.select({
  ios: process.env.EXPO_PUBLIC_BANNER_AD,
}) as string;

const productionRewardedId = Platform.select({
  ios: process.env.EXPO_PUBLIC_REWARDED_AD,
}) as string;

export const bannerAdUnitId = isDevelopment ? testBannerId : productionBannerId;
export const rewardedAdUnitId = isDevelopment ? testRewardedId : productionRewardedId;