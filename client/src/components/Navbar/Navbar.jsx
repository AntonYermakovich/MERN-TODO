import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';
import './Navbar.scss'
import { Link } from 'react-router-dom'

const Navbar = () => {
	const { logout, isLogin } = useContext(AuthContext)

	return (
		<nav>
			<div className="nav-wrapper navbar blue">
				<Link to="#" className="brand-logo">MERN Todo App</Link>
				{
					isLogin
						? <ul id="nav-mobile" className="right hide-on-med-and-down">
							<li><Link to="/" onClick={logout}>Выйти</Link></li>
						</ul>
						: <ul id="nav-mobile" className="right hide-on-med-and-down">
							<li><Link to="/login">Войти</Link></li>
						</ul>
				}
			</div>
		</nav>
	);
}

export default Navbar
