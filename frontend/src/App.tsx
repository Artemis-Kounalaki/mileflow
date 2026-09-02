import './App.css'
import {Routes, Route} from "react-router";
import LoginPage from "@/pages/LoginPage.tsx";
import RouterLayout from "@/components/RouterLayout.tsx";
import AthletePage from "@/pages/AthletePage.tsx";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";
import CoachPage from "@/pages/CoachPage.tsx";
import CreateAthletePage from "@/pages/CreateAthletePage.tsx";
import AthletesPage from "@/pages/AthletesPage.tsx";
import ProgramPage from "@/pages/ProgramPage.tsx";
import HomePage from "./pages/HomePage";
import PerformancePage from "@/pages/PerformancePage.tsx";
import AthletePerformancePage from "@/pages/AthletePerformancePage.tsx";
import AthleteProgramPage from "@/pages/AthleteProgramPage.tsx";


function App() {


  return (
      <>
          <Routes>
              <Route element={<RouterLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route element={<ProtectedRoute />}>
                      <Route path="/athlete" element={<AthletePage />} />
                      <Route path="/athlete/program" element={<AthleteProgramPage />} />
                      <Route path="/athlete/performance" element={<AthletePerformancePage />} />                      <Route path="/coach" element={<CoachPage />}/>
                      <Route path="/coach/athletes" element={<AthletesPage />} />
                      <Route
                          path="/coach/athletes/create"
                          element={<CreateAthletePage />}
                      />
                      <Route path="/coach/program" element={<ProgramPage />} />
                      <Route path="/coach/performance" element={<PerformancePage />} />
                  </Route>              </Route>
          </Routes>
      </>

  )
}

export default App
