import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ApiError } from '../../api/errors';
import { addFavorite, removeFavorite } from '../../api/favorites';
import { createEnrollment } from '../../api/enrollments';
import { getProduct } from '../../api/products';
import type { DurationType, PlanFrequency, Product } from '../../api/types';
import { BackButton } from '../../components/BackButton';
import { FavoriteButton } from '../../components/FavoriteButton';
import { Button } from '../../components/Button';
import { InstallmentScheduleList } from '../../components/InstallmentScheduleList';
import { LoadingView } from '../../components/LoadingView';
import type { ShopStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { buildCustomSchedulePreview, buildSchedulePreview } from '../../utils/schedulePreview';
import { customPlanExceedsMaxDuration, CUSTOM_PLAN_MAX_MONTHS } from '../../utils/customPlanLimits';
import { durationLabel, formatNaira } from '../../utils/format';
import { KeyboardAwareScrollView } from '../../components/KeyboardAwareScrollView';
import { TextField } from '../../components/TextField';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<ShopStackParamList, 'ProductDetail'>;

const DURATIONS: DurationType[] = ['daily', 'weekly', 'monthly', 'custom'];
const FREQUENCIES: PlanFrequency[] = ['daily', 'weekly', 'monthly'];
const MAX_CUSTOM_PREVIEW_ROWS = 120;

export function ProductDetailScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [duration, setDuration] = useState<DurationType>('weekly');
  const [customFrequency, setCustomFrequency] = useState<PlanFrequency>('weekly');
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const total = product ? product.price_naira + product.delivery_fee_naira : 0;
  const customInstallmentAmount = Number.parseFloat(customAmount);
  const customInstallmentCount =
    duration === 'custom' && Number.isFinite(customInstallmentAmount) && customInstallmentAmount > 0
      ? Math.ceil(total / customInstallmentAmount)
      : 0;
  const customCountTooHigh = customInstallmentCount > MAX_CUSTOM_PREVIEW_ROWS;
  const customSpanTooLong =
    duration === 'custom' &&
    customInstallmentCount > 0 &&
    customPlanExceedsMaxDuration(customInstallmentCount, customFrequency);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getProduct(productId);
      setProduct(result);
      setIsFavorite(Boolean(result.is_favorite));
    } catch {
      setError('Product not found.');
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  const preview = useMemo(
    () => {
      if (!product) return [];
      if (duration !== 'custom') return buildSchedulePreview(product, duration);

      const amount = parseFloat(customAmount);
      const count = Number.isFinite(amount) && amount > 0 ? Math.ceil((product.price_naira + product.delivery_fee_naira) / amount) : 0;
      if (count > MAX_CUSTOM_PREVIEW_ROWS) return [];
      if (count > 0 && customPlanExceedsMaxDuration(count, customFrequency)) return [];
      return buildCustomSchedulePreview(
        product.price_naira + product.delivery_fee_naira,
        customFrequency,
        Number.isFinite(amount) ? amount : 0,
      );
    },
    [product, duration, customFrequency, customAmount],
  );

  if (isLoading) return <LoadingView />;
  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  async function handleEnroll() {
    const customInstallmentAmount = parseFloat(customAmount);
    if (duration === 'custom') {
      if (!Number.isFinite(customInstallmentAmount) || customInstallmentAmount < 100) {
        setError('Enter a valid custom installment amount (minimum ₦100).');
        return;
      }
      if (customInstallmentCount > MAX_CUSTOM_PREVIEW_ROWS) {
        setError('Amount is too small and creates too many payments. Increase amount per payment.');
        return;
      }
      if (customPlanExceedsMaxDuration(customInstallmentCount, customFrequency)) {
        setError(`Custom plan cannot span more than ${CUSTOM_PLAN_MAX_MONTHS} months. Increase amount per payment.`);
        return;
      }
    }

    setIsEnrolling(true);
    setError(null);
    try {
      await createEnrollment(
        duration === 'custom'
          ? {
              product_id: product!.id,
              duration_type: 'custom',
              custom_frequency: customFrequency,
              custom_installment_count: customInstallmentCount,
              custom_installment_amount_naira: customInstallmentAmount,
            }
          : { product_id: product!.id, duration_type: duration },
      );
      Alert.alert(
        'Enrolled!',
        'Your plan is active. Fund your wallet and pay each installment on its due date.',
        [{ text: 'View plans', onPress: () => navigation.getParent()?.navigate('PlansTab') }],
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not enroll.');
    } finally {
      setIsEnrolling(false);
    }
  }

  return (
    <SafeAreaView style={styles.scroll} edges={['left', 'right', 'top']}>
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
      <View style={[styles.backWrap, { top: insets.top + 8 }]}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>

      <View style={styles.heroCard}>
        <FavoriteButton
          active={isFavorite}
          size="hero"
          onPress={async () => {
            if (!product) return;
            if (isFavorite) await removeFavorite(product.id);
            else await addFavorite(product.id);
            setIsFavorite((prev) => !prev);
          }}
        />
        {product.image_url ? (
          <Image source={{ uri: product.image_url }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.placeholderText}>LT</Text>
          </View>
        )}
        <View style={styles.heroBody}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{formatNaira(product.price_naira)}</Text>
          {product.description ? (
            <Text style={styles.description}>{product.description}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Plan summary</Text>
        <SummaryRow label="Item price" value={formatNaira(product.price_naira)} />
        <SummaryRow label="Delivery" value={formatNaira(product.delivery_fee_naira)} />
        <SummaryRow label="Total" value={formatNaira(total)} bold />
      </View>

      <Text style={styles.blockTitle}>Payment frequency</Text>
      <View style={styles.durationRow}>
        {DURATIONS.map((d) => (
          <Pressable
            key={d}
            style={[styles.chip, duration === d && styles.chipActive]}
            onPress={() => setDuration(d)}
          >
            <Text style={[styles.chipText, duration === d && styles.chipTextActive]}>
              {durationLabel(d)}
            </Text>
          </Pressable>
        ))}
      </View>
      {duration === 'custom' ? (
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Custom plan setup</Text>
          <Text style={styles.blockHint}>Choose your frequency, number of payments, and amount per payment.</Text>
          <View style={styles.durationRow}>
            {FREQUENCIES.map((d) => (
              <Pressable
                key={d}
                style={[styles.chip, customFrequency === d && styles.chipActive]}
                onPress={() => setCustomFrequency(d)}
              >
                <Text style={[styles.chipText, customFrequency === d && styles.chipTextActive]}>
                  {durationLabel(d)}
                </Text>
              </Pressable>
            ))}
          </View>
          <TextField
            label="Amount per payment (₦)"
            keyboardType="decimal-pad"
            value={customAmount}
            onChangeText={setCustomAmount}
            placeholder="25000"
          />
          {preview.length > 0 ? (
            <Text style={styles.blockHint}>
              {preview.length} payments will be created from this amount.
            </Text>
          ) : null}
          {customCountTooHigh ? (
            <Text style={styles.errorText}>
              This amount creates {customInstallmentCount} payments (max {MAX_CUSTOM_PREVIEW_ROWS}). Increase amount per payment.
            </Text>
          ) : null}
          {customSpanTooLong ? (
            <Text style={styles.errorText}>
              This plan spans more than {CUSTOM_PLAN_MAX_MONTHS} months. Increase amount per payment or choose weekly/monthly.
            </Text>
          ) : null}
        </View>
      ) : null}

      <View style={styles.block}>
        <Text style={styles.blockTitle}>
          {preview.length} {durationLabel(duration).toLowerCase()} payments
        </Text>
        <Text style={styles.blockHint}>Each row shows the due date and amount you will pay.</Text>
        <InstallmentScheduleList
          rows={preview}
          durationType={duration === 'custom' ? customFrequency : duration}
          preview
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="Enroll in this plan" loading={isEnrolling} onPress={handleEnroll} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, bold && styles.summaryValueBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 0, paddingBottom: 120 },
  backWrap: { position: 'absolute', left: 16, zIndex: 5 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heroCard: {
    marginHorizontal: -16,
    borderBottomLeftRadius: colors.radius.xl,
    borderBottomRightRadius: colors.radius.xl,
    borderWidth: 1,
    borderColor: colors.glass.border,
    backgroundColor: colors.glass.surfaceStrong,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: { width: '100%', height: 300 },
  imagePlaceholder: {
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: { color: colors.accent, fontSize: 28, fontWeight: '800' },
  heroBody: { padding: 16 },
  name: { fontSize: colors.font.xl, fontWeight: '800', color: colors.text },
  price: { fontSize: colors.font.lg, fontWeight: '800', color: colors.accent, marginTop: 6 },
  description: { fontSize: colors.font.sm, color: colors.textSecondary, marginTop: 10, lineHeight: 21 },
  block: {
    borderRadius: colors.radius.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
    backgroundColor: colors.glass.surfaceStrong,
    padding: 14,
    marginBottom: 16,
  },
  blockTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 8 },
  blockHint: { fontSize: 12, color: colors.textMuted, marginBottom: 12 },
  durationRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  chip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: colors.radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  chipActive: { borderColor: colors.accent, backgroundColor: colors.accentLight },
  chipText: { fontWeight: '600', color: colors.textSecondary, fontSize: 13 },
  chipTextActive: { color: colors.accent },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  summaryLabel: { color: colors.textSecondary, fontSize: 14 },
  summaryValue: { color: colors.text, fontSize: 14 },
  summaryValueBold: { fontWeight: '800', color: colors.accent },
  error: { color: colors.error },
  errorText: { color: colors.error, marginBottom: 12, textAlign: 'center' },
});
