import './Intro.css';
import hero1 from '../../assets/YaDQ.gif'; 
import hero2 from '../../assets/3F3F.gif';
import hero3 from '../../assets/3vIU.gif';
import hero4 from '../../assets/1V8t.gif';
import hero5 from '../../assets/ZbHT.gif';
import hero6 from '../../assets/5LST.gif';

export default function Intro() {
    return (
        <div className="intro-container">
            <div className="intro-text">
                Добре дошли в Парти център Friends! 
                <img src={hero1} alt="Hero 1" className="hero-icon" />
                Тук ще откриете забавни игри и безкрайни плиключения!
                <img src={hero2} alt="Hero 2" className="hero-icon" />
                Почасови игри или парти по повод
                <img src={hero3} alt="Hero 3" className="hero-icon" />
                Ние ще се погрижим да се почувствате страхотно
                <img src={hero4} alt="Hero 4" className="hero-icon" />
                За повече въпроси се свържете с нас чрез контактната ни форма
                <img src={hero5} alt="Hero 5" className="hero-icon" />
                Или елате на място
                <img src={hero6} alt="Hero 6" className="hero-icon" />
            </div>
        </div>
    );
}