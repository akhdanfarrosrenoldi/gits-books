import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookList from "./layouts/book/BookList";
import AddBook from "./layouts/book/AddBook";
import EditBook from "./layouts/book/EditBook";

import PublisherList from "./layouts/publisher/PublisherList";
import AddPublisher from "./layouts/publisher/AddPublisher";
import EditPublisher from "./layouts/publisher/EditPublisher";

import AuthorList from "./layouts/author/AuthorList";
import AddAuthor from "./layouts/author/AddAuthor";
import EditAuthor from "./layouts/author/EditAuthor";

import NavBar from "./components/NavBar";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="container mx-auto p-4">
        <Routes>
          {/* Books */}
          <Route path="/" element={<BookList />} />
          <Route path="/add" element={<AddBook />} />
          <Route path="/edit/:id" element={<EditBook />} />

          <Route path="/publishers" element={<PublisherList />} />
          <Route path="/publishers/add" element={<AddPublisher />} />
          <Route path="/publishers/edit/:id" element={<EditPublisher />} />

          <Route path="/authors" element={<AuthorList />} />
          <Route path="/authors/add" element={<AddAuthor />} />
          <Route path="/authors/edit/:id" element={<EditAuthor />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
