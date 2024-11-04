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
                Добре дошли в сайта на детски парти център “Friends”.
                <img src={hero1} alt="Hero 1" className="hero-icon" />
                <h1> Услугите, които предлагаме са почасова игра и организиране на рожден ден.</h1>
                <img src={hero2} alt="Hero 2" className="hero-icon" />
                За повече информация се свържете с нас на телефон 0894928950
                <img src={hero3} alt="Hero 3" className="hero-icon" />
                или заповядайте на място.
                <img src={hero4} alt="Hero 4" className="hero-icon" />
                Очакваме Ви!
                <img src={hero5} alt="Hero 5" className="hero-icon" />
               
            </div>
        </div>
    );
}
