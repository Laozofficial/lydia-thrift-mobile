import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import type { EnrollmentShipping, ThriftEnrollment } from '../api/types';
import { DeliveryTimeline } from './DeliveryTimeline';
import { colors } from '../theme/colors';
import { fonts, typography } from '../theme/typography';
import { deliveryStatusColor } from '../utils/delivery';
import { formatDate } from '../utils/format';
import { spacing } from '../theme/spacing';

type Props = {
  enrollment: ThriftEnrollment;
};

export function DeliveryStatusCard({ enrollment }: Props) {
  if (enrollment.status !== 'completed') return null;

  const shipping: EnrollmentShipping | undefined = enrollment.shipping;
  const label = shipping?.status_label ?? enrollment.delivery_status_label ?? 'Preparing shipment';
  const status = shipping?.status ?? enrollment.delivery_status ?? 'pending';
  const accent = deliveryStatusColor(status);

  const hasDetails =
    shipping?.address ||
    shipping?.phone ||
    shipping?.tracking_number ||
    shipping?.carrier ||
    shipping?.notes;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: `${accent}22` }]}>
          <Feather name="package" size={22} color={accent} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>Delivery tracking</Text>
          <Text style={styles.title}>{label}</Text>
          {shipping?.completed_at ? (
            <Text style={styles.meta}>All installments paid · {formatDate(shipping.completed_at)}</Text>
          ) : enrollment.completed_at ? (
            <Text style={styles.meta}>Plan completed · {formatDate(enrollment.completed_at)}</Text>
          ) : null}
        </View>
      </View>

      <DeliveryTimeline
        status={status}
        completedAt={shipping?.completed_at ?? enrollment.completed_at}
        shippedAt={shipping?.shipped_at ?? enrollment.shipped_at}
        deliveredAt={shipping?.delivered_at ?? enrollment.delivered_at}
      />

      {hasDetails ? (
        <View style={styles.details}>
          {shipping?.tracking_number ? (
            <DetailRow icon="hash" label="Tracking number" value={shipping.tracking_number} mono highlight />
          ) : null}
          {shipping?.carrier ? <DetailRow icon="truck" label="Carrier" value={shipping.carrier} /> : null}
          {shipping?.address ? <DetailRow icon="map-pin" label="Deliver to" value={shipping.address} /> : null}
          {shipping?.phone ? <DetailRow icon="phone" label="Contact" value={shipping.phone} /> : null}
          {shipping?.shipped_at ? (
            <DetailRow icon="send" label="Shipped" value={formatDate(shipping.shipped_at)} />
          ) : null}
          {shipping?.delivered_at ? (
            <DetailRow icon="check-circle" label="Delivered" value={formatDate(shipping.delivered_at)} />
          ) : null}
          {shipping?.notes ? <DetailRow icon="info" label="Note from team" value={shipping.notes} /> : null}
        </View>
      ) : (
        <Text style={styles.hint}>
          Your plan is fully paid. We will add tracking details here as soon as your order ships — updates
          from our team appear automatically.
        </Text>
      )}
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
  mono,
  highlight,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <View style={[styles.row, highlight && styles.rowHighlight]}>
      <Feather name={icon} size={15} color={colors.textMuted} style={styles.rowIcon} />
      <View style={styles.rowBody}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={[styles.rowValue, mono && styles.mono, highlight && styles.rowValueHighlight]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: colors.radius.lg,
    padding: spacing.card,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderOnSurface,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: spacing.sm },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: colors.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1 },
  eyebrow: { ...typography.label, color: colors.textMuted },
  title: { ...typography.title, fontSize: 18, color: colors.text, marginTop: 4 },
  meta: { ...typography.caption, color: colors.textSecondary, marginTop: 6 },
  details: { gap: 12, marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.borderOnSurface },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  rowHighlight: {
    backgroundColor: colors.surfaceVariant,
    marginHorizontal: -8,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: colors.radius.sm,
  },
  rowIcon: { marginTop: 3, marginRight: 12 },
  rowBody: { flex: 1 },
  rowLabel: { ...typography.label, color: colors.textMuted },
  rowValue: { ...typography.body, color: colors.text, marginTop: 4 },
  rowValueHighlight: { fontFamily: fonts.bold, fontSize: 16, color: colors.primary },
  mono: { fontFamily: fonts.medium, letterSpacing: 0.4 },
  hint: { ...typography.body, color: colors.textSecondary, lineHeight: 22, marginTop: spacing.md },
});
