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
}

.filter-select {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
  min-width: 120px;
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
}

.slider-wrap::-webkit-scrollbar{
  display: none;
}

.slider{
  position: relative;
  margin: auto;
  height: 300px;
  width: 1900px;
  padding-top: 20px;
  justify-content: start;
  display: flex;
  // flex: 1;
}

.slider-item{
  position: relative;
  display: inline;
}

.slide:hover{
  bottom: 20px;
}

.book-spine{
  position: relative;
  height: 300px;
  padding-right: 20px;
  // -webkit-filter: drop-shadow(5px 5px 5px #222222);
  // filter: drop-shadow(5px 5px 5px #222222);
}

.rating-wrap{
  position: relative;
  display: flex;
  height: 50px;
  margin-top: 50px;
  text-align: center;
  justify-content: center;
  flex-direction: column;
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

<div class="slider-wrap">
    <div class="slider">
    <!-- Insert Books Here Using JS -->
    </div>
</div>

<div class="rating-wrap">
    <a href="{{ '/book-reflection-archive' | relative_url }}" id="review-link">Review Archive</a>
    <p style="margin-top:10px" id="rating">Rating: <b>?/10</b></p>
</div>

<div>
    <script src="data.js"></script>
    <script src="app.js"></script>
</div>

*to scroll the shelf using your mouse press SHIFT-key, then scroll