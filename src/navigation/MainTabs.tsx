import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { BankAccountScreen } from '../screens/wallet/BankAccountScreen';
import { FavoritesScreen } from '../screens/favorites/FavoritesScreen';
import { FundWalletScreen } from '../screens/wallet/FundWalletScreen';
import { WalletScreen } from '../screens/wallet/WalletScreen';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { EnrollmentDetailScreen } from '../screens/dashboard/EnrollmentDetailScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { ProductDetailScreen } from '../screens/shop/ProductDetailScreen';
import { ShopScreen } from '../screens/shop/ShopScreen';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import type {
  FavoriteStackParamList,
  MainTabParamList,
  PlansStackParamList,
  ProfileStackParamList,
  ShopStackParamList,
  WalletStackParamList,
} from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const ShopStack = createNativeStackNavigator<ShopStackParamList>();
const FavoriteStack = createNativeStackNavigator<FavoriteStackParamList>();
const PlansStack = createNativeStackNavigator<PlansStackParamList>();
const WalletStack = createNativeStackNavigator<WalletStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

const stackScreenOptions = {
  headerShown: false as const,
  contentStyle: { backgroundColor: colors.background },
};

function ShopNavigator() {
  return (
    <ShopStack.Navigator screenOptions={stackScreenOptions}>
      <ShopStack.Screen name="Shop" component={ShopScreen} />
      <ShopStack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </ShopStack.Navigator>
  );
}

function PlansNavigator() {
  return (
    <PlansStack.Navigator screenOptions={stackScreenOptions}>
      <PlansStack.Screen name="Dashboard" component={DashboardScreen} />
      <PlansStack.Screen name="EnrollmentDetail" component={EnrollmentDetailScreen} />
    </PlansStack.Navigator>
  );
}

function FavoritesNavigator() {
  return (
    <FavoriteStack.Navigator screenOptions={stackScreenOptions}>
      <FavoriteStack.Screen name="Favorites" component={FavoritesScreen} />
      <FavoriteStack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </FavoriteStack.Navigator>
  );
}

function WalletNavigator() {
  return (
    <WalletStack.Navigator screenOptions={stackScreenOptions}>
      <WalletStack.Screen name="WalletHome" component={WalletScreen} />
      <WalletStack.Screen name="FundWallet" component={FundWalletScreen} />
      <WalletStack.Screen name="BankAccount" component={BankAccountScreen} />
    </WalletStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={stackScreenOptions}>
      <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="ShopTab"
        component={ShopNavigator}
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, size }) => <Feather name="shopping-bag" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesNavigator}
        options={{
          title: 'Favourites',
          tabBarIcon: ({ color, size }) => <Feather name="heart" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="PlansTab"
        component={PlansNavigator}
        options={{
          title: 'Plans',
          tabBarIcon: ({ color, size }) => <Feather name="calendar" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="WalletTab"
        component={WalletNavigator}
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color, size }) => <Feather name="credit-card" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Feather name="user" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 12,
    height: 64,
    borderRadius: 26,
    backgroundColor: colors.glass.surfaceStrong,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: colors.glass.border,
    paddingTop: 4,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  tabLabel: { fontFamily: fonts.semibold, fontSize: 11, marginBottom: 2 },
});
