import { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { useAuth } from '../auth';
import api, { errMsg } from '../api';
import { Button, ErrorText, PatientFields, emptyPatient, s, validDob } from '../ui';

export default function Profile() {
  const { auth, refresh, logout } = useAuth();
  const p = auth.patient || {};
  const [form, setForm] = useState({ ...emptyPatient, ...p, dob: p.dob?.slice(0, 10) || '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const save = async () => {
    if (!validDob(form.dob)) return setErr('Date of birth must be YYYY-MM-DD');
    try {
      await api.put(`/patients/${p._id}`, form);
      await refresh(); setErr(''); setMsg('Profile updated');
    } catch (e) { setMsg(''); setErr(errMsg(e)); }
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.pad} keyboardShouldPersistTaps="handled">
      <Text style={s.muted}>{auth.user.email}</Text>
      <ErrorText text={err} />
      {msg ? <Text style={s.ok}>{msg}</Text> : null}
      <PatientFields form={form} setForm={setForm} />
      <Button title="Save changes" onPress={save} />
      <Button title="Logout" secondary onPress={logout} />
    </ScrollView>
  );
}
