import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the recieve recipe object to DOM  | Return new markup
   * @param {Object | Object[]} data - The data to be render (eg. a recipe)
   * @param {boolean} [render=true] - If false return makrup string instead of rendering to DOM
   * @returns {undefined|string} Returns string if renders is false
   * @this {Object} View Instance
   * @author Gagan
   * @todo Improve it
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkUP();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Update the current DOM where text and attributes has changed
   * @param {Object | Object[]} data - The data to be render (eg. a recipe)
   * @returns {undefined}
   * @this {Object} View Instance
   */
  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkUP();
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElement = [...newDOM.querySelectorAll('*')];
    const currentElement = [...this._parentElement.querySelectorAll('*')];

    newElement.forEach((newEl, i) => {
      const currentEl = currentElement[i];

      if (
        !newEl.isEqualNode(currentEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      )
        currentEl.textContent = newEl.textContent;

      if (!newEl.isEqualNode(currentEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          currentEl.setAttribute(attr.name, attr.value),
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    this._parentElement.innerHTML = `
        <div class="spinner">
        <svg>
        <use href="${icons}#icon-loader"></use>
        </svg>
        </div>
        `;
  }

  renderError(message = this._errorMessage) {
    const markup = `
              <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
              <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-smile"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
