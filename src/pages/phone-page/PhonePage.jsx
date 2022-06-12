import React from "react";
import { useSelector } from "react-redux";
import Tabs from "../../components/Tabs";
import AppContext from "../../context";

import styles from "./PhonePage.module.scss";

function PhonePage() {
  const { cartItems } = React.useContext(AppContext);
  const { onAddToFavorites } = React.useContext(AppContext);
  const { isFavoritAdded } = React.useContext(AppContext);
  const { onAddToCart } = React.useContext(AppContext);
  const { isItemAdded } = React.useContext(AppContext);
  const { isFavorite, setIsFavorite} = React.useContext(AppContext);

  const phone = useSelector((state) => state.phone.currentPhone);

  const onClickPlus = () => {
    onAddToCart(phone);
    isItemAdded(phone.id);
  };

  const onClickFavorite = () => {
    onAddToFavorites(phone);
  };

  const sumItem = (phone) => {
    let total = 0;
    cartItems.map((item) => {
      if (item.parentId === phone.parentId) {
        total++;
      }
    });
    return total;
  };

  return (
    <div className={styles.phone}>
      <div className={styles.block}>
        <div className="phone__blockTitle">
          <h2 className={styles.phone__title}>{phone.name}</h2>
          <div className={styles.phone__favorite}>
          <img src={isFavoritAdded(phone.parentId)? "img/heart__liked.svg"
                      : "img/heart__unliked.svg"}
                  alt="favorite"
                  onClick={onClickFavorite}
                />
            </div>
        </div>
        

        <div className={styles.phone__block}>
          <div className={styles.phone__img}>
            <img src={phone.imageUrl} alt={phone.name} />
          </div>
          <div className={styles.phone__descr}>
            <div className={styles.raiting}>
              <img src="img/star.svg" alt="star" />
              {phone.raiting}
            </div>
            <p>
              <span>Тип экрана:</span> {phone.display}
            </p>
            <p>
              <span>Диагональ:</span> {phone.diagonal}
            </p>
            <p>
              <span>Стандарт:</span> {phone.standart}
            </p>
            <p>
              <span>Основные (тыловые) камеры:</span> {phone.cameras}
            </p>
            <p>
              <span>Емкость аккумулятора: </span>
              {phone.acc}
            </p>
          </div>
          <div className={styles.phone__price}>
            {phone.price} руб.
            <button onClick={onClickPlus}>Купить</button>
            <p>
              {isItemAdded(phone.parentId)
                ? `в корзине ${sumItem(phone)}`
                : null}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.phone__about}>
        <Tabs phone={phone} />
      </div>
    </div>
  );
}

export default PhonePage;
