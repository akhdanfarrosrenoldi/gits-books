import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookList from "./layouts/book/BookList";
import NavBar from "./components/NavBar";
import AddBook from "./layouts/book/AddBook";
import EditBook from "./layouts/book/EditBook";

function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/add" element={<AddBook />} />
          <Route path="/edit/:id" element={<EditBook />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
