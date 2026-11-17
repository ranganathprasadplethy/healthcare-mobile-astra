import { useEffect, useState } from 'react';
import { FlatList, Text } from 'react-native';
import api, { errMsg } from '../api';
import { Card, ErrorText, s } from '../ui';

export default function Doctors() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');
  useEffect(() => { api.get('/doctors').then((r) => setItems(r.data)).catch((e) => setErr(errMsg(e))); }, []);

  return (
    <FlatList
      style={s.screen}
      data={items}
      keyExtractor={(d) => d._id}
      ListHeaderComponent={<ErrorText text={err} />}
      renderItem={({ item: d }) => (
        <Card>
          <Text style={s.bold}>{d.name}</Text>
          <Text style={s.muted}>{d.specialization}</Text>
          {d.phone ? <Text>{d.phone}</Text> : null}
        </Card>
      )}
    />
  );
}
