import logo from './logo.svg';
import './App.css';
import Header from './header/Header';
import Footer from './footer/Footer';
import SignUp from './signUp/SignUp';
import Home from './home/Home';
import SignIn from './signIn/SignIn';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import InfluencerForm from './InfluencerForm/InfluencerForm';
import AllUsers from './allUsers/AllUsers';
import InfluencerDetails from './influencerDetails/InfluencerDetails';


function App() {
  return (

    <Router>
    <>
    <Header/>
    <Routes>
        <Route path='/' element={<SignIn/>}></Route>
        <Route path='/users' element={<AllUsers/>}></Route>
        <Route path="/influencerDetails" element={<InfluencerDetails />}> </Route>
        <Route path="/" element={<PrivateRoute />}>
                    <Route path="/home" element={<Home />} />
         <Route path='/InfluencerForm' element={<InfluencerForm/>}></Route>
         <Route path='/signUp' element={<SignUp/>}></Route>

        </Route>
             

      </Routes>
      <Footer/>
    </>
    </Router>
  );
}

export default App;
