import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormBuilderPage from './pages/FormBuilderPage';
import PrintFormPage from './pages/PrintFormPage'; // <- new page

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<FormBuilderPage />} />
      <Route path="/print" element={<PrintFormPage />} />
    </Routes>
  </Router>
);

export default App;
