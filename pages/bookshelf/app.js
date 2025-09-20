let sliderWrap = document.querySelector('.slider-wrap');
let slider = document.querySelector('.slider');
let filterField = document.querySelector('#filterField');
let directionToggle = document.querySelector('#directionToggle');
let toggleArrow = document.querySelector('.toggle-arrow');


// Default to descending by date
let isAscending = false;

// Set filter field to 'date' by default if not already set
if (filterField) {
    filterField.value = 'date';
}

// Function to parse date string (DD/MM/YY) to Date object
function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/');
    // Convert 2-digit year to 4-digit year (assuming 20xx)
    const fullYear = parseInt(year) + 2000;
    return new Date(fullYear, parseInt(month) - 1, parseInt(day));
}

// Function to sort and update the bookshelf
function updateBookshelf() {
    const field = filterField.value;
    
    // Sort the data array
    data.sort((a, b) => {
        let comparison = 0;
        
        if (field === 'date') {
            // Parse dates for comparison
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            comparison = dateA - dateB;
        } else if (field === 'rating') {
            comparison = parseFloat(a.rating) - parseFloat(b.rating);
        } else {
            // For author and name fields
            comparison = a[field].localeCompare(b[field]);
        }
        
        return isAscending ? comparison : -comparison;
    });
    
    // Clear the slider
    slider.innerHTML = '';
    
    // Recreate book divs with sorted data
    data.forEach(book => {
        slider.innerHTML += `<div class="slider-item"><a id="review-post-link" href="${book.review}"><img class="book-spine" src="${book.url}" id="${book.name.replace(/\s+/g, '-').toLowerCase()}"></a></div>`;
    });
    
    // Reattach event listeners
    attachEventListeners();
}

// Function to attach event listeners to book items
function attachEventListeners() {
    let items = [...document.querySelectorAll('.slider-item')];
    let reviewLink = document.querySelector('#review-link');
    let rating = document.querySelector('#rating');

    items.forEach(item => {
        item.addEventListener("mouseenter", () => {
            item.style.cursor = "grab";
        });
    });

    items.forEach((item, idx) => {
        item.addEventListener("mousemove", () => {
            item.style.bottom = "20px";
            rating.innerHTML = `Rating: <b>${data[idx].rating}/10</b>`;
            reviewLink.textContent = `${data[idx].name}`;
            reviewLink.href = `${data[idx].review}`;
        });
    });

    items.forEach(item => {
        item.addEventListener("mouseleave", () => {
            item.style.bottom = "0";
            rating.innerHTML = "Rating: <b>?/10</b>";
            reviewLink.textContent = "Review Archive";
            reviewLink.href = "https://tomasmiskov.com/book-reflection-archive";
        });
    });
}

// Function to toggle sort direction
function toggleDirection() {
    isAscending = !isAscending;
    directionToggle.classList.toggle('active');
    updateBookshelf();
}

// Initial setup
updateBookshelf();

// Add event listeners
filterField.addEventListener('change', updateBookshelf);
directionToggle.addEventListener('click', toggleDirection);

// Fill book divs with images
let items = [...document.querySelectorAll('.slider-item')];
let images = [...document.querySelectorAll('.book-spine')];
let aTags = [...document.querySelectorAll('#review-post-link')];

images.forEach((image, idx) => {
    image.src = `${data[idx].url}`;
    image.id = `${data[idx].name.replace(/\s+/g, '-').toLowerCase()}`;
})

aTags.forEach((atag, idx) => {
    atag.href = `${data[idx].review}`;
})

// CLICKING ON BOOKS FUNCTIONALITY //
let reviewLink = document.querySelector('#review-link');
let rating = document.querySelector('#rating')

items.forEach(item => {
    item.addEventListener("mouseenter", () => {
        item.style.cursor = "grab";
    });
})

 items.forEach((item, idx) => {
    item.addEventListener("mousemove", () => {
        item.style.bottom = "20px";
        rating.innerHTML = `Rating: <b>${data[idx].rating}/10</b>`;
        reviewLink.textContent = `${data[idx].name}`;
        reviewLink.href = `${data[idx].review}`;
    });
 })

 items.forEach(item => {
    item.addEventListener("mouseleave", () => {
        item.style.bottom = "0";
        // rating.innerHTML = "Rating: <b>?/10</b>";
        // reviewLink.textContent = `Review Archive`;
        // reviewLink.href = "https://tomasmiskov.com/book-reflection-archive";
    });
 })

//  let clicked = false;
//  items.forEach((item, idx) => {
//     item.addEventListener("click", () => {
//         if(clicked){
//             clicked = false;
//             item.style.bottom = "0px";
//         }
//         clicked = true;
//         item.style.bottom = "20px";
//         rating.innerHTML = `, Rating: <b>${data[idx].rating}/10</b>`;
//         reviewLink.href = `${data[idx].review}`;
//     });
//  })

    