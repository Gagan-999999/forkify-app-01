import { getJSON, sendJSON } from './helper';
import { API_URL, REC_PER_PAGE, KEY } from './config';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    recipePerPage: REC_PER_PAGE,
  },
  bookmarks: [],
};

function createRecipeObjec(data) {
  const { recipe } = data.data;

  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
}

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}?key=${KEY}`);
    const recipe = createRecipeObjec(data);
    recipe.bookmarked = state.bookmarks.some(book => book.id === recipe.id)
      ? true
      : false;

    state.recipe = recipe;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });

    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export function getSearchResultPage(page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * REC_PER_PAGE;
  const end = page * REC_PER_PAGE;

  return state.search.results.slice(start, end);
}

export function updateServings(newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * (newServings / state.recipe.servings);
  });
  state.recipe.servings = newServings;
}

export function addBookmark(recipe) {
  state.bookmarks.push(recipe);
  persistBookmarks();

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
}

export function deleteBookmark(id) {
  const index = state.bookmarks.findIndex(mark => mark.id === id);
  state.bookmarks.splice(index, 1);
  persistBookmarks();

  if (id === state.recipe.id) state.recipe.bookmarked = false;
}

function persistBookmarks() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

function init() {
  const data = localStorage.getItem('bookmarks');
  if (!data) return;
  state.bookmarks = JSON.parse(data);
}

export async function uploadRecipe(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(([key, value]) => key.startsWith('ingredient') && value !== '')
      .map(([_, ing]) => {
        const [quantity, unit, description] = ing.split(',').map(x => x.trim());
        if (ing.split(',').length !== 3)
          throw new Error('Wrong ingredient format');
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
      ingredients,
    };

    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);

    state.recipe = createRecipeObjec(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
}

function clear() {
  localStorage.clear();
}
// clear();

init();
