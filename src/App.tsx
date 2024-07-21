import { Colors } from 'react-native/Libraries/NewAppScreen';
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import React from 'react';

import { getToken } from './services/session.ts';
import { onEvent } from './services/events.ts';
import { HomeScreen } from './screens/Home.tsx';
import { ProvideQueryClient } from './query-client.tsx';
import { useFetchUser } from './hooks/user.ts';
import { TokenContext } from './contexts/token.ts';
import { RouterContext } from './contexts/router.ts';
import { UserContext } from './contexts/profile.ts';

export function App() {
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!token) {
      const fetchSaveToken = async () => {
        const result = await getToken();
        setToken(result);
      };
      void fetchSaveToken();
    }
    return onEvent<string | null>('token-changed', setToken);
  }, [token]);

  return (
    <ProvideQueryClient>
      <TokenContext.Provider value={token}>
        <Body />
      </TokenContext.Provider>
    </ProvideQueryClient>
  );
}

function Body() {
  const isDarkMode = useColorScheme() === 'dark';
  const { isLoaded, data: user } = useFetchUser();

  const [page, setPage] = React.useState('home');

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {!isLoaded && <p>Loading...</p>}
      <RouterContext.Provider value={{ page, setPage }}>
        {/* TODO: */}
        {/* {isLoaded && !profile && page === "register" && <HomeScreen />}
        {isLoaded && !profile && page !== "register" && <HomeScreen />} */}
        {user && (
          <UserContext.Provider value={user}>
            {page === 'home' && <HomeScreen />}
          </UserContext.Provider>
        )}
      </RouterContext.Provider>
    </SafeAreaView>
  );
}
