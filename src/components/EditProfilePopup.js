import PopupWithForm from "./PopupWithForm";
import {useState, useEffect, useContext} from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";

function EditProfilePopup({isOpen, onClose, onUpdateUser}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const currentUser = useContext(CurrentUserContext);
  const [isValid, setIsValid] = useState(true);
  const [isValidName, setIsValidName] = useState(true);
  const [nameError, setNameError] = useState("");
  const [isValidDescription, setIsValidDescription] = useState(true);
  const [descriptionError, setDescriptionError] = useState("");
  const nameInputClassName = (`popup__item ${!isValidName && "popup__item-error_active"}`);
  const nameErrorClassName = (`popup__item-error ${!isValidName && "popup__item_type_error"}`);
  const descriptionInputClassName = (`popup__item ${!isValidDescription && "popup__item-error_active"}`);
  const descriptionErrorClassName = (`popup__item-error ${!isValidDescription && "popup__item_type_error"}`);

  function handleChange(event) {
    const input = event.target;
    const form = input.closest('.popup__form');
    if (input.name === "name") {
      setName(input.value);
      setIsValidName(input.validity.valid);
      setNameError(input.validationMessage);
    }
    if (input.name === "about") {
      setDescription(event.target.value);
      setIsValidDescription(input.validity.valid);
      setDescriptionError(input.validationMessage);
    }
    setIsValid(form.checkValidity());
  }

  function handleSubmit(event) {
    event.preventDefault();

    onUpdateUser({
      name,
      about: description
    });
  }

  useEffect(() => {
    if (isOpen) {
      setName(currentUser.name);
      setDescription(currentUser.about);
      setIsValid(true);
      setIsValidName(true);
      setIsValidDescription(true);
    }
  }, [currentUser, isOpen]);

  return (
    <PopupWithForm
      name="profile"
      title="Редактировать профиль"
      submitBtnText="Сохранить"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isValid={isValid}>
      <input
        id="profile-name"
        name="name"
        className={nameInputClassName}
        type="text"
        placeholder="Имя"
        minLength="2"
        maxLength="40"
        value={name}
        onChange={handleChange}
        required/>
      <span id="profile-name-error" className={nameErrorClassName}>{nameError}</span>
      <input
        id="profile-about"
        name="about"
        className={descriptionInputClassName}
        type="text"
        placeholder="О себе"
        minLength="2"
        maxLength="200"
        value={description}
        onChange={handleChange}
        required/>
      <span id="profile-about-error" className={descriptionErrorClassName}>{descriptionError}</span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;