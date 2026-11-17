import { useCallback, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api, { errMsg, fmtDate } from '../api';
import { Card, ErrorText, s } from '../ui';

export default function Records() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    try { setItems((await api.get('/records', { params: { limit: 50 } })).data.items); setErr(''); }
    catch (e) { setErr(errMsg(e)); }
    setRefreshing(false);
  };
  useFocusEffect(useCallback(() => { load(); }, []));

  return (
    <FlatList
      style={s.screen}
      data={items}
      keyExtractor={(r) => r._id}
      refreshing={refreshing}
      onRefresh={load}
      ListHeaderComponent={<ErrorText text={err} />}
      ListEmptyComponent={<Text style={[s.muted, { textAlign: 'center', marginTop: 30 }]}>No records yet</Text>}
      renderItem={({ item: r }) => (
        <Card>
          <View style={s.row}><Text style={s.bold}>{r.diagnosis}</Text><Text style={s.muted}>{fmtDate(r.date)}</Text></View>
          <Text style={s.muted}>{r.doctor?.name} ({r.doctor?.specialization})</Text>
          {r.notes ? <Text>Notes: {r.notes}</Text> : null}
          {r.prescriptions ? <Text>Prescriptions: {r.prescriptions}</Text> : null}
        </Card>
      )}
    />
  );
}
