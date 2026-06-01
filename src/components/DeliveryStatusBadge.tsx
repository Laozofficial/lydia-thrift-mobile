import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import type { ThriftEnrollment } from '../api/types';
import { colors } from '../theme/colors';
import { fonts, typography } from '../theme/typography';
import { deliveryStatusColor } from '../utils/delivery';

type Props = {
  enrollment: ThriftEnrollment;
};

export function DeliveryStatusBadge({ enrollment }: Props) {
  if (enrollment.status !== 'completed') return null;

  const status = enrollment.shipping?.status ?? enrollment.delivery_status ?? 'pending';
  const label =
    enrollment.shipping?.status_label ??
    enrollment.delivery_status_label ??
    'Preparing shipment';
  const accent = deliveryStatusColor(status);

  return (
    <View style={styles.wrap}>
      <Feather name="package" size={12} color={accent} />
      <Text style={[styles.label, { color: accent }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.surfaceVariant,
    borderRadius: colors.radius.full,
  },
  label: {
    ...typography.caption,
    fontFamily: fonts.semibold,
    textTransform: 'none',
    letterSpacing: 0,
    fontSize: 11,
  },
});
