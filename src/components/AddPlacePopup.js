import PopupWithForm from "./PopupWithForm";
import {useState, useEffect} from "react";

function AddPlacePopup({isOpen, onClose, onAddPlace}) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isValidName, setIsValidName] = useState(true);
  const [nameError, setNameError] = useState("");
  const [isValidLink, setIsValidLink] = useState(true);
  const [linkError, setLinkError] = useState("");
  const nameInputClassName = (`popup__item ${!isValidName && "popup__item-error_active"}`);
  const nameErrorClassName = (`popup__item-error ${!isValidName && "popup__item_type_error"}`);
  const linkInputClassName = (`popup__item ${!isValidLink && "popup__item-error_active"}`);
  const linkErrorClassName = (`popup__item-error ${!isValidLink && "popup__item_type_error"}`);

  function handleChange(event) {
    const input = event.target;
    const form = input.closest('.popup__form');
    if (input.name === "name") {
      setName(input.value);
      setIsValidName(input.validity.valid);
      setNameError(input.validationMessage);
    }
    if (input.name === "link") {
      setLink(event.target.value);
      setIsValidLink(input.validity.valid);
      setLinkError(input.validationMessage);
    }
    setIsValid(form.checkValidity());
  }

  function handleSubmit(event) {
    event.preventDefault();

    onAddPlace({
      name: name,
      link: link
    });
  }

  useEffect(() => {
    if (isOpen) {
      setName("");
      setLink("");
      setIsValid(false);
      setIsValidName(true);
      setIsValidLink(true);
    }
  }, [isOpen])

  return (
    <PopupWithForm
      name="card"
      title="Новое место"
      submitBtnText="Создать"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isValid={isValid}>
      <input
        id="card-name"
        name="name"
        className={nameInputClassName}
        type="text"
        placeholder="Название"
        minLength="2"
        maxLength="30"
        value={name}
        onChange={handleChange}
        required/>
      <span id="card-name-error" className={nameErrorClassName}>{nameError}</span>
      <input
        id="card-link"
        name="link"
        className={linkInputClassName}
        type="url"
        placeholder="Ссылка на картинку"
        value={link}
        onChange={handleChange}
        required/>
      <span id="card-link-error" className={linkErrorClassName}>{linkError}</span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;