import logo from './logo.svg';
import './App.css';
import Header from './header/Header';
import Footer from './footer/Footer';
import SignUp from './signUp/SignUp';
import Home from './home/Home';
import SignIn from './signIn/SignIn';


function App() {
  return (
    <div className="App">
      <Header/>
      <SignIn/>
      <Footer/>
    </div>
  );
}

export default App;
