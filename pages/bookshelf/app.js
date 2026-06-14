let sliderWrap = document.querySelector('.slider-wrap');
let slider = document.querySelector('.slider');
let filterField = document.querySelector('#filterField');
let directionToggle = document.querySelector('#directionToggle');
let toggleArrow = document.querySelector('.toggle-arrow');
let shelfPrev = document.querySelector('#shelfPrev');
let shelfNext = document.querySelector('#shelfNext');
let ratingEl = document.querySelector('#rating');
let ratingNumberEl = document.querySelector('#rating-number');

// Render the rating as 10 squares, filling the first n (supports halves, e.g. 6.5)
function renderRating(n) {
    let html = '';
    for (let i = 1; i <= 10; i++) {
        let cls = 'rating-box';
        if (i <= n) cls += ' filled';
        else if (i - n === 0.5) cls += ' half';
        html += `<span class="${cls}"></span>`;
    }
    ratingEl.innerHTML = html;
}
renderRating(0); // default: all empty

let reviewLinkEl = document.querySelector('#review-link');
let readReviewEl = document.querySelector('#read-review');
let selectedItem = null;

// Touch device? (no hover) — checked per-event so it adapts to device changes
function isTouch() {
    return window.matchMedia('(hover: none)').matches;
}

// Show a book's rating + name/author in the info area
function showBookInfo(idx) {
    renderRating(parseFloat(data[idx].rating));
    ratingNumberEl.textContent = `${data[idx].rating}/10`;
    reviewLinkEl.classList.add('book-info');
    reviewLinkEl.removeAttribute('href');
    reviewLinkEl.innerHTML = `${data[idx].name}<span class="book-author">${data[idx].author}</span>`;
}

// Reset the info area (and any touch selection) to the default empty state
function resetBookInfo() {
    renderRating(0);
    ratingNumberEl.textContent = "";
    reviewLinkEl.classList.remove('book-info');
    reviewLinkEl.textContent = "Review Archive";
    reviewLinkEl.href = "https://tomasmiskov.com/book-reflection-archive";
    readReviewEl.style.display = "none";
    if (selectedItem) { selectedItem.style.bottom = "0"; selectedItem = null; }
}


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

    // Re-sorting rebuilds the items, so clear any touch selection
    resetBookInfo();

    // Re-sorting resets scrollLeft to 0, so recompute the edge fades
    updateFades();
}

// Fade the shelf edges (and disable arrows) only on a side with more to scroll
function updateFades() {
    const max = sliderWrap.scrollWidth - sliderWrap.clientWidth;
    const x = sliderWrap.scrollLeft;
    const canPrev = x > 2;
    const canNext = x < max - 2;
    sliderWrap.style.setProperty('--fade-left',  canPrev ? '48px' : '0px');
    sliderWrap.style.setProperty('--fade-right', canNext ? '48px' : '0px');
    if (shelfPrev) shelfPrev.disabled = !canPrev;
    if (shelfNext) shelfNext.disabled = !canNext;
}
sliderWrap.addEventListener('scroll', updateFades);
window.addEventListener('resize', updateFades);
// Spine widths aren't known until the images load, so recompute then
window.addEventListener('load', updateFades);

// Arrow buttons: ease toward a running target so rapid clicks flow smoothly
let scrollTarget = null;
let scrollRAF = null;

function animateScroll() {
    const diff = scrollTarget - sliderWrap.scrollLeft;
    if (Math.abs(diff) < 0.5) {
        sliderWrap.scrollLeft = scrollTarget;
        scrollRAF = null;
        return;
    }
    sliderWrap.scrollLeft += diff * 0.18; // ease-out toward target
    scrollRAF = requestAnimationFrame(animateScroll);
}

function scrollShelf(direction) {
    const max = sliderWrap.scrollWidth - sliderWrap.clientWidth;
    const base = scrollTarget === null ? sliderWrap.scrollLeft : scrollTarget;
    scrollTarget = Math.max(0, Math.min(max, base + direction * sliderWrap.clientWidth * 0.2));
    if (!scrollRAF) scrollRAF = requestAnimationFrame(animateScroll);
}
if (shelfPrev) shelfPrev.addEventListener('click', () => scrollShelf(-1));
if (shelfNext) shelfNext.addEventListener('click', () => scrollShelf(1));

// Turn vertical wheel into horizontal scroll while hovering the shelf.
// Only fires when the pointer is over sliderWrap. We always consume a
// vertical-dominant wheel so reaching the shelf's end never spills over
// into a sudden page jump — move the pointer off the shelf to scroll the page.
sliderWrap.addEventListener('wheel', (e) => {
    // Let native horizontal swipes (trackpads) pass through untouched
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.preventDefault();
    // Normalize chunky line/page-based wheels to pixels
    let delta = e.deltaY;
    if (e.deltaMode === 1) delta *= 16;                       // lines -> px
    else if (e.deltaMode === 2) delta *= sliderWrap.clientWidth; // pages -> px
    // Feed the same eased target the arrows use, so the motion is smooth
    const max = sliderWrap.scrollWidth - sliderWrap.clientWidth;
    const base = scrollTarget === null ? sliderWrap.scrollLeft : scrollTarget;
    scrollTarget = Math.max(0, Math.min(max, base + delta));
    if (!scrollRAF) scrollRAF = requestAnimationFrame(animateScroll);
}, { passive: false });

// Function to attach event listeners to book items
function attachEventListeners() {
    let items = [...document.querySelectorAll('.slider-item')];

    items.forEach(item => {
        item.addEventListener("mouseenter", () => {
            item.style.cursor = "grab";
        });
    });

    // Desktop: hover reveals the book info
    items.forEach((item, idx) => {
        item.addEventListener("mousemove", () => {
            if (isTouch()) return;
            item.style.bottom = "20px";
            showBookInfo(idx);
        });
    });

    items.forEach(item => {
        item.addEventListener("mouseleave", () => {
            if (isTouch()) return;
            item.style.bottom = "0";
            resetBookInfo();
        });
    });

    // Touch: first tap reveals the book info + a "Read review" link. The spine
    // no longer navigates directly — the link does. Tapping elsewhere resets.
    items.forEach((item, idx) => {
        item.addEventListener("click", (e) => {
            if (!isTouch()) return;
            e.preventDefault();
            if (selectedItem && selectedItem !== item) selectedItem.style.bottom = "0";
            selectedItem = item;
            item.style.bottom = "20px";
            showBookInfo(idx);
            readReviewEl.href = data[idx].review;
            readReviewEl.style.display = "inline";
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

// Touch: tapping outside any book (and not the "Read review" link) resets
document.addEventListener('click', (e) => {
    if (!isTouch()) return;
    if (e.target.closest('.slider-item')) return; // handled by the book's own tap
    if (e.target.closest('#read-review')) return; // let the link navigate
    if (selectedItem) resetBookInfo();
});

// Fill book divs with images
let images = [...document.querySelectorAll('.book-spine')];
let aTags = [...document.querySelectorAll('#review-post-link')];

images.forEach((image, idx) => {
    image.src = `${data[idx].url}`;
    image.id = `${data[idx].name.replace(/\s+/g, '-').toLowerCase()}`;
})

aTags.forEach((atag, idx) => {
    atag.href = `${data[idx].review}`;
})

// Hover interaction is wired in attachEventListeners(), which runs on initial
// load and after every re-sort.