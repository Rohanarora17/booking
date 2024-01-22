import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Layout from './layouts/layout';
import Register from './pages/Register';
import SignIn from './pages/SignIn';
import AddHotel from './pages/AddHotel';
import { useAppContext } from './contexts/AppContext';

function App() {
  const {isLoggedIn} = useAppContext();
  return (
    <Router>
      <Routes>
        <Route path = '/' element = {<Layout>
          <p>home page</p> 
        </Layout>} />
        <Route path='/search' element = {<Layout>
          Search Page
        </Layout>}></Route>
        <Route path = '/register' element = {<Layout>
          <Register></Register>
        </Layout>}></Route>
        <Route path = '/sign-in' element = {<Layout>
          <SignIn></SignIn>
        </Layout>}></Route>
        {isLoggedIn && <>
        <Route path='/add-hotel' 
        element={<Layout><AddHotel></AddHotel></Layout>}> 
        </Route>
        </>
        }
        <Route path = '*' element = {<Navigate to = "/"></Navigate>} />
      </Routes>
    </Router>
     
  )

  
}

export default App;
