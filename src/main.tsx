import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { ModalsProvider } from '@mantine/modals';
import { BrowserRouter } from 'react-router-dom';

const theme = createTheme({
	/** Put your mantine theme override here */
});

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<MantineProvider theme={theme} forceColorScheme='light'>
			<BrowserRouter>
				<ModalsProvider>
					<App />
				</ModalsProvider>
			</BrowserRouter>
		</MantineProvider>
	</StrictMode>
);
