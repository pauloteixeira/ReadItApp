 // Modules
 const items = require('./items')
 // query string
 const queryString = require('query-string')

 // parse query string
 const queryParams = queryString.parse(location.search)
 
 // Get item index to pass to proxy window
 let itemIndex = queryParams.itemIndex

 // Get query string 'url'
 let url = decodeURIComponent(queryParams.url)

 $('webview').one('dom-ready', (e) => {
     e.currentTarget.loadURL(url)
 }).one('did-finish-load', () => {
     // Hide loader
     $('#loader').fadeOut(100)

     // Show mark read button
     $('#mark-read').removeClass('is-hidden')
 }).on('did-fail-load', () => {
     // Hide mark read button
     $('#mark-read').addClass('is-hidden')
     // Hide spiner
     $('#loader .busy').addClass('is-hidden')
     // Show section
     $('#loader').fadeIn(100)
     // Show failed text
     $('#loader .failed').removeClass('is-hidden')
 })