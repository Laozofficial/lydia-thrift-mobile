import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { fonts, typography } from '../theme/typography';
import { activeDeliveryStepIndex, deliverySteps } from '../utils/delivery';
import { formatDate } from '../utils/format';

type Props = {
  status: string | undefined;
  completedAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  compact?: boolean;
  variant?: 'onSurface' | 'onWine';
};

export function DeliveryTimeline({
  status,
  completedAt,
  shippedAt,
  deliveredAt,
  compact = false,
  variant = 'onSurface',
}: Props) {
  const steps = deliverySteps(status);
  const activeIndex = activeDeliveryStepIndex(status);
  const onWine = variant === 'onWine';

  function stepDate(id: string): string | undefined {
    if (id === 'completed' && completedAt) return formatDate(completedAt);
    if (id === 'in_transit' && shippedAt) return formatDate(shippedAt);
    if (id === 'delivered' && deliveredAt) return formatDate(deliveredAt);
    return undefined;
  }

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      {steps.map((step, index) => {
        const done = index < activeIndex;
        const current = index === activeIndex && activeIndex < steps.length;
        const date = stepDate(step.id);
        const isLast = index === steps.length - 1;

        return (
          <View key={step.id} style={styles.stepRow}>
            <View style={styles.rail}>
              <View
                style={[
                  styles.dot,
                  compact && styles.dotCompact,
                  onWine ? styles.dotWine : styles.dotSurface,
                  done && (onWine ? styles.dotDoneWine : styles.dotDoneSurface),
                  current && (onWine ? styles.dotCurrentWine : styles.dotCurrentSurface),
                ]}
              >
                {done ? (
                  <Feather
                    name="check"
                    size={compact ? 10 : 12}
                    color={current ? colors.primary : onWine ? colors.primary : '#fff'}
                  />
                ) : null}
              </View>
              {!isLast ? (
                <View style={[styles.line, onWine ? styles.lineWine : styles.lineSurface, done && styles.lineDone]} />
              ) : null}
            </View>
            <View style={[styles.stepBody, compact && styles.stepBodyCompact]}>
              <Text
                style={[
                  styles.stepTitle,
                  onWine ? styles.stepTitleWine : styles.stepTitleSurface,
                  done && (onWine ? styles.stepTitleDoneWine : styles.stepTitleDoneSurface),
                  current && styles.stepTitleCurrent,
                ]}
              >
                {step.title}
              </Text>
              {date ? (
                <Text style={[styles.stepDate, onWine ? styles.stepDateWine : styles.stepDateSurface]}>{date}</Text>
              ) : null}
              {current && !date && index > 0 ? (
                <Text style={[styles.stepPending, onWine && styles.stepPendingWine]}>In progress</Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 8 },
  wrapCompact: { marginTop: 4 },
  stepRow: { flexDirection: 'row', minHeight: 44 },
  rail: { width: 28, alignItems: 'center' },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCompact: { width: 18, height: 18, borderRadius: 9 },
  dotSurface: { borderColor: colors.borderOnSurface, backgroundColor: colors.surfaceVariant },
  dotWine: { borderColor: 'rgba(255,255,255,0.35)', backgroundColor: 'transparent' },
  dotDoneSurface: { backgroundColor: colors.primary, borderColor: colors.primary },
  dotCurrentSurface: { backgroundColor: '#fff', borderColor: colors.primary, borderWidth: 2 },
  dotDoneWine: { backgroundColor: colors.cream, borderColor: colors.cream },
  dotCurrentWine: { backgroundColor: '#fff', borderColor: '#fff' },
  line: { flex: 1, width: 2, marginVertical: 2 },
  lineSurface: { backgroundColor: colors.borderOnSurface },
  lineWine: { backgroundColor: 'rgba(255,255,255,0.2)' },
  lineDone: { backgroundColor: colors.primary, opacity: 0.35 },
  stepBody: { flex: 1, paddingBottom: 14, paddingLeft: 8 },
  stepBodyCompact: { paddingBottom: 10 },
  stepTitle: { ...typography.bodyMedium, fontSize: 14 },
  stepTitleSurface: { color: colors.textMuted },
  stepTitleWine: { color: 'rgba(255,255,255,0.45)' },
  stepTitleDoneSurface: { color: colors.textSecondary },
  stepTitleDoneWine: { color: colors.onBackgroundMuted },
  stepTitleCurrent: { color: colors.primary, fontFamily: fonts.semibold },
  stepDate: { ...typography.caption, marginTop: 2 },
  stepDateSurface: { color: colors.textMuted },
  stepDateWine: { color: colors.onBackgroundSubtle },
  stepPending: { ...typography.caption, color: colors.accent, marginTop: 2 },
  stepPendingWine: { color: colors.cream },
});
