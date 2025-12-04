document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookForm");
  const tableBody = document.querySelector("#bookTable tbody");
  const searchInput = document.getElementById("searchInput");

  let books = JSON.parse(localStorage.getItem("books")) || [];

  const renderBooks = (filter = "") => {
    tableBody.innerHTML = "";
    const filteredBooks = books.filter(book =>
      book.title.toLowerCase().includes(filter) ||
      book.author.toLowerCase().includes(filter) ||
      book.year.toLowerCase().includes(filter)
    );

    filteredBooks.forEach((book, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.year}</td>
        <td><button class="delete" data-index="${index}">Delete</button></td>
      `;
      tableBody.appendChild(row);
    });
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = form.title.value.trim();
    const author = form.author.value.trim();
    const year = form.year.value.trim();

    if (title && author && year) {
      books.push({ title, author, year });
      localStorage.setItem("books", JSON.stringify(books));
      renderBooks(searchInput.value.toLowerCase());
      form.reset();
    }
  });

  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
      const index = e.target.getAttribute("data-index");
      books.splice(index, 1);
      localStorage.setItem("books", JSON.stringify(books));
      renderBooks(searchInput.value.toLowerCase());
    }
  });

 
searchInput.addEventListener("input", () => {
  const filter = searchInput.value.trim().toLowerCase();
  const searchResult = document.getElementById("searchResult");

  if (filter === "") {
    searchResult.textContent = "";
    renderBooks(); // show all books
    return;
  }

  const found = books.some(book => book.title.toLowerCase().includes(filter));

  if (found) {
    searchResult.textContent = "✅ Book is available in the library.";
    searchResult.style.color = "green";
  } else {
    searchResult.textContent = "❌ Book not found in the library.";
    searchResult.style.color = "red";
  }

  renderBooks(filter); // still filter the table below if needed
});

});
