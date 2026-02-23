import View from './View';
import previewView from './previewView';

class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it ;)`;
  _message = ``;

  _generateMarkUP() {
    return this._data.map(rec => previewView.render(rec, false)).join(' ');
  }
}

export default new BookmarkView();
