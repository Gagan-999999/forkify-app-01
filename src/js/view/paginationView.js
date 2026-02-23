import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkUP() {
    const totalPages = Math.ceil(
      this._data.results.length / this._data.recipePerPage,
    );
    const currentPage = this._data.page;

    // 1. first page and more pages
    if (currentPage === 1 && totalPages > 1)
      return this._generateNextBtn(currentPage);

    // 2. last page
    if (currentPage === totalPages && currentPage > 1)
      return this._generatePreviousBtn(currentPage);

    // 3. middle page
    if (currentPage > 1) {
      return (
        this._generatePreviousBtn(currentPage) +
        this._generateNextBtn(currentPage)
      );
    }

    // 4. only one page
    return '';
  }

  addHandlerRender(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateNextBtn(currentPage) {
    return `
        <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right" ></use>
            </svg>
        </button>        
        `;
  }

  _generatePreviousBtn(currentPage) {
    return `
        <button data-goto="${currentPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
      `;
  }
}

export default new PaginationView();
