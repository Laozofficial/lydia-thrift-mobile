import { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { listFavorites, removeFavorite } from '../../api/favorites';
import type { Product } from '../../api/types';
import { LoadingView } from '../../components/LoadingView';
import type { FavoriteStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { formatNaira } from '../../utils/format';

type Props = NativeStackScreenProps<FavoriteStackParamList, 'Favorites'>;

export function FavoritesScreen({ navigation }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      setProducts(await listFavorites());
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (isLoading) return <LoadingView message="Loading favourites..." />;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <FlatList
        style={styles.screen}
        contentContainerStyle={styles.content}
        data={products}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => load(true)} />}
        ListEmptyComponent={<Text style={styles.empty}>No favourite products yet.</Text>}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          >
            {item.image_url ? (
              <Image source={{ uri: item.image_url }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.placeholder]}>
                <Text style={styles.placeholderText}>LT</Text>
              </View>
            )}
            <View style={styles.body}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{formatNaira(item.price_naira)}</Text>
              <Pressable
                style={styles.removeBtn}
                onPress={async () => {
                  await removeFavorite(item.id);
                  await load(true);
                }}
              >
                <Text style={styles.removeBtnText}>Remove</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 120 },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    gap: 12,
  },
  image: { width: 72, height: 72, borderRadius: 12, backgroundColor: colors.surfaceVariant },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  placeholderText: { color: colors.accent, fontWeight: '800' },
  body: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
  price: { fontSize: 14, fontWeight: '700', color: colors.accent, marginTop: 4 },
  removeBtn: { alignSelf: 'flex-start', marginTop: 8 },
  removeBtnText: { color: colors.error, fontWeight: '600' },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: 20 },
});
