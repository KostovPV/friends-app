import './Intro.css';
import hero1 from '../../assets/YaDQ-resize.gif';
import hero2 from '../../assets/3F3F-resize.gif';
import hero3 from '../../assets/3vIU-resize.gif';
import hero4 from '../../assets/1V8t-reduced.gif';
import hero5 from '../../assets/ZbHT-resize.gif';
import hero6 from '../../assets/5LST-resize.gif';

export default function Intro() {
    return (
        <div className="intro-container">
            <div className="intro-text">
                Добре дошли при нас.
                <img src={hero1} alt="Hero 1" className="hero-icon" />
                <h1>Парти център Friends предлага почасови игри и организиране на рождени дни.</h1>
                <img src={hero2} alt="Hero 2" className="hero-icon" />
                Ще се радваме да прекарате свободното си време при нас.
                <img src={hero3} alt="Hero 3" className="hero-icon" />
                <h1>Ние ще се погрижим да се почувствате страхотно</h1>
                <img src={hero4} alt="Hero 4" className="hero-icon" />
                За повече въпроси се свържете с нас чрез контактната ни форма
                <img src={hero5} alt="Hero 5" className="hero-icon" />
                Или елате на място
                <img src={hero6} alt="Hero 6" className="hero-icon" />
            </div>
        </div>
    );
}
