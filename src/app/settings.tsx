import { router } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/Icon';
import { Card, Eyebrow, Segmented, T, TopBar, useAccent } from '@/components/ui';
import { authMode } from '@/lib/auth';
import { APP_VERSION } from '@/lib/config';
import { disableReminder, enableReminder, REMINDER_HOUR, reminderEnabled } from '@/lib/reminders';
import { setSoundsEnabled, soundsEnabled } from '@/lib/sounds';
import { usePlayer, type Gender, type Persona } from '@/store/player';
import { useSession } from '@/store/session';
import { colors, fonts, radius, space } from '@/theme';

/** Réglages : compte, profil, informations légales, déconnexion et suppression du compte. */
export default function Settings() {
  const insets = useSafeAreaInsets();
  const { account, signOut, deleteAccount } = useSession();
  const { state, updatePlayer, loadExamples, deleteAll } = usePlayer();
  const { accent } = useAccent();
  const [busy, setBusy] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [sounds, setSounds] = useState(soundsEnabled());
  const p = state.player;

  useEffect(() => {
    reminderEnabled().then(setReminder);
  }, []);

  const toggleReminder = async (on: boolean) => {
    setReminder(on);
    if (!on) return disableReminder();
    const ok = await enableReminder(p.name);
    if (!ok) {
      setReminder(false);
      Alert.alert('Notifications désactivées', 'Autorise les notifications de Baller AI dans les Réglages de l’iPhone pour recevoir le rappel.', [
        { text: 'Plus tard', style: 'cancel' },
        { text: 'Ouvrir les Réglages', onPress: () => Linking.openSettings() },
      ]);
    }
  };

  const confirmSignOut = () =>
    Alert.alert('Se déconnecter ?', 'Tes données restent sauvegardées. Tu les retrouveras en te reconnectant.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter',
        style: 'destructive',
        onPress: async () => {
          await disableReminder().catch(() => {});
          await signOut();
        },
      },
    ]);

  const confirmDelete = () =>
    Alert.alert('Supprimer ton compte ?', 'Ton compte, ton profil, tes matchs, tes séances et ton XP seront effacés définitivement. Cette action est irréversible.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          setBusy(true);
          const r = await deleteAccount();
          setBusy(false);
          // Les données du téléphone ne sont effacées qu'une fois le compte bien supprimé.
          if (r.ok) {
            deleteAll();
            disableReminder().catch(() => {});
          }
          else Alert.alert('Suppression impossible', r.error);
        },
      },
    ]);

  const confirmExamples = () =>
    Alert.alert('Remplir avec des exemples ?', 'Des matchs, des séries et de l’XP d’exemple remplaceront tes données actuelles. Pratique pour une démo.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Remplir', onPress: loadExamples },
    ]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 4, paddingHorizontal: 16 }}>
        <TopBar onBack={() => router.back()} />
        <View style={{ paddingHorizontal: 4, marginTop: space.xs }}>
          <Eyebrow color={colors.orange}>Ton compte</Eyebrow>
          <Text style={styles.title}>RÉGLAGES.</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={[styles.inner, { paddingBottom: insets.bottom + 40 }]}>
        <Section title="Compte">
          <Card style={styles.account}>
            <View style={[styles.avatar, { backgroundColor: p.color }]} accessibilityLabel={`Numéro ${p.num}`}>
              <Text style={styles.avatarNum}>{p.num}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <T weight="semibold">{p.name || account?.name}</T>
              <T style={{ fontSize: 12.5, color: colors.muted }}>{account?.email}</T>
            </View>
            <View style={[styles.badge, { borderColor: authMode === 'cloud' ? colors.good : colors.line }]}>
              <T style={{ fontSize: 10.5, color: authMode === 'cloud' ? colors.good : colors.muted }}>{authMode === 'cloud' ? 'Sauvegardé' : 'Sur ce téléphone'}</T>
            </View>
          </Card>
        </Section>

        <Section title="Mon profil">
          <Card style={{ gap: 14 }}>
            <View style={{ gap: 8 }}>
              <T style={styles.label}>Je suis</T>
              <Segmented<Gender>
                value={p.gender}
                onChange={(gender) => updatePlayer({ gender })}
                options={[
                  { label: 'Joueur', value: 'M' },
                  { label: 'Joueuse', value: 'F' },
                ]}
              />
            </View>
            <View style={{ gap: 8 }}>
              <T style={styles.label}>Je joue</T>
              <Segmented<Persona>
                value={p.persona}
                onChange={(persona) => updatePlayer({ persona })}
                options={[
                  { label: 'En autonome', value: 'solo' },
                  { label: 'En club', value: 'club' },
                ]}
              />
            </View>
          </Card>
          <List>
            <Row icon="jersey" label="Mon maillot" onPress={() => router.push('/onboarding/jersey')} />
            <Row icon="profile" label="Mon modèle et mon poste" onPress={() => router.push('/onboarding/model')} last />
          </List>
        </Section>

        <Section title="Rappels et sons">
          <Card style={styles.account}>
            <View style={styles.rowIcon}>
              <Icon name="streak" size={17} color={accent} />
            </View>
            <View style={{ flex: 1 }}>
              <T weight="medium">Rappel des missions</T>
              <T style={{ fontSize: 12, color: colors.muted }}>Tous les jours à {REMINDER_HOUR} h</T>
            </View>
            <Switch value={reminder} onValueChange={toggleReminder} trackColor={{ true: accent, false: colors.surface2 }} accessibilityLabel="Rappel quotidien des missions" />
          </Card>
          <Card style={[styles.account, { marginTop: 10 }]}>
            <View style={styles.rowIcon}>
              <Icon name="hoop" size={17} color={accent} />
            </View>
            <View style={{ flex: 1 }}>
              <T weight="medium">Sons</T>
              <T style={{ fontSize: 12, color: colors.muted }}>Swish du filet, palier débloqué</T>
            </View>
            <Switch
              value={sounds}
              onValueChange={(on) => {
                setSounds(on);
                setSoundsEnabled(on);
              }}
              trackColor={{ true: accent, false: colors.surface2 }}
              accessibilityLabel="Sons de l'app"
            />
          </Card>
        </Section>

        <Section title="Informations">
          <List>
            <Row icon="shield" label="Confidentialité" onPress={() => router.push('/legal/privacy')} />
            <Row icon="doc" label="Conditions d’utilisation" onPress={() => router.push('/legal/terms')} />
            <Row icon="info" label="Crédits photos" onPress={() => router.push('/credits')} last />
          </List>
        </Section>

        <Section title="Démo">
          <List>
            <Row icon="bolt" label="Remplir avec des exemples" onPress={confirmExamples} last />
          </List>
        </Section>

        <List>
          <Row icon="logout" label="Se déconnecter" onPress={confirmSignOut} />
          <Row icon="trash" label="Supprimer mon compte" danger onPress={confirmDelete} last />
        </List>
        {busy && <ActivityIndicator color={accent} />}

        <T style={styles.footer}>Baller AI · version {APP_VERSION}</T>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ gap: 10 }}>
      <T weight="semibold" style={styles.sectionTitle}>
        {title}
      </T>
      {children}
    </View>
  );
}

function List({ children }: { children: ReactNode }) {
  return <Card style={{ paddingVertical: 2, paddingHorizontal: 14 }}>{children}</Card>;
}

function Row({ icon, label, onPress, danger, last }: { icon: IconName; label: string; onPress: () => void; danger?: boolean; last?: boolean }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, !last && styles.border, pressed && { opacity: 0.6 }]} accessibilityRole="button">
      <View style={[styles.rowIcon, danger && { backgroundColor: colors.dangerSoft }]}>
        <Icon name={icon} size={17} color={danger ? colors.danger : colors.text} />
      </View>
      <T weight="medium" style={{ flex: 1, color: danger ? colors.danger : colors.text }}>
        {label}
      </T>
      {!danger && <Icon name="arrow" size={14} color={colors.muted} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  inner: { paddingHorizontal: 20, paddingTop: space.md, gap: 24 },
  title: { fontFamily: fonts.display, fontSize: 36, lineHeight: 50, color: colors.text },
  sectionTitle: { fontFamily: fonts.display, fontSize: 18, lineHeight: 25, color: colors.text, textTransform: 'uppercase', marginLeft: 4 },
  account: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 46, height: 46, borderRadius: radius.chip, alignItems: 'center', justifyContent: 'center' },
  avatarNum: { fontFamily: fonts.display, fontSize: 22, lineHeight: 31, color: colors.white },
  badge: { borderWidth: 1, borderRadius: radius.chip, paddingHorizontal: 8, paddingVertical: 3 },
  label: { fontSize: 12.5, color: colors.muted },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 },
  border: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  rowIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  footer: { fontSize: 11.5, color: colors.muted, textAlign: 'center' },
});
