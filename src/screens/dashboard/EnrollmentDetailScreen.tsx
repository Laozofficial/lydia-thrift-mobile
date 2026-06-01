import { useCallback, useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { getEnrollment } from '../../api/enrollments';
import { ApiError } from '../../api/errors';
import { payInstallmentFromWallet } from '../../api/wallet';
import type { ThriftEnrollment } from '../../api/types';
import { BackButton } from '../../components/BackButton';
import { DeliveryStatusCard } from '../../components/DeliveryStatusCard';
import { InstallmentScheduleList } from '../../components/InstallmentScheduleList';
import { LoadingView } from '../../components/LoadingView';
import type { PlansStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fonts, typography } from '../../theme/typography';
import { durationLabel, formatDate, formatNaira } from '../../utils/format';

type Props = NativeStackScreenProps<PlansStackParamList, 'EnrollmentDetail'>;

export function EnrollmentDetailScreen({ route, navigation }: Props) {
  const { enrollmentId } = route.params;
  const [enrollment, setEnrollment] = useState<ThriftEnrollment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [payingId, setPayingId] = useState<number | null>(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    try {
      setEnrollment(await getEnrollment(enrollmentId));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [enrollmentId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => load(true));
    return unsubscribe;
  }, [navigation, load]);

  async function paySchedule(scheduleId: number, amount: number) {
    setPayingId(scheduleId);
    try {
      await payInstallmentFromWallet(scheduleId);
      Alert.alert('Paid', `Installment of ${formatNaira(amount)} paid from wallet.`);
      await load(true);
    } catch (err) {
      Alert.alert(
        'Payment failed',
        err instanceof ApiError ? err.message : 'Fund your wallet and try again.',
      );
    } finally {
      setPayingId(null);
    }
  }

  if (isLoading && !enrollment) return <LoadingView message="Loading plan…" />;

  if (!enrollment) return <LoadingView message="Plan not found" />;

  const paidCount = enrollment.payment_schedules.filter((s) => s.status === 'paid').length;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => load(true)}
          tintColor={colors.onBackground}
        />
      }
    >
      <BackButton onPress={() => navigation.goBack()} />

      <View style={styles.hero}>
        <Text style={styles.product}>{enrollment.product.name}</Text>
        <Text style={styles.meta}>
          {durationLabel(enrollment.duration_type)} · {enrollment.status} · {paidCount}/
          {enrollment.installment_count} paid
        </Text>
      </View>

      <View style={styles.block}>
        <Row label="Total" value={formatNaira(enrollment.total_naira)} bold />
        <Row label="Delivery fee" value={formatNaira(enrollment.delivery_fee_naira)} />
        <Row label="Per installment" value={formatNaira(enrollment.amount_per_installment_naira)} />
        <Row label="Started" value={formatDate(enrollment.start_date)} />
      </View>

      {enrollment.status === 'active' ? (
        <View style={styles.shippingNote}>
          <Text style={styles.shippingNoteTitle}>After you finish paying</Text>
          <Text style={styles.shippingNoteText}>
            Delivery tracking opens here once every installment is paid. You will see carrier,
            tracking number, and status updates from our team.
          </Text>
        </View>
      ) : null}

      <DeliveryStatusCard enrollment={enrollment} />

      <Text style={styles.sectionTitle}>Payment schedule</Text>
      <Text style={styles.sectionHint}>
        Pay each{' '}
        {(enrollment.duration_type === 'custom'
          ? enrollment.custom_frequency
          : enrollment.duration_type) === 'daily'
          ? 'day'
          : (enrollment.duration_type === 'custom'
                ? enrollment.custom_frequency
                : enrollment.duration_type) === 'weekly'
            ? 'week'
            : 'month'}{' '}
        from your wallet balance.
      </Text>

      <InstallmentScheduleList
        rows={enrollment.payment_schedules}
        durationType={
          enrollment.duration_type === 'custom'
            ? (enrollment.custom_frequency ?? 'weekly')
            : enrollment.duration_type
        }
        payingId={payingId}
        onPay={paySchedule}
      />
    </ScrollView>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, bold && styles.rowValueBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.screenX,
    paddingTop: spacing.sm,
    paddingBottom: spacing.screenBottom,
  },
  hero: { marginBottom: spacing.lg },
  product: { ...typography.display, fontSize: 26, color: colors.onBackground },
  meta: { ...typography.body, color: colors.onBackgroundMuted, marginTop: 10 },
  block: {
    borderRadius: colors.radius.lg,
    borderWidth: 1,
    borderColor: colors.borderOnSurface,
    backgroundColor: colors.surface,
    padding: spacing.card,
    marginBottom: spacing.lg,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  rowLabel: { ...typography.body, color: colors.textSecondary },
  rowValue: { ...typography.bodyMedium, color: colors.text },
  rowValueBold: { fontFamily: fonts.bold, color: colors.primary, fontSize: 17 },
  shippingNote: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: colors.radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.card,
    marginBottom: spacing.lg,
  },
  shippingNoteTitle: {
    ...typography.subtitle,
    color: colors.onBackground,
    marginBottom: 8,
  },
  shippingNoteText: {
    ...typography.body,
    color: colors.onBackgroundMuted,
    lineHeight: 22,
  },
  sectionTitle: { ...typography.title, fontSize: 18, color: colors.onBackground, marginBottom: 8 },
  sectionHint: {
    ...typography.body,
    color: colors.onBackgroundMuted,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
});
