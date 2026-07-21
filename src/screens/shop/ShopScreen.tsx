import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { addFavorite, removeFavorite } from '../../api/favorites';
import { listProducts } from '../../api/products';
import type { Product } from '../../api/types';
import { FavoriteButton } from '../../components/FavoriteButton';
import { LoadingView } from '../../components/LoadingView';
import { PageHeader } from '../../components/PageHeader';
import { KeyboardAvoidingContainer } from '../../components/KeyboardAwareScrollView';
import { SearchBar } from '../../components/SearchBar';
import { useAuth } from '../../context/AuthContext';
import type { ShopStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts, typography } from '../../theme/typography';
import { formatNaira } from '../../utils/format';

type Props = NativeStackScreenProps<ShopStackParamList, 'Shop'>;

export function ShopScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardWidth = (width - spacing.screenX * 2 - 12) / 2;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description?.toLowerCase().includes(q) ?? false),
    );
  }, [products, query]);

  const loadProducts = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);
    try {
      setProducts(await listProducts());
    } catch {
      setError('Could not load products.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (isLoading) return <LoadingView message="Loading products…" />;

  return (
    <SafeAreaView style={styles.list} edges={['top']}>
      <KeyboardAvoidingContainer style={styles.list}>
      <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      data={filtered}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      columnWrapperStyle={styles.row}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => loadProducts(true)}
          tintColor={colors.onBackground}
        />
      }
      ListHeaderComponent={
        <View>
          <PageHeader
            title="Shop"
            subtitle={`Hello ${user?.name?.split(' ')[0] ?? ''} · ${products.length} items`}
          />
          <SearchBar value={query} onChangeText={setQuery} />
        </View>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{error ?? 'No products match your search.'}</Text>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          style={[styles.card, { width: cardWidth }]}
          onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        >
          <FavoriteButton
            active={Boolean(item.is_favorite)}
            size="card"
            onPress={async () => {
              if (item.is_favorite) await removeFavorite(item.id);
              else await addFavorite(item.id);
              setProducts((prev) =>
                prev.map((product) =>
                  product.id === item.id
                    ? { ...product, is_favorite: !product.is_favorite }
                    : product,
                ),
              );
            }}
          />
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Text style={styles.placeholderText}>LT</Text>
            </View>
          )}
          <View style={styles.cardBody}>
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.price}>{formatNaira(item.price_naira)}</Text>
            <Text style={styles.meta} numberOfLines={1}>
              {item.installment_count_weekly} weekly pays
            </Text>
          </View>
        </Pressable>
      )}
      />
      </KeyboardAvoidingContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.screenX,
    paddingTop: spacing.sm,
    paddingBottom: spacing.screenBottom,
  },
  row: { gap: 12, marginBottom: 12 },
  card: {
    borderRadius: colors.radius.lg,
    borderWidth: 1,
    borderColor: colors.borderOnSurface,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  image: { width: '100%', height: 112, backgroundColor: colors.surfaceVariant },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  placeholderText: { fontFamily: fonts.bold, color: colors.primary, fontSize: 18 },
  cardBody: { padding: 14, gap: 6 },
  name: { fontFamily: fonts.semibold, fontSize: 13, color: colors.text, minHeight: 36, lineHeight: 18 },
  price: { fontFamily: fonts.bold, fontSize: 14, color: colors.primary },
  meta: { ...typography.caption, color: colors.textMuted },
  empty: { alignItems: 'center', marginTop: spacing.xxl, paddingHorizontal: spacing.lg },
  emptyText: { ...typography.body, color: colors.onBackgroundMuted, textAlign: 'center' },
});
