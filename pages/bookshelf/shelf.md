---
layout: page
title: Bookshelf
---
<style>
/*----------------------------------------*/
/*               Bookshelf                */
/*----------------------------------------*/

.filter-container {
  display: flex;
  justify-content: flex-start;
  margin: 20px 0;
  gap: 15px;
  align-items: center;
  padding-left: 0;
}

/* Consistent select styling across devices */
.filter-select {
  height: 30px;
  padding: 0 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
  min-width: 120px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  padding-right: 32px;
  display: flex;
  align-items: center;
}

/* Remove default focus outline and add custom one */
.filter-select:focus {
  outline: none;
  border-color: #666;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
}

/* Style for mobile devices */
@media screen and (max-width: 768px) {
  .filter-select {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

/* Toggle Switch Container */
.toggle-container {
  position: relative;
  width: 60px;
  height: 30px;
  background-color: #e0e0e0;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}

/* Toggle Ball */
.toggle-ball {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 26px;
  height: 26px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* Toggle Ball when active (descending) */
.toggle-container.active .toggle-ball {
  transform: translateX(30px);
}

/* Arrow inside the ball */
.toggle-arrow {
  font-size: 14px;
  transition: transform 0.3s ease;
}

.toggle-container.active .toggle-arrow {
  transform: rotate(180deg);
}

/* Hover effects */
.filter-select:hover {
  border-color: #999;
}

.toggle-container:hover {
  background-color: #d0d0d0;
}

.slider-wrap{
  position: relative;
  width: 100%;
  height: 320px;
  margin: auto;
  margin-top: 20px;
  overflow: auto;
  --fade-left: 0px;
  --fade-right: 48px;
  -webkit-mask-image: linear-gradient(to right,
    transparent 0, #000 var(--fade-left),
    #000 calc(100% - var(--fade-right)), transparent 100%);
  mask-image: linear-gradient(to right,
    transparent 0, #000 var(--fade-left),
    #000 calc(100% - var(--fade-right)), transparent 100%);
}

.slider-wrap::-webkit-scrollbar{
  display: none;
}

.slider{
  position: relative;
  margin: auto;
  height: 300px;
  width: max-content;
  padding-top: 20px;
  justify-content: start;
  display: flex;
  // flex: 1;
}

.slider-item{
  position: relative;
  display: inline;
  flex-shrink: 0;
}

.slide:hover{
  bottom: 20px;
}

.book-spine{
  position: relative;
  height: 300px;
  padding-right: 5px;
  // -webkit-filter: drop-shadow(5px 5px 5px #222222);
  // filter: drop-shadow(5px 5px 5px #222222);
}

.rating-wrap{
  position: relative;
  display: flex;
  min-height: 50px;
  margin-top: 50px;
  text-align: center;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 8px;
}

/* When showing a hovered book's info, render it as plain text, not a link */
#review-link.book-info{
  text-decoration: none;
  color: inherit;
  cursor: default;
  pointer-events: none;
}

.book-author{
  display: block;
  font-size: 0.85em;
  color: #777;
  margin-top: 2px;
}

/* Numeric rating, shown above the squares on hover */
.rating-number{
  font-weight: 600;
  font-size: 0.8em;
  letter-spacing: 0.02em;
  color: #555;
  line-height: 1;
  min-height: 0.8em;
}

/* Rating shown as 10 squares; filled = black, empty = outline only */
.rating-squares{
  display: grid;
  grid-template-columns: repeat(10, 16px);
  gap: 4px;
  justify-content: center;
}

.rating-box{
  width: 16px;
  height: 16px;
  border: 1px solid #000;
  border-radius: 3px; /* slight soft edge */
  background: transparent;
}

.rating-box.filled{
  background: #000;
}

.rating-box.half{
  background: linear-gradient(to right, #000 50%, transparent 50%);
}

/* On mobile stack into two rows of five */
@media screen and (max-width: 768px){
  .rating-squares{
    grid-template-columns: repeat(5, 16px);
  }
}

/* Shelf row: arrows flank the scrollable shelf */
.shelf-row{
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: -44px;   /* arrow width (36) + gap (8) */
  margin-right: -44px;
}

.shelf-row .slider-wrap{
  flex: 1;
  min-width: 0;
}

.shelf-arrow{
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #ccc;
  background-color: white;
  color: #333;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s, border-color 0.2s;
}

.shelf-arrow:hover{
  border-color: #999;
}

.shelf-arrow:disabled{
  opacity: 0.2;
  cursor: default;
}

/* Hide arrows on touch / small screens — wheel & swipe handle those.
   Also drop the negative margins (used to reclaim arrow width) so the
   shelf doesn't overflow the viewport edges. */
@media (hover: none), (max-width: 768px){
  .shelf-arrow{
    display: none;
  }
  .shelf-row{
    margin-left: 0;
    margin-right: 0;
  }
}
</style>

<div class="filter-container">
    <select id="filterField" class="filter-select">
        <option value="author">Author</option>
        <option value="name">Book Name</option>
        <option value="date">Date</option>
        <option value="rating">Rating</option>
    </select>
    <div id="directionToggle" class="toggle-container">
        <div class="toggle-ball">
            <span class="toggle-arrow">↑</span>
        </div>
    </div>
</div>

<div class="shelf-row">
    <button class="shelf-arrow" id="shelfPrev" aria-label="Scroll shelf left">‹</button>
    <div class="slider-wrap">
        <div class="slider">
        <!-- Insert Books Here Using JS -->
        </div>
    </div>
    <button class="shelf-arrow" id="shelfNext" aria-label="Scroll shelf right">›</button>
</div>

<div class="rating-wrap">
    <a href="{{ '/book-reflection-archive' | relative_url }}" id="review-link">Review Archive</a>
    <div id="rating-number" class="rating-number"></div>
    <div id="rating" class="rating-squares" aria-label="Rating"></div>
</div>

<div>
    <script src="data.js"></script>
    <script src="app.js"></script>
</div>