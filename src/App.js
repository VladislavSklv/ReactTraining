import React, {createContext, useState, useEffect} from "react";
import './styles/App.css';
import About from './pages/About.jsx';
import Posts from "./pages/Posts";
import Navbar from "./components/UI/Navbar/Navbar";
import AppRouter from "./components/AppRouter";
import Error from "./pages/Error";
import { AuthContext } from "./context";

function App() {
	const [isAuth, setIsAuth] = useState(false);

	useEffect(() => {
		if(localStorage.getItem('auth')){
			setIsAuth(true);
		}
	})

	return (
		<div>
			<AuthContext.Provider value={{
				isAuth,
				setIsAuth
			}}>
				<Navbar />
				<AppRouter/>
			</AuthContext.Provider>
		</div>
	)
}

export default App;
