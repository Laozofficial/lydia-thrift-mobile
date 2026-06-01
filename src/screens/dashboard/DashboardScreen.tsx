import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fetchDashboard } from '../../api/dashboard';
import { ApiError } from '../../api/errors';
import { payInstallmentFromWallet } from '../../api/wallet';
import type { Dashboard } from '../../api/types';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { LoadingView } from '../../components/LoadingView';
import { PageHeader } from '../../components/PageHeader';
import type { PlansStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { fonts, typography } from '../../theme/typography';
import { durationLabel, formatDate, formatNaira } from '../../utils/format';

type Props = NativeStackScreenProps<PlansStackParamList, 'Dashboard'>;

export function DashboardScreen({ navigation }: Props) {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [payingId, setPayingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'due' | 'enrollments'>('due');

  const load = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);
    try {
      setDashboard(await fetchDashboard());
    } catch {
      setError('Could not load your plans.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => load(true));
    return unsubscribe;
  }, [navigation, load]);

  useEffect(() => {
    load();
  }, [load]);

  async function payNext(scheduleId: number) {
    setPayingId(scheduleId);
    setMessage(null);
    setError(null);
    try {
      await payInstallmentFromWallet(scheduleId);
      setMessage('Installment paid from wallet.');
      await load(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Payment failed. Fund your wallet first.');
    } finally {
      setPayingId(null);
    }
  }

  if (isLoading && !dashboard) return <LoadingView message="Loading your plans…" />;

  return (
    <SafeAreaView style={styles.list} edges={['top']}>
      <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={dashboard?.enrollments ?? []}
      keyExtractor={(item) => String(item.id)}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={() => load(true)} />
      }
      ListHeaderComponent={
        <View>
          <PageHeader title="My plans" subtitle="Track enrollments and pay what's due" />

          <View style={styles.statsRow}>
            <StatCard
              label="Wallet"
              value={formatNaira(dashboard?.wallet_balance_naira ?? 0)}
              accent
            />
            <StatCard
              label="Active plans"
              value={String(dashboard?.active_enrollments_count ?? 0)}
            />
            <StatCard
              label="Overdue"
              value={String(dashboard?.overdue_payments_count ?? 0)}
              danger={(dashboard?.overdue_payments_count ?? 0) > 0}
            />
          </View>

          {message ? <Text style={styles.success}>{message}</Text> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.tabs}>
            <Pressable
              style={[styles.tabBtn, activeTab === 'due' && styles.tabBtnActive]}
              onPress={() => setActiveTab('due')}
            >
              <Text style={[styles.tabBtnText, activeTab === 'due' && styles.tabBtnTextActive]}>Due Next</Text>
            </Pressable>
            <Pressable
              style={[styles.tabBtn, activeTab === 'enrollments' && styles.tabBtnActive]}
              onPress={() => setActiveTab('enrollments')}
            >
              <Text style={[styles.tabBtnText, activeTab === 'enrollments' && styles.tabBtnTextActive]}>
                Enrollments
              </Text>
            </Pressable>
          </View>

          {activeTab === 'due' && (dashboard?.next_payments ?? []).some((p) => p.next_payment) ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Due next</Text>
              {dashboard!.next_payments
                .filter((p) => p.next_payment)
                .map((p) => (
                  <Card key={p.enrollment_id} style={styles.dueCard}>
                    <Text style={styles.dueProduct}>{p.product_name}</Text>
                    <Text style={styles.dueMeta}>
                      #{p.next_payment!.sequence} · due {formatDate(p.next_payment!.due_at)} ·{' '}
                      {formatNaira(p.next_payment!.amount_naira)}
                    </Text>
                    <Button
                      title="Pay"
                      loading={payingId === p.next_payment!.schedule_id}
                      onPress={() => payNext(p.next_payment!.schedule_id)}
                      style={styles.payBtn}
                    />
                  </Card>
                ))}
            </View>
          ) : null}

          {activeTab === 'enrollments' ? <Text style={styles.sectionTitle}>All enrollments</Text> : null}
        </View>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No plans yet</Text>
          <Text style={styles.emptyText}>Browse the shop and enroll in a product to get started.</Text>
        </View>
      }
      renderItem={({ item }) => (
        activeTab !== 'enrollments' ? null : (
        <Card
          style={styles.enrollmentCard}
          onPress={() => navigation.navigate('EnrollmentDetail', { enrollmentId: item.id })}
        >
          <View style={styles.enrollmentTop}>
            {item.product.image_url ? (
              <Image source={{ uri: item.product.image_url }} style={styles.enrollmentImage} />
            ) : (
              <View style={[styles.enrollmentImage, styles.enrollmentImageFallback]}>
                <Text style={styles.enrollmentImageFallbackText}>LT</Text>
              </View>
            )}
            <View style={styles.enrollmentInfo}>
              <View style={styles.enrollmentHeader}>
                <Text style={styles.enrollmentName}>{item.product.name}</Text>
                <StatusBadge status={item.status} />
              </View>
              <Text style={styles.enrollmentMeta}>
                {durationLabel(item.duration_type)} · {item.installment_count} payments ·{' '}
                {formatNaira(item.amount_per_installment_naira)} each
              </Text>
              {item.status === 'completed' ? (
                <Text style={styles.deliveryMeta}>
                  Delivery: {(item.delivery_status ?? 'pending').replace('_', ' ')}
                </Text>
              ) : null}
              <Text style={styles.enrollmentTotal}>Total {formatNaira(item.total_naira)}</Text>
            </View>
          </View>
        </Card>
        )
      )}
      />
    </SafeAreaView>
  );
}

function StatCard({
  label,
  value,
  accent,
  danger,
}: {
  label: string;
  value: string;
  accent?: boolean;
  danger?: boolean;
}) {
  return (
    <View style={[styles.stat, accent && styles.statAccent, danger && styles.statDanger]}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, accent && styles.statValueAccent]}>{value}</Text>
    </View>
  );
}

function StatusBadge({ status }: { status: string }) {
  const bg =
    status === 'completed' ? colors.successBg : status === 'active' ? colors.accentLight : colors.surfaceVariant;
  const color =
    status === 'completed' ? colors.success : status === 'active' ? colors.accent : colors.textMuted;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 8, paddingBottom: 120 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  tabBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: colors.radius.full,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  tabBtnActive: { backgroundColor: colors.accentLight, borderColor: colors.accent },
  tabBtnText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.textSecondary },
  tabBtnTextActive: { color: colors.accent },
  stat: {
    flex: 1,
    backgroundColor: colors.glass.surfaceStrong,
    borderRadius: colors.radius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  statAccent: { backgroundColor: colors.accentLight, borderColor: colors.accent },
  statDanger: { borderColor: colors.error },
  statLabel: { ...typography.label, color: colors.textMuted },
  statValue: { fontFamily: fonts.bold, fontSize: 14, color: colors.text, marginTop: 4 },
  statValueAccent: { color: colors.accent },
  section: { marginBottom: 8 },
  sectionTitle: { ...typography.subtitle, color: colors.text, marginBottom: 10 },
  dueCard: { marginBottom: 10 },
  dueProduct: { ...typography.subtitle, color: colors.text },
  dueMeta: { ...typography.body, fontSize: 13, color: colors.textSecondary, marginTop: 4, marginBottom: 12 },
  payBtn: { marginTop: 4 },
  enrollmentCard: { marginBottom: 10 },
  enrollmentTop: { flexDirection: 'row', gap: 12 },
  enrollmentImage: { width: 74, height: 74, borderRadius: colors.radius.md, backgroundColor: colors.surfaceVariant },
  enrollmentImageFallback: { alignItems: 'center', justifyContent: 'center' },
  enrollmentImageFallbackText: { fontFamily: fonts.bold, color: colors.accent, fontSize: 16 },
  enrollmentInfo: { flex: 1 },
  enrollmentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  enrollmentName: { ...typography.subtitle, color: colors.text, flex: 1, marginRight: 8 },
  enrollmentMeta: { ...typography.body, fontSize: 13, color: colors.textSecondary, marginTop: 6 },
  deliveryMeta: { ...typography.caption, color: colors.accent, marginTop: 4, textTransform: 'capitalize' },
  enrollmentTotal: { fontFamily: fonts.semibold, fontSize: 14, color: colors.accent, marginTop: 6 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: colors.radius.full },
  badgeText: { fontFamily: fonts.bold, fontSize: 11, textTransform: 'capitalize' },
  success: { fontFamily: fonts.semibold, color: colors.success, marginBottom: 8 },
  error: { fontFamily: fonts.medium, color: colors.error, marginBottom: 8 },
  empty: { alignItems: 'center', marginTop: 32, paddingHorizontal: 24 },
  emptyTitle: { ...typography.title, fontSize: 18, color: colors.text },
  emptyText: { ...typography.body, textAlign: 'center', color: colors.textSecondary, marginTop: 8 },
});
