import { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { useAuth } from '../auth';
import { errMsg } from '../api';
import { Button, ErrorText, Input, s } from '../ui';

export default function Login({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try { await login(email.trim(), password); } catch (e) { setErr(errMsg(e)); setBusy(false); }
  };

  return (
    <ScrollView style={s.screen} contentContainerStyle={[s.pad, { paddingTop: 80 }]} keyboardShouldPersistTaps="handled">
      <Text style={s.title}>Patient Login</Text>
      <ErrorText text={err} />
      <Input placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Input placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title={busy ? 'Logging in...' : 'Login'} onPress={submit} disabled={busy || !email || !password} />
      <Button title="Create an account" secondary onPress={() => navigation.navigate('Register')} />
    </ScrollView>
  );
}
