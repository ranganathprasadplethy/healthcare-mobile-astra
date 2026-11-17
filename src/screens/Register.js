import { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { useAuth } from '../auth';
import { errMsg } from '../api';
import { Button, ErrorText, PatientFields, emptyPatient, s, validDob } from '../ui';

export default function Register({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState(emptyPatient);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!form.name || !form.email || !form.password) return setErr('Name, email and password are required');
    if (!validDob(form.dob)) return setErr('Date of birth must be YYYY-MM-DD');
    setBusy(true);
    try { await register({ ...form, email: form.email.trim() }); } catch (e) { setErr(errMsg(e)); setBusy(false); }
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.pad} keyboardShouldPersistTaps="handled">
      <Text style={s.title}>Create Account</Text>
      <ErrorText text={err} />
      <PatientFields creating form={form} setForm={setForm} />
      <Button title={busy ? 'Creating...' : 'Sign up'} onPress={submit} disabled={busy} />
      <Button title="Back to login" secondary onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}
