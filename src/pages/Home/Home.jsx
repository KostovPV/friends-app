import Intro from '../../components/Intro/Intro'
import Slider from '../../components/Slider/Slider'
import './Home.css'
import { Helmet } from 'react-helmet';

export const Home = () => {
    return (
        <div className='home-container'>
            <Helmet>
            <title>Детски парти център Friends</title>
            <meta name="description" content="Friends - детски парти център в Бургас, жк. Изгрев. Игри, почасови забавления, празненства и организирани рождени дни за малчугани на едно място!" />
            </Helmet>
            <div className='home-component'>

            </div>
            <Intro />
            < Slider />
        </div>
    )
} 
