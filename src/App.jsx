import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Discovery from './pages/Discovery'
import PlaceDetail from './pages/PlaceDetail'
import Festivals from './pages/Festivals'
import Itinerary from './pages/Itinerary'
import About from './pages/About'
import DistanceDemo from './pages/DistanceDemo'

function App() {
  return (
    <LanguageProvider>
      <Router basename="/ibaraki-discovery">
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/decouverte" element={<Discovery />} />
            <Route path="/lieu/:id" element={<PlaceDetail />} />
            <Route path="/festivals" element={<Festivals />} />
            <Route path="/itineraire" element={<Itinerary />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/demo-distances" element={<DistanceDemo />} />
          </Routes>
        </Layout>
      </Router>
    </LanguageProvider>
  )
}

export default App

