import { Link } from "react-router-dom";
import './404.css'

const PageNotFound = () => {
  return (
    <div className="no-content-container">
      <div id="notfound">
        <div className="notfound">
          <div className="notfound-404">
            <h1>Ooпс!</h1>
          </div>
          <h2>404 - Страницата не е намерена</h2>
          <p>Страницата, която се опитвате да достъпите не съществува или не е достъпна в момента.</p>
          <Link to="/">
            <button className="redirect-button">Към началната страница</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;