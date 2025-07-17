import { HashRouter, Route, Routes } from "react-router-dom";

import TheLibrary from "../TheLibrary";
import Landing from "./pages/Landing"
import FicLibrary from "./pages/FicLibrary"
import BookLibrary from "./pages/BookLibrary"
import MovieLibrary from "./pages/MovieLibrary"
import ShowLibrary from "./pages/ShowLibrary"

export default function Router() {
    return <HashRouter>
        <Routes>
            <Route path="/" element={<TheLibrary />}>
                <Route index element={<Landing />} />
                <Route path="fics" element={<FicLibrary />} />
                <Route path="books" element={<BookLibrary />} />
                <Route path="movies" element={<MovieLibrary />} />
                <Route path="shows" element={<ShowLibrary />} />
                <Route path="*" element={<Landing />} />
            </Route>
        </Routes>
    </HashRouter>
}