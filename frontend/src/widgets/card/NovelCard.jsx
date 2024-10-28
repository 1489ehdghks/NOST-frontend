import useThemeStore from "../../shared/store/Themestore";
import spring from "../../shared/asset/cardImage/spring.png"
import summer from "../../shared/asset/cardImage/fallenRain.png"
import autumn from "../../shared/asset/cardImage/fall.png"
import winter from "../../shared/asset/cardImage/winter.png"
import config from "../../shared/utils/config";
import { FaThumbsUp } from 'react-icons/fa';
import "./NovelCard.scss";

const NovelCard = ({ id, image, title, header, likes, rating, tags, onClick }) => {
    const { currentSeason } = useThemeStore();
    const seasonImages = {
        spring: spring,
        summer: summer,
        autumn: autumn,
        winter: winter,
    };

    const formatTitle = (title) => title.split(' ').join('_');
    const formattedTitle = formatTitle(title);
    const defaultImage = seasonImages[currentSeason];
    const imageUrl = image ? `${config.NovelMainImageStorage}/${formattedTitle}.png` : defaultImage;

    return (
        <div className="card" style={{ backgroundImage: `url(${imageUrl})` }} onClick={() => onClick(id)}>
            <div className="card-header"><h1>{header}</h1></div>
            <div className="card-content">
                <p><FaThumbsUp /> {likes}</p>
                <p>
                    {'⭐'.repeat(Math.min(Math.floor(rating), 5))}
                    {rating % 1 !== 0 ? (rating % 1 >= 0.5 ? '⭐' : '☆') : ''}
                    {'☆'.repeat(Math.max(5 - Math.ceil(rating), 0))} {rating} / 5
                </p>
                <div className="tags">
                    {tags.map((tag, index) => (
                        <button key={index} className="tag">{tag}</button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NovelCard;
