export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type ShopStackParamList = {
  Shop: undefined;
  ProductDetail: { productId: number };
};

export type FavoriteStackParamList = {
  Favorites: undefined;
  ProductDetail: { productId: number };
};

export type PlansStackParamList = {
  Dashboard: undefined;
  EnrollmentDetail: { enrollmentId: number };
};

export type WalletStackParamList = {
  WalletHome: undefined;
  FundWallet: undefined;
  BankAccount: undefined;
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
};

export type MainTabParamList = {
  ShopTab: undefined;
  FavoritesTab: undefined;
  PlansTab: undefined;
  WalletTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
};
