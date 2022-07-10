import { Link, useLocation } from "react-router-dom";
import logo from "../images/logo.svg";

function Header({email, onLogout, loggedIn}) {
  const location = useLocation();
  const signup = location.pathname === "/sign-up";

  function handleLogout() {
    onLogout();
  }

  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип Mesto"/>
      <div className="header__login">
        {
          !loggedIn && (<Link to={signup ? "/sign-in" : "/sign-up"} className="header__link">
            { signup ? "Войти" : "Зарегистрироваться" }
          </Link>)
        }
        {
          loggedIn && (<p className="header__email">{email}</p>)
        }
        {
          loggedIn && (<button className="header__button-logout" onClick={handleLogout}>Выйти</button>)
        }
      </div>
    </header>
  );
}

export default Header;
