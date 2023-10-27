import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home';

function TableRoute() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/table" element={<ResultTable />} />
            </Routes>
        </Router>
    );
}
