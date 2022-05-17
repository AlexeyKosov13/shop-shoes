import React from "react";
import { HashRouter, Route } from "react-router-dom";
import axios from "axios";

import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Orders from "./pages/Orders";
import Header from "./components/Header";
import Drawer from "./components/Drawer/";
import AppContext from "./context";

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const itemsResponse = await axios.get(
          "https://62041896c6d8b20017dc3427.mockapi.io/Items"
        );
        const cartResponse = await axios.get(
          "https://62041896c6d8b20017dc3427.mockapi.io/Cart"
        );
        const favoritesResponse = await axios.get(
          "https://62041896c6d8b20017dc3427.mockapi.io/favorites"
        );
        setIsLoading(false);

        setCartItems(cartResponse.data);
        setFavorites(favoritesResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        alert("Ошибка при запросе данных");
      }
    }

    fetchData();
  }, []);

  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find((item) => Number(item.parentId) === Number(obj.id));
      if (findItem) {
        setCartItems((prev) =>
          prev.filter((item) => Number(item.parentId) !== Number(obj.id))
        );
        await axios.delete(
          `https://62041896c6d8b20017dc3427.mockapi.io/Cart/${findItem.id}`
        );
      } else {  
        
        const {data} = await axios.post(
          "https://62041896c6d8b20017dc3427.mockapi.io/Cart",
          obj
        );
        setCartItems((prev) => [...prev, data]);
      }
    } catch (error) {
      alert("Ошибка при добавлении в корзину");
    }
  };

  const onAddToFavorites = async (obj) => {
    try {
      if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
        axios.delete(
          `https://62041896c6d8b20017dc3427.mockapi.io/favorites/${obj.id}`
        );
        setFavorites((prev) =>
          prev.filter((item) => Number(item.id) !== Number(obj.id))
        );
      } else {
        const { data } = await axios.post(
          "https://62041896c6d8b20017dc3427.mockapi.io/favorites",
          obj
        );
        setFavorites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert("Не удалось добавить");
    }
  };

  const onRemoveItem = (id) => {
    try {
      axios.delete(`https://62041896c6d8b20017dc3427.mockapi.io/Cart/${id}`);
      setCartItems((prev) =>
        prev.filter((item) => Number(item.id) !== Number(id))
      );
    } catch (error) {
      alert("Ошибка при удалении из корзины");
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id));
  };

  return (
    <HashRouter>
        <AppContext.Provider
        value={{
          items,
          cartItems,
          favorites,
          isItemAdded,
          onAddToCart,
          onAddToFavorites,
          setCartOpened,
          setCartItems,
        }}
      >
        <div className="wrapper">
          <Drawer
            items={cartItems}
            onRemove={onRemoveItem}
            onClose={() => setCartOpened(false)}
            opened={cartOpened}
          />
          <Header onClickCart={() => setCartOpened(true)} />

          <Route path="/" exact>
            <Home
              items={items}
              cartItems={cartItems}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onChangeSearchInput={onChangeSearchInput}
              onAddToFavorites={onAddToFavorites}
              onAddToCart={onAddToCart}
              isLoading={isLoading}
            />
          </Route>

          <Route path="/favorites" exact>
            <Favorites />
          </Route>

          <Route path="/orders" exact>
            <Orders />
          </Route>
        </div>
      </AppContext.Provider>
    </HashRouter>
    
  );
}

export default App;