import { createElement } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

export const colors = { primary: '#0b6e69', bg: '#f4f6f8', text: '#1f2933', border: '#cbd2d9' };

export const Input = (props) => <TextInput placeholderTextColor="#9aa5b1" style={s.input} {...props} />;

export const Button = ({ title, onPress, secondary, disabled }) => (
  <TouchableOpacity onPress={onPress} disabled={disabled} style={[s.btn, secondary && s.btn2, disabled && { opacity: 0.5 }]}>
    <Text style={[s.btnText, secondary && { color: colors.text }]}>{title}</Text>
  </TouchableOpacity>
);

export const ErrorText = ({ text }) => (text ? <Text style={s.error}>{text}</Text> : null);
export const Card = ({ children }) => <View style={s.card}>{children}</View>;

export function Chips({ options, value, onChange }) {
  return (
    <View style={s.chips}>
      {options.map((o) => (
        <TouchableOpacity key={o.value} onPress={() => onChange(o.value)} style={[s.chip, value === o.value && s.chipOn]}>
          <Text style={value === o.value && { color: '#fff' }}>{o.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const pad = (n) => String(n).padStart(2, '0');
const toLocal = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

// Alert.alert with buttons does nothing on web, so use window.confirm there
export const confirmAction = (title, message, onYes) => {
  if (Platform.OS === 'web') { if (window.confirm(`${title}\n${message}`)) onYes(); return; }
  Alert.alert(title, message, [{ text: 'No' }, { text: 'Yes', style: 'destructive', onPress: onYes }]);
};

export function DateTimeField({ value, onChange }) {
  if (Platform.OS === 'web')
    return createElement('input', {
      type: 'datetime-local', value: toLocal(value), min: toLocal(new Date()),
      onChange: (e) => e.target.value && onChange(new Date(e.target.value)),
      style: { padding: 12, fontSize: 16, borderRadius: 8, border: '1px solid #cbd2d9' },
    });
  if (Platform.OS === 'ios')
    return <DateTimePicker value={value} mode="datetime" minimumDate={new Date()} onChange={(_, d) => d && onChange(d)} style={{ alignSelf: 'flex-start' }} />;
  const open = () =>
    DateTimePickerAndroid.open({
      value, mode: 'date', minimumDate: new Date(),
      onChange: (_, d) => {
        if (!d) return;
        DateTimePickerAndroid.open({
          value: d, mode: 'time',
          onChange: (_, t) => { if (!t) return; const r = new Date(d); r.setHours(t.getHours(), t.getMinutes(), 0, 0); onChange(r); },
        });
      },
    });
  return <TouchableOpacity style={s.input} onPress={open}><Text>{value.toLocaleString()}</Text></TouchableOpacity>;
}

// Shared by Register and Profile
export function PatientFields({ form, setForm, creating }) {
  const set = (k) => (v) => setForm({ ...form, [k]: v });
  return (
    <>
      <Input placeholder="Full name" value={form.name} onChangeText={set('name')} />
      {creating && <Input placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={form.email} onChangeText={set('email')} />}
      {creating && <Input placeholder="Password (min 6)" secureTextEntry value={form.password} onChangeText={set('password')} />}
      <Input placeholder="Date of birth (YYYY-MM-DD)" value={form.dob} onChangeText={set('dob')} />
      <Chips value={form.gender} onChange={set('gender')} options={[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }]} />
      <Input placeholder="Phone" keyboardType="phone-pad" value={form.phone} onChangeText={set('phone')} />
      <Input placeholder="Address" value={form.address} onChangeText={set('address')} />
    </>
  );
}

export const emptyPatient = { name: '', email: '', password: '', dob: '', gender: '', phone: '', address: '' };
export const validDob = (d) => !d || /^\d{4}-\d{2}-\d{2}$/.test(d);

export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  pad: { padding: 16, gap: 10 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, fontSize: 16 },
  btn: { backgroundColor: colors.primary, borderRadius: 8, padding: 14, alignItems: 'center' },
  btn2: { backgroundColor: '#e4e7eb' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  error: { color: '#b42318', backgroundColor: '#fee4e2', padding: 10, borderRadius: 8 },
  ok: { color: '#067647', backgroundColor: '#dcfae6', padding: 10, borderRadius: 8 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginHorizontal: 16, marginTop: 10, gap: 4 },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 6 },
  bold: { fontWeight: '600', fontSize: 16, color: colors.text },
  muted: { color: '#616e7c' },
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
