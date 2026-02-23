import View from './View';
import previewView from './previewView';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipies found for your query! Please try again.`;
  _message = ``;

  _generateMarkUP() {
    return this._data.map(rec => previewView.render(rec, false)).join(' ');
  }
}

export default new ResultView();
