import { ResumeProvider } from './context/ResumeContext';
import { Layout } from './components/layout/Layout';
import { ResumeBuilder } from './components/ResumeBuilder';
import './App.css';

function App() {
  return (
    <ResumeProvider>
      <Layout>
        <ResumeBuilder />
      </Layout>
    </ResumeProvider>
  );
}

export default App;
