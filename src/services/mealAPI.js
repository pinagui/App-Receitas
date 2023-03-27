import { parseJSONResponse } from '../helpers';

const baseUrl = 'https://www.themealdb.com/api/json/v1/1/';

const messages = {
  notFound: 'Sorry, we haven\'t found any recipes for these filters.',
  invalidSearchInput: 'Your search must have only 1 (one) character',
};

export const fetchByIngredient = async (searchInput) => {
  const response = await fetch(`${baseUrl}filter.php?i=${searchInput}`);

  const { meals } = await parseJSONResponse(response, []);
  if (!meals || meals.length === 0) {
    global.alert(messages.notFound);
  }
  return meals || [];
};

export const fetchByName = async (searchInput) => {
  const response = await fetch(`${baseUrl}search.php?s=${searchInput}`);

  const { meals } = await parseJSONResponse(response, []);
  if (!meals || meals.length === 0) {
    global.alert(messages.notFound);
  }
  return meals || [];
};

export const fetchByFirstLetter = async (searchInput) => {
  const response = await fetch(`${baseUrl}search.php?f=${searchInput}`);

  const { meals } = await parseJSONResponse(response, []);
  if (!meals || meals.length === 0) {
    global.alert(messages.notFound);
  }
  return meals || [];
};

export const fetchMealsById = async (id) => {
  const response = await fetch(`${baseUrl}lookup.php?i=${id}`);

  const { meals } = await parseJSONResponse(response, []);
  if (!meals || meals.length === 0) {
    global.alert(messages.notFound);
  }
  return meals || [];
};

export const fetchByType = async (searchType, searchInput) => {
  switch (searchType) {
  case 'ingredient':
    return fetchByIngredient(searchInput);

  case 'name':
    return fetchByName(searchInput);

  case 'first-letter':
    if (searchInput.length > 1) {
      global.alert(messages.invalidSearchInput);
      return [];
    }
    return fetchByFirstLetter(searchInput);

  case 'id':
    return fetchMealsById(searchInput);

  default:
    break;
  }
};

export const fetchMeals = async () => {
  const response = await fetch(`${baseUrl}search.php?s=`);
  const { meals } = await response.json();
  return meals;
};

export const fetchMealsCategories = async () => {
  const response = await fetch(`${baseUrl}list.php?c=list`);
  const { meals } = await response.json();
  return meals;
};

export const fetchMealsByCategory = async (category) => {
  const response = await fetch(`${baseUrl}filter.php?c=${category}`);
  const { meals } = await response.json();
  return meals;
};
