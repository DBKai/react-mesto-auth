import { useState, useEffect } from 'react'
import { Link, useLocation } from "react-router-dom";
import logo from "../images/logo.svg";
import burgerMenu from "../images/burger_menu.svg";
import closeMenu from "../images/close.svg";
import NavBar from "./NavBar";

function Header({ loggedIn, email, onLogout }) {
  const location = useLocation();
  const signup = location.pathname === "/sign-up";
  const [windowDimension, setWindowDimension] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  })
  const [mobileMenuIsVisible, setMobileMenuIsVisible] = useState(false);
  const mobileMenuClassName = `header__mobile-menu ${ 
    mobileMenuIsVisible 
      ? "header__mobile-menu_close" 
      : "header__mobile-menu_open" }`;

  function detectSize() {
    setWindowDimension({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    })
  }

  function handleMobileMenu() {
    setMobileMenuIsVisible(!mobileMenuIsVisible);
  }

  useEffect(() => {
    window.addEventListener('resize', detectSize)

    return () => {
      window.removeEventListener('resize', detectSize)
    }
  }, [windowDimension])

  useEffect( () => {
    if (!loggedIn) {
      setMobileMenuIsVisible(false);
    }
  }, [loggedIn]);

  return (
    <>
      {
        loggedIn && mobileMenuIsVisible && windowDimension.winWidth < 500 &&
        (<NavBar
          loggedIn={loggedIn}
          email={email}
          onLogout={onLogout} />)
      }
      <header className="header">
        <img className="header__logo" src={logo} alt="Логотип Mesto"/>
        {
          !loggedIn && <div className="header__login">
            {
              !loggedIn &&
              (<Link to={signup ? "/sign-in" : "/sign-up"} className="header__link">
                { signup ? "Войти" : "Зарегистрироваться" }
              </Link>)
            }
          </div>
        }
        {
          loggedIn && windowDimension.winWidth > 500 &&
          (<NavBar
            loggedIn={loggedIn}
            email={email}
            onLogout={onLogout} />)
        }
        {
          loggedIn && windowDimension.winWidth < 500 &&
          (<button
            className={mobileMenuClassName}
            onClick={handleMobileMenu}
            src={ mobileMenuIsVisible ? closeMenu : burgerMenu } />)
        }
      </header>
    </>
  );
}

export default Header;

