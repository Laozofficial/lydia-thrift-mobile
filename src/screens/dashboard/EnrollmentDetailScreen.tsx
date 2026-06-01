import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { getEnrollment } from '../../api/enrollments';
import { ApiError } from '../../api/errors';
import { payInstallmentFromWallet } from '../../api/wallet';
import type { ThriftEnrollment } from '../../api/types';
import { BackButton } from '../../components/BackButton';
import { InstallmentScheduleList } from '../../components/InstallmentScheduleList';
import { LoadingView } from '../../components/LoadingView';
import type { PlansStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { durationLabel, formatDate, formatNaira } from '../../utils/format';

type Props = NativeStackScreenProps<PlansStackParamList, 'EnrollmentDetail'>;

export function EnrollmentDetailScreen({ route, navigation }: Props) {
  const { enrollmentId } = route.params;
  const [enrollment, setEnrollment] = useState<ThriftEnrollment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [payingId, setPayingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      setEnrollment(await getEnrollment(enrollmentId));
    } finally {
      setIsLoading(false);
    }
  }, [enrollmentId]);

  useEffect(() => {
    load();
  }, [load]);

  async function paySchedule(scheduleId: number, amount: number) {
    setPayingId(scheduleId);
    try {
      await payInstallmentFromWallet(scheduleId);
      Alert.alert('Paid', `Installment of ${formatNaira(amount)} paid from wallet.`);
      await load();
    } catch (err) {
      Alert.alert(
        'Payment failed',
        err instanceof ApiError ? err.message : 'Fund your wallet and try again.',
      );
    } finally {
      setPayingId(null);
    }
  }

  if (isLoading || !enrollment) return <LoadingView />;

  const paidCount = enrollment.payment_schedules.filter((s) => s.status === 'paid').length;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
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

      <Text style={styles.sectionTitle}>Every payment</Text>
      <Text style={styles.sectionHint}>
        Pay each {(enrollment.duration_type === 'custom' ? enrollment.custom_frequency : enrollment.duration_type) === 'daily'
          ? 'day'
          : (enrollment.duration_type === 'custom' ? enrollment.custom_frequency : enrollment.duration_type) === 'weekly'
            ? 'week'
            : 'month'} from your wallet balance.
      </Text>

      <InstallmentScheduleList
        rows={enrollment.payment_schedules}
        durationType={enrollment.duration_type === 'custom' ? (enrollment.custom_frequency ?? 'weekly') : enrollment.duration_type}
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
  content: { padding: 16, paddingTop: 8, paddingBottom: 120 },
  hero: { marginBottom: 14 },
  product: { fontSize: colors.font.xl, fontWeight: '800', color: colors.text },
  meta: { fontSize: colors.font.sm, color: colors.textSecondary, marginTop: 6 },
  block: {
    borderRadius: colors.radius.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
    backgroundColor: colors.glass.surfaceStrong,
    padding: 14,
    marginBottom: 16,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  rowLabel: { color: colors.textSecondary },
  rowValue: { color: colors.text, fontWeight: '500' },
  rowValueBold: { fontWeight: '800', color: colors.accent },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  sectionHint: { fontSize: 13, color: colors.textMuted, marginTop: 4, marginBottom: 14, lineHeight: 19 },
});
