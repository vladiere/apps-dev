
let itemsperpage = 10, curPage = 1, dataArr, newData = [], items = []
const parent = document.querySelector('#table_data'), root = document.querySelector('.paginate'), input = document.querySelector('.paginate #search'), searchData = document.querySelector('#searchData'), myTable = document.querySelector('#mytable'), forModal = document.querySelector('.for-modal'), setItemsPerPage = document.querySelector('#itemsperpage'), numberPages = document.querySelector('.paginate-pages')

let fetchedData = fetch('https://jsonplaceholder.typicode.com/comments')

setItemsPerPage.value = 10

const dataTable = function (data) {
  let output = ''

  data.forEach(item => {

    output +=   `<tr>
                  <td>${item.name}</td>
                  <td>${item.email}</td>
                  <td>${item.body}</td>
                  <td><button class="row-btn"></button></td>
                <tr>`
  }) 

  parent.innerHTML = output
  
}

const changeItemsPerPage = function () {

  setItemsPerPage.addEventListener('change', function () {
    
    itemsperpage = parseInt(setItemsPerPage.value)

      dataArr = rmrl.paginateList(items, itemsperpage, (res) => {
        refreshTable()
        dataTable(res)

        attachTweetButtonListeners();

      })
      numberPages.innerHTML = ''
      numberPages.appendChild(dataArr.renderPagination(curPage, itemsperpage))
  })
}

const refreshTable = function () {
  parent.innerHTML = ''
}

const clickedOnRow = function () {
  // Get all buttons from the row
  const rowbtns = document.querySelectorAll('row button.row-btn')

  // Loop through all buttons
  rowbtns.forEach(button => {
    // Attach a listener to the button
    button.addEventListener('click', function () {

      // Get the corresponding row using the button
      const row = button.closest('tr')
      // Get the row value
      const cells = row.querySelectorAll('td')
      const values = Array.from(cells).map(value => value.textContent)

      // Display the value
      console.log(values)

    })
  })
}

const searchItemData = function () {
  rmrl.on(searchData, 'click', function () {
    rmrl.search('https://jsonplaceholder.typicode.com/comments?email=', input.value, function (results) {
      refreshTable()
      dataTable(results)
    })
  })

  rmrl.on(input, 'input', function () {
    if (this.value === '') {
      dataArr = rmrl.paginateList(items, itemsperpage, (res) => {
        dataTable(res)
      })
    }
    newData = []
  })
}

const attachTweetButtonListeners = function () {
  // Get all the buttons in the table row
  const tweetButtons = document.querySelectorAll('#table_data button');
  tweetButtons.forEach(function (tweetButton) {
    // Attach a listener to the tweet button
    rmrl.on(tweetButton, 'click', function () {
      

      // Get the corresponding row
      const row = tweetButton.closest('tr');
      
      // Get the row value
      const cells = row.querySelectorAll('td')
      const values = Array.from(cells).map(cell => cell.textContent)
      // Creating a modal to show the content of row
      const options = {
          title: 'Tweets',
          closeButton: true,
          onOpen: () => console.log('Modal opened.'),
          onClose: () => console.log('Modal closed.'),
        }
      
      // Creating a dom string or html string
      const domString = `<div class="card-modal">
                          <h3>${values[0]}</h3>
                          <h4>${values[1]}</h4>
                          <p>${values[2]}</p>
                        </div>`
      const parser = new DOMParser()
      const doc = parser.parseFromString(domString, 'text/html')
      const bodyElement = doc.body
      
      const myModal = rmrl.modal(forModal, bodyElement, {
        title: 'Tweets',
        closeButton: true,
        width: '400px',
        height: '200px',
        onOpen: () => console.log('Modal opened.'),
        onClose: () => console.log('Modal closed.'),
      })
      myModal.open()
    });
  });
}

// Fetch the data from the server api 
fetchedData
    .then(response => response.json())
    .then(data => {
        dataArr = rmrl.paginateList(data, itemsperpage, (res) => {
          dataTable(res)

          attachTweetButtonListeners();
          changeItemsPerPage();
        })
        
        data.forEach(item => {
          newData.push(item.email);
        })
        
        items = data;
        rmrl.autoComplete(root, input, newData)
        numberPages.appendChild(dataArr.renderPagination(curPage, itemsperpage));
        
        searchItemData();
    })
    .catch(err => console.error(err))


    
