// Modules
const {ipcRenderer} = require('electron')
const items = require('./items.js')
const menu = require('./menu.js')

// Navigate selected item with up/down keys
$(document).keydown((e) => {
    switch (e.key) {
        case 'ArrowUp':
            items.changeItem('up')
            break;
    
        case 'ArrowDown':
            items.changeItem('down')
            break;
    }
})

// show add-modal
$('.open-add-modal').click(() => {
    $('#add-modal').addClass('is-active')
    $('#item-input').focus()
})

$('.close-add-modal').click(() => {
    $('#add-modal').removeClass('is-active')
})

// handle add-modal submission
$('#add-button').click(() => {
    // Get URL from input
    let newItemURL = $('#item-input').val()

    if( !validateURL(newItemURL.toString() ) ) {
        alert("Please send a valid site adress.")
        return;
    }

    if( newItemURL ) {
        // Disabled modal UI
        $('#item-input').prop('disabled', true)
        $('#add-button').addClass('is-loading')
        $('.close-add-modal').addClass('is-disabled')

        // Send URL to main process via IPC
        ipcRenderer.send('new-item', newItemURL)
    }
})

let validateURL = (url) => {
    return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(url);
}

ipcRenderer.on('new-item-success', (e, item) => {
    // Module
    let {nativeImage} = require('electron')

    // Read image to verify if is an image
    let image = nativeImage.createFromDataURL(item.screenshot)

    // Verify if is an empty image if it is not an image the url is not an valid url
    if( image.isEmpty() ) {
        resetFields()
        alert("Sorry the url sent is not a valid page.")
        return
    }

    // Add items to array
    items.toreadItems.push(item);

    // Save items to the storage
    items.saveItems()

    // Add item
    items.addItem( item, items.toreadItems.length-1 )

    
    resetFields()
    if( items.toreadItems.length ){
        $('.read-item:first()').addClass('is-active')
    }
})

let resetFields = () => {
    // reset add actions
    $('#add-modal').removeClass('is-active')
    $('#item-input').prop('disabled', false).val('')
    $('#add-button').removeClass('is-loading')
    $('.close-add-modal').removeClass('is-disabled')
}

$('#item-input').keyup((e) => {
    if( e.key == 'Enter' ) $('#add-button').click()
})

// Filter item by title
$('#search').keyup((e) => {
    // Get current search input value
    let filter = $(e.currentTarget).val()

    $('.read-item').each((i, el) => {
        $(el).text().toLowerCase().includes(filter) ? $(el).show('slow') : $(el).hide('slow')
    })
})

// Add items when app loads
if( items.toreadItems.length ){
    items.toreadItems.forEach( (items.addItem) )
    $('.read-item:first()').addClass('is-active')
}
