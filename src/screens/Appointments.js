import { useCallback, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api, { errMsg, fmt } from '../api';
import { Button, Card, ErrorText, confirmAction, s } from '../ui';

export default function Appointments({ navigation }) {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    try { setItems((await api.get('/appointments', { params: { limit: 50 } })).data.items); setErr(''); }
    catch (e) { setErr(errMsg(e)); }
    setRefreshing(false);
  };
  useFocusEffect(useCallback(() => { load(); }, []));

  const cancel = (id) =>
    confirmAction('Cancel appointment', 'Are you sure?', async () => {
      try { await api.patch(`/appointments/${id}/cancel`); load(); } catch (e) { setErr(errMsg(e)); }
    });

  return (
    <FlatList
      style={s.screen}
      data={items}
      keyExtractor={(a) => a._id}
      refreshing={refreshing}
      onRefresh={load}
      ListHeaderComponent={
        <View style={s.pad}>
          <Button title="+ Book appointment" onPress={() => navigation.navigate('Book')} />
          <ErrorText text={err} />
        </View>
      }
      ListEmptyComponent={<Text style={[s.muted, { textAlign: 'center', marginTop: 30 }]}>No appointments yet</Text>}
      renderItem={({ item: a }) => (
        <Card>
          <View style={s.row}><Text style={s.bold}>{a.doctor?.name}</Text><Text style={s.muted}>{a.status}</Text></View>
          <Text>{fmt(a.start)}</Text>
          {a.reason ? <Text style={s.muted}>{a.reason}</Text> : null}
          {a.status === 'scheduled' && <View style={{ marginTop: 8 }}><Button title="Cancel" secondary onPress={() => cancel(a._id)} /></View>}
        </Card>
      )}
    />
  );
}
