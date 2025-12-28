import { RouterProvider } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { fetcher } from './api/fetcher';
// project imports
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <SWRConfig
      value={{
        fetcher,
        onError: (err) => {
          console.error('SWR global error:', err);
        },
        revalidateOnFocus: true, // auto refresh on window focus
        shouldRetryOnError: false
      }}
    >
      <ThemeCustomization>
        <ScrollTop>
          <RouterProvider router={router} />
        </ScrollTop>
      </ThemeCustomization>
    </SWRConfig>
  );
}
