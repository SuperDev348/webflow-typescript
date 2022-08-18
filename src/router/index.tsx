import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Stats from '../containers/stats'
import Analytics from '../containers/analytics'
import Builder from '../containers/builder'
import Bundle from '../containers/bundle'
import Manager from '../containers/Manager'
import CustomSelect from '../containers/CustomSelect'
import { BuilderProvider } from '../provider/builder'

const defaultRoutes = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Manager patientId="reculZXhIul7gHf14" />} />
        <Route
          path="/builder"
          element={
            <BuilderProvider>
              <Builder />
            </BuilderProvider>
          }
        ></Route>
        <Route
          path="/builder/:protocolId/bundles/:bundleId"
          element={
            <BuilderProvider>
              <Builder />
            </BuilderProvider>
          }
        ></Route>
        <Route path="/customselect" element={<CustomSelect />}></Route>
        <Route
          path="/patients/:patientId/bundles/:bundleId/protocols/:protocolId"
          element={<Bundle />}
        />
        <Route
          path="/patients/:patientId/bundles/:bundleId"
          element={<Bundle />}
        />
        <Route path="/patients/:patientId" element={<Manager />} />
        <Route
          path="/stats"
          element={<Stats />}
        />
        <Route
          path="/analytics"
          element={<Analytics />}
        />
        <Route path="/patients/:patientId" element={<Manager />} />
      </Routes>
    </Router>
  )
}
export default defaultRoutes
