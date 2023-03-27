import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { require } from 'clipboard-copy';
import { readObject, saveObject } from '../helpers/localStorage';
import { fetchByType as fetchMealByID } from '../services/mealAPI';
import { fetchByType as fetchDrinkByID } from '../services/cockTailAPI';
import useLocalStorage from '../hooks/useLocalStorage';
import whiteHeart from '../images/whiteHeartIcon.svg';
import blackHeart from '../images/blackHeartIcon.svg';
import {
  callIngredients,
  handleFinishRecipeBtnHelper,
  newRecipe as newRecipeHelper,
} from '../helpers/helpers_recipe_in_progess';
import '../styles/recipesInProgress.css';

function RecipeInProgress() {
  const history = useHistory();
  const { id } = useParams();
  const location = useLocation();
  const path = location.pathname;
  const typeOfUrl = path.split('/')[1];
  const [checked, setChecked] = useState({});
  const [meals, setMeals] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [copyLink, setCopyLink] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [favoriteRecipes, setFavoriteRecipes] = useLocalStorage('favoriteRecipes', []);
  const magicNum = {
    one: -1,
    three: 3,
    thousand: 1000,
  };

  useEffect(() => {
    const localStorageGet = readObject('inProgressRecipes', {});
    setChecked(localStorageGet);
  }, []);

  useEffect(() => {
    let fetchByID;
    if (typeOfUrl === 'meals') {
      fetchByID = async () => {
        fetchMealByID('id', id).then((data) => setMeals(data[0]));
      };
    } else {
      fetchByID = async () => {
        fetchDrinkByID('id', id).then((data) => setDrinks(data[0]));
      };
    }
    fetchByID();
  }, [id]);

  const newRecipe = newRecipeHelper(meals, drinks, typeOfUrl, magicNum);

  useEffect(() => {
    const verifyRecipe = favoriteRecipes.some((recipes) => recipes.id === newRecipe.id);
    if (verifyRecipe) setFavorite(true);
  }, [meals, drinks]);

  const copyToClipboard = (idParam) => {
    const copy = require('clipboard-copy');
    const url = `http://localhost:3000/${typeOfUrl}/${idParam}`;
    copy(url);
    setCopyLink(true);
    setTimeout(() => setCopyLink(false), magicNum.thousand);
  };

  const isChecked = (ingredient) => {
    try {
      if (checked[typeOfUrl][id]?.includes(ingredient)) {
        return true;
      }
    } catch (error) {
      return false;
    }
  };

  const handleChecked = (event) => {
    if (!checked[typeOfUrl]) checked[typeOfUrl] = {};

    const ingredient = event.target.value;
    const checkedList = checked[typeOfUrl][id] || [];
    if (!isChecked(ingredient)) {
      setChecked({
        ...checked,
        [typeOfUrl]: {
          ...checked[typeOfUrl],
          [id]: [...checkedList, ingredient],
        },
      });
    } else {
      setChecked({
        ...checked,
        [typeOfUrl]: {
          ...checked[typeOfUrl],
          [id]: checkedList.filter((item) => item !== ingredient),
        },
      });
    }
  };

  const checkDisabledBtn = () => {
    let ingredients = [];
    if (typeOfUrl === 'meals') {
      const callMeals = callIngredients(meals, undefined, isChecked, handleChecked);
      ingredients = [...callMeals];
    } else {
      const callDrinks = callIngredients(undefined, drinks, isChecked, handleChecked);
      ingredients = [...callDrinks];
    }
    try {
      if (checked[typeOfUrl][id].length === ingredients.length) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    } catch (error) {
      setIsDisabled(true);
    }
  };
  const favoriteRecipe = () => {
    if (favorite === false) {
      setFavoriteRecipes([...favoriteRecipes, newRecipe]);
      return setFavorite(true);
    }
    const removeRecipe = favoriteRecipes.filter((recipes) => recipes.id !== newRecipe.id);
    setFavoriteRecipes([...removeRecipe]);
    return setFavorite(false);
  };
  useEffect(() => {
    saveObject('inProgressRecipes', checked);
    checkDisabledBtn();
  }, [checked]);

  const handleFinishRecipeBtn = () => {
    handleFinishRecipeBtnHelper(meals, drinks, typeOfUrl);
    history.push('/done-recipes');
  };

  return (
    <div>
      {meals.length === 0 ? null : (
        <div className="RIPContainer">
          <h2
            data-testid="recipe-title"
            className="titleRIP"
          >
            {`Recipe in Progress: ${meals.strMeal}`}
          </h2>
          <img
            className="imageRIP"
            data-testid="recipe-photo"
            src={ meals.strMealThumb }
            alt={ meals.strMeal }
          />
          <div>
            <button
              type="button"
              data-testid="share-btn"
              onClick={ () => copyToClipboard(id) }
            >
              Share
            </button>
            <button
              type="button"
              onClick={ () => favoriteRecipe() }
            >
              <img
                data-testid="favorite-btn"
                src={ favorite ? blackHeart : whiteHeart }
                alt="share"
                width="26px"
              />
            </button>
            <button
              type="button"
              data-testid="finish-recipe-btn"
              disabled={ isDisabled }
              onClick={ handleFinishRecipeBtn }
            >
              Finish Recipe
            </button>
          </div>
          {copyLink && <span>Link copied!</span>}
          <h3 data-testid="recipe-category">{meals.strCategory}</h3>
          <div className="ingredientsNinstructionsRIP">
            <ul>{callIngredients(meals, undefined, isChecked, handleChecked)}</ul>
            <h5 data-testid="instructions">{meals.strInstructions}</h5>
          </div>
        </div>
      )}
      {drinks.length === 0 ? null : (
        <div className="RIPContainer">
          <h2
            data-testid="recipe-title"
            className="titleRIP"
          >
            {`Recipe in Progress: ${drinks.strDrink}`}

          </h2>
          <img
            className="imageRIP"
            data-testid="recipe-photo"
            src={ drinks.strDrinkThumb }
            alt={ drinks.strDrink }
          />
          <div>
            <button
              type="button"
              data-testid="share-btn"
              onClick={ () => copyToClipboard(id) }
            >
              Share
            </button>
            <button
              type="button"
              onClick={ () => favoriteRecipe() }
            >
              <img
                data-testid="favorite-btn"
                src={ favorite ? blackHeart : whiteHeart }
                alt="share"
              />
            </button>
            <button
              type="button"
              data-testid="finish-recipe-btn"
              onClick={ handleFinishRecipeBtn }
              disabled={ isDisabled }
            >
              Finish Recipe
            </button>
          </div>
          {copyLink && <span>Link copied!</span>}
          <h3 data-testid="recipe-category">{drinks.strAlcoholic}</h3>
          <div className="ingredientsNinstructionsRIP">
            <ul>{callIngredients(undefined, drinks, isChecked, handleChecked)}</ul>
            <h5 data-testid="instructions">{drinks.strInstructions}</h5>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeInProgress;
