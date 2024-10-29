import { Link } from "react-router-dom";
import './404.css';

const PageNotFound = () => {
  return (
    <section className="page_404">
      <div className="content-404">
        <h1>404</h1>
        <div className="four_zero_four_bg"></div>
        <div className="contant_box_404">
          <h3 className="h2">Страницата не е намерена</h3>
          <p>Страницата, която се опитвате да достъпите не съществува или не е достъпна в момента.</p>
          <Link to="/" className="link_404">Към началната страница</Link>
        </div>
      </div>
    </section>
  );
};

export default PageNotFound;
