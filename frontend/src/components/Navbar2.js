import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../actions/loginActions';

const Navbar2 = (props) => {

	const dispatch = useDispatch();
	const state = useSelector((state) => {
		return {
			isLogged: state.login.isLogged,
			user: state.login.user
		}
	})


	if (state.isLogged) {
		return (
			<nav className="navbar navbar-expand-lg navbar-light bg-light">
				<p className="navbar-brand" style={{ marginLeft: 10 }}>LoreDump</p>
				<p className="navbar-brand" style={{ marginLeft: 10 }}>Treasure trove for all your Worldbuilding Lore</p>
				<ul className="navbar-nav">
					<li className="nav-item" style={{ marginLeft: 10 }}>
						<Link className="nav-link" to="/">Category</Link>
					</li>
					<li className="nav-item" style={{ marginLeft: 10 }}>
						<Link className="nav-link" to="/new-page">Create a new Lore Page</Link>
					</li>
					<li className="nav-item" style={{ marginLeft: 10 }}>
						<p style={{ color: "blue" }} className="nav-link">Logged in as {state.user}</p>
					</li>
					<li className="nav-item" style={{ marginLeft: 10 }}>
						<Link className="nav-link" to="/" onClick={() => dispatch(logout())}>Logout</Link>
					</li>
				</ul>
			</nav>
		)
	} else {
		return (
			<nav className="navbar navbar-expand-lg navbar-light bg-light">
				<p className="navbar-brand" style={{ marginLeft: 10 }}>LoreDump</p>
			</nav>
		)
	}
}

export default Navbar2;