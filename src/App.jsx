import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Discovery from './pages/Discovery'
import PlaceDetail from './pages/PlaceDetail'
import Festivals from './pages/Festivals'
import Itinerary from './pages/Itinerary'
import About from './pages/About'
import DistanceDemo from './pages/DistanceDemo'

function App() {
  return (
    <Router>
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
  )
}

export default App

