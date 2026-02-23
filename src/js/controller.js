import * as model from './model.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultView from './view/resultView.js';
import paginationView from './view/paginationView.js';
import bookmarkView from './view/bookmarkView.js';
import addRecipeView from './view/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controlRecipe = async function () {
  try {
    // Getting current Hash Id of page
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Render Spinner
    recipeView.renderSpinner();

    // fetching Recipe
    await model.loadRecipe(id);

    // update preview selection
    resultView.update(model.getSearchResultPage());
    bookmarkView.update(model.state.bookmarks);

    // render Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 0. Getting query
    const query = searchView.getQuery();
    if (!query) return;

    // 1. Render Spinner
    resultView.renderSpinner();

    // 2. Loading search results
    await model.loadSearchResults(query);

    // 3. Render data
    resultView.render(model.getSearchResultPage());

    // 4. Render Pagination
    paginationView.render(model.state.search);
  } catch (err) {
    throw err;
  }
};

const controlPagination = function (page) {
  // 1. Render New results
  resultView.render(model.getSearchResultPage(page));

  // 2. Render New Pagination
  paginationView.render(model.state.search);
};

const controlServings = function (updateTo) {
  // 1. Update state
  model.updateServings(updateTo);

  // 2. Render new Servings
  recipeView.update(model.state.recipe);
};

const controlBookmarkBtn = function () {
  // 1. update state
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. update btn view
  recipeView.update(model.state.recipe);

  // 3. update bookmark view
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // redner spinner
    addRecipeView.renderSpinner();

    // POST data
    await model.uploadRecipe(newRecipe);

    // update URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Render Bookmark
    bookmarkView.render(model.state.bookmarks);

    // show success
    addRecipeView.renderMessage('Recipe Uploaded Successfully');
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

function init() {
  bookmarkView.render(model.state.bookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlBookmarkBtn);
  searchView.addHandlerRender(controlSearchResults);
  paginationView.addHandlerRender(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();
