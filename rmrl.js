const rmrl = {

    // Get the id of the element
    $: function (id) {
        return document.getElementById(id);
    },

    // Create a new element
    create: function (element) {
        return document.createElement(element);
    },

    // Add a class to the element
    addClass: function (element, className) {
        if (element.classList) {
            element.classList.add(className);
        } else {
            element.className += ' ' + className;
        }
    },

    // Remove a class from an element
    removeClass: function (element, className) {
        if (element.classList) {
            element.classList.remove(className);
        } else {
            element.className = elemnent.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    },

    // Add event listeners to the element
    on: function (element, event, handler) {
        element.addEventListener(event, handler)
    },

    // Remove listeners for the specified element
    off: function (element, event, handler) {
        element.removeEventListener(event, handler)
    },

    // Append a new element to the DOM
    append: function (parent, ...element) {
       for (let i = 0; i < element.length; i++) {
            parent.appendChild(element[i])
       }
    },

    // Remove an element from the DOM
    remove: function (parent, element) {
        parent.removeChild(element)
    },

    paginateList: function(items, itemsPerPage, renderCallback) {
        let currentPage = 1;
        const totalPages = Math.ceil(items.length / itemsPerPage);
      
        function renderPage(page) {
          const start = (page - 1) * itemsPerPage;
          const end = start + itemsPerPage;
          const pageItems = items.slice(start, end);

          renderCallback(pageItems);
        }
      
        function goToPage(page) {
          if (page < 1) {
            page = 1;
          } else if (page > totalPages) {
            page = totalPages;
          }
          currentPage = page;
          renderPage(currentPage);
          checkCurrentPage()
        }
      
        function nextPage() {
          if (currentPage < totalPages) {
            currentPage += 1;
            goToPage(currentPage);
            checkCurrentPage()
          }
        }
      
        function prevPage() {
          
          if (currentPage > 1) {
            currentPage -= 1;
            goToPage(currentPage);
            checkCurrentPage()
          }
        }
      
        function renderPagination() {
          const paginationEl = rmrl.create('div');
          paginationEl.className = 'pagination';
      
          const prevBtn = rmrl.create('button');
          prevBtn.textContent = 'Prev';
          prevBtn.value = 'Prev';
          rmrl.on(prevBtn,'click', prevPage);
          rmrl.append(paginationEl,prevBtn);
      
          for (let i = 1; i <= totalPages; i++) {
            const pageBtn = rmrl.create('button');
            pageBtn.textContent = i;
            pageBtn.value = i
            if (i === currentPage) {
              pageBtn.className = 'active';
            }
            rmrl.on(pageBtn,'click', () => goToPage(i));
            rmrl.append(paginationEl, pageBtn);
          }
      
          const nextBtn = rmrl.create('button');
          nextBtn.textContent = 'Next';
          nextBtn.value = 'Next';
          rmrl.on(nextBtn, 'click', nextPage);
          rmrl.append(paginationEl, nextBtn);

          return paginationEl;
        }

        function checkCurrentPage () {
          const pageBtn = document.querySelectorAll('.pagination button')
          
          pageBtn.forEach(button => {
            rmrl.removeClass(button, 'active');
            if (button.value == currentPage) {
              rmrl.addClass(button, 'active')
            }
          })
        }
      
        renderPage(currentPage);
      
        return {
          goToPage,
          prevPage,
          nextPage,
          renderPagination,
        };
    },

    autoComplete: function(parent, input, data) {
        
        // Create an empty div for the autocomplete items
      const container = rmrl.create('div');
      container.setAttribute('class', 'autocomplete-items');
      parent.parentNode.appendChild(container);
    
      // Track the currently selected item
      let currentSelection = -1;
    
      // Close the autocomplete list
      function closeAutocomplete() {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        currentSelection = -1;
        
      }
    
      // Highlight the current selection
      function highlightSelection() {
        const items = container.childNodes;
        for (let i = 0; i < items.length; i++) {
          if (i === currentSelection) {
            items[i].classList.add('autocomplete-active');
          } else {
            items[i].classList.remove('autocomplete-active');
          }
        }
      }
    
      // When a key is pressed in the input field
      input.addEventListener('input', function() {
        // Close the previous autocomplete list
        closeAutocomplete();
        parent.style.display = 'block';

    
        // Get the current input value
        const inputVal = this.value.trim();
    
        // If the input is not empty, create a new list of autocomplete items
        if (inputVal) {
          const matches = data.filter(function(item) {
            return item.toUpperCase().indexOf(inputVal.toUpperCase()) === 0;
          });
          matches.forEach(function(match) {
            const item = rmrl.create('div');
            item.textContent = match;
            item.addEventListener('click', function() {
              input.value = match;
              closeAutocomplete();
            });
            container.appendChild(item);
          });
        }
      });
    
      // When an arrow key is pressed
      input.addEventListener('keydown', function(e) {
        const items = container.childNodes;
        if (items.length === 0) {
          return;
        }
        if (e.keyCode === 40) { // Arrow down
          currentSelection = (currentSelection + 1) % items.length;
          highlightSelection();
          e.preventDefault();
        } else if (e.keyCode === 38) { // Arrow up
          currentSelection = (currentSelection - 1 + items.length) % items.length;
          highlightSelection();
          e.preventDefault();
        } else if (e.keyCode === 13) { // Enter
          e.preventDefault();
          if (currentSelection >= 0 && currentSelection < items.length) {
            const selectedItem = items[currentSelection];
            input.value = selectedItem.textContent;
            closeAutocomplete();
          }
        }
      });
    
      // When the input field loses focus
      input.addEventListener('blur', function() {
        // Delay the closing of the autocomplete list to allow for click events on the list items
        
        setTimeout(closeAutocomplete, 100);
      });
  },

  modal: function (parentNode, content, options = {}) {
    const { 
        title = '',
        closeButton = true,
        tweetButton = true,
        cancelButton = true,
        onOpen = null,
        onClose = null,
    } = options;
    
    const modalEl = rmrl.create('div');
    modalEl.className = 'modal';

    const modalOverlay = rmrl.create('div');
    modalOverlay.className = 'modal-overlay';
    rmrl.on(modalOverlay, 'click', closeModal);
    rmrl.append(modalEl, modalOverlay);

    const modalContent = rmrl.create('div');
    modalContent.className = 'modal-content';
    rmrl.append(modalEl, modalContent);

    const modalHeader = rmrl.create('div')
    modalHeader.setAttribute('class', 'modal-header')

    if (title) {
      const modalTitle = rmrl.create('div');
      modalTitle.className = 'modal-title';
      modalTitle.textContent = title;
      rmrl.append(modalHeader, modalTitle);
    }

    if (closeButton) {
      const closeBtn = rmrl.create('button');
      closeBtn.className = 'modal-close';
      closeBtn.textContent = 'X';
      rmrl.on(closeBtn, 'click', closeModal);
      rmrl.append(modalHeader, closeBtn);
    }
    
    rmrl.append(modalContent, modalHeader)
    rmrl.append(modalContent, content);

    const modalFooter = rmrl.create('div')
    modalFooter.setAttribute('class', 'modal-footer')

    if (tweetButton) {
      const closeBtn = rmrl.create('button');
      closeBtn.className = 'modal-tweet';
      closeBtn.textContent = 'Share to Twitter';
      rmrl.on(closeBtn, 'click', closeModal);
      rmrl.append(modalFooter, closeBtn);
    }

    
    if (cancelButton) {
      const closeBtn = rmrl.create('button');
      closeBtn.className = 'modal-cancel';
      closeBtn.textContent = 'Cancel';
      rmrl.on(closeBtn, 'click', closeModal);
      rmrl.append(modalFooter, closeBtn);
    }
    
    rmrl.append(modalContent, modalFooter)

    function openModal() {
      
      parentNode.innerHTML = '';

      rmrl.append(parentNode, modalEl);

      if (onOpen) {
        onOpen();
      }
    }

    function closeModal() {
      modalEl.remove();

      if (onClose) {
        onClose();
      }

      // Remove event listener for outside clicks when modal is closed
      rmrl.off(modalOverlay, 'click', handleOutsideClick);
      currentModal = null
    }

    function handleOutsideClick(e) {
      if (!modalContent.contains(e.target)) {
        closeModal();
      }
    }

    return {
      open: openModal,
      close: closeModal,
    };
  },

  search: function (url, query, callback) {
    const uri = url + encodeURIComponent(query)

    fetch(uri)
        .then(res => res.json())
        .then(data => callback(data))
        .catch(err => console.error(err))
  },

  clickOnRow: function (table, callback) {
    const rows = table.tBodies[0].querySelectorAll('tr');
    for (let i = 0; i < rows.length; i++) {
      rows[i].addEventListener('click', function() {
        const cells = this.cells;
        const rowData = [];
        for (let j = 0; j < cells.length; j++) {
          rowData.push(cells[j].textContent.trim());
        }
        callback(rowData);
      });
    }
  }
}