import { StyleSheet, Text, View } from 'react-native';

import type { PaymentSchedule } from '../api/types';
import { Button } from './Button';
import { colors } from '../theme/colors';
import { formatDate, formatNaira, scheduleStatusColor } from '../utils/format';
import type { SchedulePreviewRow } from '../utils/schedulePreview';

type Row = PaymentSchedule | SchedulePreviewRow;

type Props = {
  rows: Row[];
  durationType: 'daily' | 'weekly' | 'monthly';
  payingId?: number | null;
  onPay?: (scheduleId: number, amount: number) => void;
  preview?: boolean;
};

function rowLabel(row: Row, durationType: string): string {
  if ('label' in row) return row.label;
  if (durationType === 'daily') return `Day ${row.sequence}`;
  if (durationType === 'weekly') return `Week ${row.sequence}`;
  return `Month ${row.sequence}`;
}

export function InstallmentScheduleList({
  rows,
  durationType,
  payingId,
  onPay,
  preview = false,
}: Props) {
  return (
    <View style={styles.list}>
      {rows.map((row) => {
        const isPaid = 'status' in row && row.status === 'paid';
        const isPreview = preview || !('id' in row);
        const status = 'status' in row ? row.status : 'pending';

        return (
          <View key={'id' in row ? row.id : row.sequence} style={styles.row}>
            <View style={styles.left}>
              <View style={[styles.dot, isPaid && styles.dotPaid]} />
              <View style={styles.line} />
            </View>
            <View style={styles.body}>
              <View style={styles.header}>
                <Text style={styles.period}>{rowLabel(row, durationType)}</Text>
                {!isPreview ? (
                  <Text style={[styles.status, { color: scheduleStatusColor(status) }]}>
                    {status}
                  </Text>
                ) : null}
              </View>
              <Text style={styles.date}>Due {formatDate(row.due_at)}</Text>
              <Text style={styles.amount}>{formatNaira(row.amount_naira)}</Text>
              {!isPreview && !isPaid && onPay && 'id' in row ? (
                <Button
                  title="Pay"
                  variant="outline"
                  loading={payingId === row.id}
                  onPress={() => onPay(row.id, row.amount_naira)}
                  style={styles.payBtn}
                />
              ) : null}
              {!isPreview && isPaid && 'paid_at' in row && row.paid_at ? (
                <Text style={styles.paidAt}>Paid {formatDate(row.paid_at)}</Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 4 },
  row: { flexDirection: 'row', gap: 12 },
  left: { alignItems: 'center', width: 16, paddingTop: 6 },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.accentLight,
  },
  dotPaid: { backgroundColor: colors.success },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginTop: 4,
    minHeight: 40,
  },
  body: {
    flex: 1,
    backgroundColor: colors.glass.surfaceStrong,
    borderRadius: colors.radius.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
    padding: 14,
    marginBottom: 10,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  period: { fontSize: 15, fontWeight: '700', color: colors.text },
  status: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  date: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  amount: { fontSize: 16, fontWeight: '800', color: colors.accent, marginTop: 4 },
  payBtn: { marginTop: 12, minHeight: 44 },
  paidAt: { marginTop: 8, fontSize: 12, color: colors.success, fontWeight: '600' },
});
