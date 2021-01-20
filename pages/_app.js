import '../styles/globals.css'
import { Layout } from '../components';
import { DataProvider } from '../store/globalState';

const MyApp = ({ Component, pageProps }) => {
    return (
        <DataProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </DataProvider>
    )
}

export default MyApp
