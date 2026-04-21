import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddCustomer from './pages/AddCustomer';
import AddBike from './pages/AddBike';
import AddMechanic from './pages/AddMechanic';
import AddService from './pages/AddService';
import AddPayment from './pages/AddPayment';
import ViewRecords from './pages/ViewRecords';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/"              element={<Dashboard />} />
            <Route path="/add-customer"  element={<AddCustomer />} />
            <Route path="/add-bike"      element={<AddBike />} />
            <Route path="/add-mechanic"  element={<AddMechanic />} />
            <Route path="/add-service"   element={<AddService />} />
            <Route path="/add-payment"   element={<AddPayment />} />
            <Route path="/view-records"  element={<ViewRecords />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
