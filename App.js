import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/auth';
import { colors, s } from './src/ui';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Appointments from './src/screens/Appointments';
import BookAppointment from './src/screens/BookAppointment';
import Doctors from './src/screens/Doctors';
import Records from './src/screens/Records';
import Profile from './src/screens/Profile';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const icons = { Appointments: 'calendar', Doctors: 'medkit', Records: 'document-text', Profile: 'person' };

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarIcon: ({ color, size }) => <Ionicons name={icons[route.name]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="Appointments" component={Appointments} />
      <Tab.Screen name="Doctors" component={Doctors} />
      <Tab.Screen name="Records" component={Records} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

function Root() {
  const { auth, loading } = useAuth();
  if (loading) return <View style={s.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  return (
    <Stack.Navigator>
      {auth ? (
        <>
          <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="Book" component={BookAppointment} options={{ title: 'Book Appointment' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ title: 'Sign up' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Root />
        <StatusBar style="auto" />
      </NavigationContainer>
    </AuthProvider>
  );
}
