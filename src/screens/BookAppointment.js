import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import api, { errMsg } from '../api';
import { Button, Card, DateTimeField, ErrorText, Input, colors, s } from '../ui';

const tomorrowAt10 = () => { const d = new Date(Date.now() + 86400000); d.setHours(10, 0, 0, 0); return d; };

export default function BookAppointment({ navigation }) {
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState('');
  const [start, setStart] = useState(tomorrowAt10());
  const [reason, setReason] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { api.get('/doctors').then((r) => setDoctors(r.data)).catch((e) => setErr(errMsg(e))); }, []);

  const submit = async () => {
    setBusy(true);
    try { await api.post('/appointments', { doctor, start: start.toISOString(), reason }); navigation.goBack(); }
    catch (e) { setErr(errMsg(e)); setBusy(false); }
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.pad} keyboardShouldPersistTaps="handled">
      <ErrorText text={err} />
      <Text style={s.bold}>Choose a doctor</Text>
      {doctors.map((d) => (
        <TouchableOpacity key={d._id} onPress={() => setDoctor(d._id)}>
          <Card>
            <Text style={[s.bold, doctor === d._id && { color: colors.primary }]}>{doctor === d._id ? '✓ ' : ''}{d.name}</Text>
            <Text style={s.muted}>{d.specialization}</Text>
          </Card>
        </TouchableOpacity>
      ))}
      <Text style={s.bold}>Date and time (30 min)</Text>
      <DateTimeField value={start} onChange={setStart} />
      <Input placeholder="Reason for visit" value={reason} onChangeText={setReason} />
      <Button title={busy ? 'Booking...' : 'Book appointment'} onPress={submit} disabled={busy || !doctor} />
    </ScrollView>
  );
}
