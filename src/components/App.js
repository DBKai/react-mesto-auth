import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { api } from "../utils/api";
import CurrentUserContext from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import DeleteConfirmationPopup from "./DeleteConfirmationPopup";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isConfirmationDeletePopupOpen, setIsConfirmationDeletePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [willBeDeletedCard, setWillBeDeletedCard] = useState(0);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [registeredIn, setRegisteredIn] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsConfirmationDeletePopupOpen(false);
    setSelectedCard({});
    setWillBeDeletedCard(0);
  }

  function handleCardClick(clickedCard) {
    setSelectedCard(clickedCard)
  }

  function handleUpdateUser({name, about}) {
    api.setUserInfo({name, about})
      .then(res => {
        setCurrentUser({
          name: res.name,
          about: res.about,
          avatar: res.avatar
        });
        closeAllPopups();
      })
      .catch(err => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleUpdateAvatar({avatar}) {
    api.setUserAvatar(avatar)
      .then(user => {
        setCurrentUser({
          name: user.name,
          about: user.about,
          avatar: user.avatar
        });
        closeAllPopups();
      })
      .catch(err => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(err => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleDeleteCardClick(card) {
    setWillBeDeletedCard(card._id);
    setIsConfirmationDeletePopupOpen(true);
  }

  function handleCardDelete(cardId) {
    api.deleteCard(cardId)
      .then(() => {
        setCards((state) => state.filter(c => c._id !== cardId));
        closeAllPopups();
      })
      .catch(err => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleAddPlaceSubmit({name, link}) {
    api.addCard({name, link})
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(err => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleOnLogin() {

  }

  function handleOnRegister() {

  }

  useEffect(() => {
    function handleEscClose(event) {
      if (event.key === "Escape") {
        closeAllPopups();
      }
    }

    Promise.all([api.getUserInfo(), api.getCards()])
      .then(([user, cards]) => {
        setCurrentUser({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar
        });
        setCards(cards);
      })
      .catch(err => {
        console.log(`Ошибка: ${err}`);
      });

    document.addEventListener('keyup', handleEscClose);

    return () => {
      document.removeEventListener('keyup', handleEscClose);
    };
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header/>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <Main
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleDeleteCardClick}
                cards={cards}/>
              <Footer/>
            </ProtectedRoute>
          }
        />
        <Route path="/sign-in" element={<Login onLogin={handleOnLogin}/>}/>
        <Route path="/sign-up" element={<Register onRegister={handleOnRegister}/>}/>
      </Routes>
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}/>
      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}/>
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}/>
      <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
      <DeleteConfirmationPopup
        isOpen={isConfirmationDeletePopupOpen}
        onClose={closeAllPopups}
        handleCardDelete={handleCardDelete}
        willBeDeletedCard={willBeDeletedCard}/>
      <InfoTooltip
        isSuccess={registeredIn}
        isOpen={isInfoTooltipPopupOpen}
        onClose={closeAllPopups} />
    </CurrentUserContext.Provider>
  );
}

export default App;
