import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import FilterBtn from '../components/FilterBtn';

import '../styles/doneRecipes.css';

const TYPES = ['All', 'Meals', 'Drinks'];

export default function DoneRecipes() {
  const doneRecipesLS = localStorage.getItem('doneRecipes');
  const doneRecipes = JSON.parse(doneRecipesLS);

  const [usedFilter, setUsedFilter] = useState('All');

  const clickToFilter = (type) => {
    setUsedFilter(type);
  };

  return (
    <div>
      <Header title="Done Recipes" />
      <section id="filters" className="filtersDoneRecepies">
        {
          TYPES.map((filterType, index) => (
            <FilterBtn
              key={ index }
              filterType={ filterType }
              usedFilter={ usedFilter }
              clickToFilter={ clickToFilter }
            />))
        }
      </section>
      {
        doneRecipesLS !== null && (
          <section id="cards">
            {
              usedFilter === 'Meals' && (
                doneRecipes
                  .filter((recipe) => recipe.type === 'meal')
                  .map((recipe, index) => (
                    <RecipeCard
                      title="Done Recipes"
                      key={ recipe.id }
                      recipeId={ recipe.id }
                      index={ index }
                      image={ recipe.image }
                      name={ recipe.name }
                      category={ recipe.category }
                      doneDate={ recipe.doneDate }
                      tags={ recipe.tags }
                      nationality={ recipe.nationality }
                      alcoholicOrNot={ recipe.alcoholicOrNot }
                      type={ recipe.type }
                    />
                  ))
              )
            }
            {
              usedFilter === 'Drinks' && (
                doneRecipes
                  .filter((recipe) => recipe.type === 'drink')
                  .map((recipe, index) => (
                    <RecipeCard
                      title="Done Recipes"
                      key={ recipe.id }
                      recipeId={ recipe.id }
                      index={ index }
                      image={ recipe.image }
                      name={ recipe.name }
                      category={ recipe.category }
                      doneDate={ recipe.doneDate }
                      tags={ recipe.tags }
                      nationality={ recipe.nationality }
                      alcoholicOrNot={ recipe.alcoholicOrNot }
                      type={ recipe.type }
                    />
                  ))
              )
            }
            {
              usedFilter === 'All' && (
                doneRecipes
                  .map((recipe, index) => (
                    <RecipeCard
                      title="Done Recipes"
                      key={ recipe.id }
                      recipeId={ recipe.id }
                      index={ index }
                      image={ recipe.image }
                      name={ recipe.name }
                      category={ recipe.category }
                      doneDate={ recipe.doneDate }
                      tags={ recipe.tags }
                      nationality={ recipe.nationality }
                      alcoholicOrNot={ recipe.alcoholicOrNot }
                      type={ recipe.type }
                    />
                  ))
              )
            }
          </section>
        )
      }
      {
        doneRecipesLS === null && (
          <div>
            <h6>You have not completed any recipe yet!</h6>
            <Link to="/meals">
              <span>
                Choose a recipe to make.
              </span>
            </Link>
          </div>
        )
      }
    </div>
  );
}
