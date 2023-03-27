import clipboardCopy from 'clipboard-copy';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import shareIcon from '../images/shareIcon.svg';
import '../styles/favoriteRecipes.css';

export default function FavoriteRecipes() {
  const [doneRecipes, setDoneRecipes] = useState([]);
  const [copy, setCopy] = useState(false);

  const getRecipesLocalStore = () => {
    const doneRecipesLS = JSON.parse(localStorage.getItem('favoriteRecipes'));
    setDoneRecipes(doneRecipesLS);
  };

  useEffect(() => {
    getRecipesLocalStore();
  }, []);

  const handleClickFavorite = (id) => {
    const unFavRecipes = doneRecipes.filter((reciepe) => reciepe.id !== id);
    localStorage.setItem('favoriteRecipes', JSON.stringify(unFavRecipes));

    getRecipesLocalStore();

    setDoneRecipes(unFavRecipes);
  };

  const magicNum = 1000;

  const handleClickShare = (type, id) => {
    setCopy(true);
    setTimeout(() => setCopy(false), magicNum);
    clipboardCopy(`http://localhost:3000/${type}s/${id}`);
  };

  const handleClickAll = () => {
    getRecipesLocalStore();
  };

  const handleClickMeal = () => {
    const favMeal = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const newFavMeal = favMeal.filter((recipe) => recipe.type === 'meal');
    setDoneRecipes(newFavMeal);
  };

  const handleClickDrink = () => {
    const favDrink = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const newFavDrink = favDrink.filter((recipe) => recipe.type === 'drink');
    setDoneRecipes(newFavDrink);
  };

  return (
    <div>
      <Header title="Favorite Recipes" />

      <div className="filtersFavoriteRecipes">
        <button
          type="button"
          data-testid="filter-by-all-btn"
          onClick={ handleClickAll }
        >
          All
        </button>

        <button
          type="button"
          data-testid="filter-by-meal-btn"
          onClick={ handleClickMeal }
        >
          Meals
        </button>

        <button
          type="button"
          data-testid="filter-by-drink-btn"
          onClick={ handleClickDrink }
        >
          Drinks
        </button>
      </div>

      <div className="favoriteRecipesContainer">
        {
          doneRecipes
        && doneRecipes.map((reciepe, i) => (
          <div key={ i } className="cardContainerFav">
            <Link to={ `${reciepe.type}s/${reciepe.id}` }>
              <img
                className="cardImgFav"
                style={ { width: '150px' } }
                src={ reciepe.image }
                alt="imagem do prato"
                data-testid={ `${i}-horizontal-image` }
              />

              <h3
                data-testid={ `${i}-horizontal-name` }
              >
                {reciepe.name}
              </h3>
            </Link>

            {
              reciepe.type === 'drink' ? (
                <p
                  data-testid={ `${i}-horizontal-top-text` }
                >
                  {reciepe.alcoholicOrNot}
                </p>
              )
                : (
                  <p
                    data-testid={ `${i}-horizontal-top-text` }
                  >
                    {reciepe.nationality}
                    {' - '}
                    {reciepe.category}
                  </p>
                )
            }
            <div className="buttonContainerFav">
              <button
                type="button"
                onClick={ () => handleClickShare(reciepe.type, reciepe.id) }
              >
                <img
                  src={ shareIcon }
                  alt="compartilhar"
                  data-testid={ `${i}-horizontal-share-btn` }
                />
                {copy && <p>Link copied!</p>}
              </button>

              <button
                type="button"
                onClick={ () => handleClickFavorite(reciepe.id) }
              >
                <img
                  src={ blackHeartIcon }
                  alt="favoritos"
                  data-testid={ `${i}-horizontal-favorite-btn` }
                />
              </button>
            </div>
          </div>
        ))
        }
      </div>
    </div>
  );
}
