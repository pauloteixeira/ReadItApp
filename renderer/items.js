// Track items with array
exports.toreadItems = JSON.parse(localStorage.getItem('toreadItems')) || []

// Save items to localstorage
exports.saveItems = () => {
    localStorage.setItem('toreadItems', JSON.stringify(this.toreadItems))
}

window.openInBrowser = () => {
    // Modules
    let {shell} = require('electron')

    // Only if items exists
    if( !this.toreadItems.length ) return

    // Get selected item
    let targetItem = $('.read-item.is-active')

    // Open in browser
    shell.openExternal( targetItem.data('url') )
}

window.deleteItems = (e = false) => {
    let nameItem = null
    // Set item if not passed
    nameItem = (false === e) ? '.read-item.is-active>button' : e.currentTarget
    
    // Set item index
    let selectIndex = $(nameItem).data('index')

    // Remove item from DOM
    $('.read-item').eq(selectIndex).remove()

    // Remove from toreadItems array
    this.toreadItems = this.toreadItems.filter((item, index) => {
        return index !== selectIndex
    })

    // Update storage
    this.saveItems()

    // Select prev item or none if list empty
    if( this.toreadItems.length ) {
        // Clear the read-list
        $('#read-list').empty();

        // Add existents items
        this.toreadItems.forEach( (this.addItem) )
        
        // If first item was deleted, select new first item in list, else previous item
        let newIndex = (selectIndex === 0) ? 0 : selectIndex -1

        // Assign active class to new index
        $('.read-item').eq(newIndex).addClass('is-active')

        return
    } 

    $('#no-items').show('slow')
}

// Toggle item as selected
exports.selectItem = (e) => {
    $('.read-item').removeClass('is-active')
    $(e.currentTarget).addClass('is-active')
}

// Se,ect next/preview item
exports.changeItem = (direction) => {
    // Get current active item
    let activeItem = $('.read-item.is-active')

    // Check directions and get next or previous read-item
    let newItem = (direction === 'down') ? activeItem.next('.read-item') : activeItem.prev('.read-item')

    // Only if item exists, make selection change
    if(newItem.length) {
        activeItem.removeClass('is-active')
        newItem.addClass('is-active')
    } 
}

// Open item for reading
window.openItem = () => {
    // Only if items have been added
    if(!this.toreadItems.length) return


    // Get selected item
    let targetItem = $('.read-item.is-active')

    // Get item's content URL (encoded)
    let contentURL = encodeURIComponent(targetItem.data('url'))

    // Set item index
    let itemIndex = targetItem.index() - 1

    // Reader Window URL
    let readerWinURL = `file://${__dirname}/reader.html?url=${contentURL}&itemIndex=${itemIndex}`

    // Open item in new proxy BrowserWindow
    let readerWin = window.open(readerWinURL, targetItem.data('title'))
}

// Add new items
exports.addItem = (item, index) => {
    // Hide 'no items' message
    $('#no-items').hide('slow')

    // New item html
    let itemHTML = `<a class="panel-block read-item" data-url="${item.url}" data-title="${item.title}">
                        <figure class="image has-shadown is-64x64 thumb">
                            <img src="${item.screenshot}">
                        </figure>
                        <h2 class="title is-4 column">${item.title}</h2>
                        <button class="button is-danger delete-button" data-index="${index}"><i class="fa fa-trash"></i></button>
                    </a>`

    // Append to read-list
    $('#read-list').append(itemHTML)

    // Attach select event handler
    $('.read-item').off('click, dblclick')
                    .on('click', this.selectItem)
                    .on('dblclick', window.openItem)

    // Listener delete button
    $('.delete-button').off('click').on('click', window.deleteItems)
}