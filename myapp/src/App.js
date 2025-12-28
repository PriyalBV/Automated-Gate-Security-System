import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SecureEntryPage from "./pages/SecureEntryPage";
import NotifyPage from "./pages/nm"; // Notification video page
import VehiclePage from "./pages/vm";
import AboutPage from "./pages/AboutPage";
import PrPage from "./pages/ParentReg";
import GrPage from "./pages/GuardReg";

import Setting from "./pages/Setting";
import FeedbackPage from "./pages/feedback.js"; // Corrected
import LoginPage from "./pages/login";
import SettingPage from "./pages/settings";
import ContactUsPage from "./pages/ContactUs"; // Added
import CustomerCarePage from "./pages/CustomerCare";
import PreVisit from "./pages/PreVisit";

import AdminPage from "./pages/Admin/Dashboard";
import WhitelistPage from "./pages/Admin/Whitelist";
import BlacklistPage from "./pages/Admin/Blacklist";
import GuardsPage from "./pages/Admin/Guards";

import GuardDashboard from "./pages/Guard/Dashboard";
import ManualEntryForm from "./pages/Guard/ManualEntryForm";   // your new form
import VerifyIris from "./pages/Guard/verifyIris";

import ParentDashboard from "./pages/Parent/Dashboard";
import ParentVisitRequest from "./pages/Parent/parentVisit";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/secure-entry" element={<SecureEntryPage />} />
        <Route path="/notify" element={<NotifyPage />} />
        <Route path="/vehicle" element={<VehiclePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/parent-registration" element={<PrPage />} />
        <Route path="/guard-registration" element={<GrPage />} />

        <Route path="/feedback" element={<FeedbackPage />} /> {/* Corrected */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} /> {/* Added */}
        <Route path="/customer-care" element={<CustomerCarePage />} />
        <Route path="/pre-visit" element={<PreVisit />} />

        <Route path="/admin/dashboard" element={<AdminPage />} />
        <Route path="/admin/whitelist" element={<WhitelistPage />} />
        <Route path="/admin/blacklist" element={<BlacklistPage />} />
        <Route path="/admin/guard" element={<GuardsPage />} />


        <Route path="/guard/dashboard" element={<GuardDashboard />} />
        <Route path="/manual-entry" element={<ManualEntryForm />} />
        <Route path="/guard/verifyIris" element={<VerifyIris />} />

        <Route path="/parent/dashboard" element={<ParentDashboard />} />
        <Route path="/parent-visit-request" element={<ParentVisitRequest />} />

      </Routes>
    </Router>
  );
}

export default App;
