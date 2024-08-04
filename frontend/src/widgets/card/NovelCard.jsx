import useThemeStore from "../../shared/store/Themestore";
import SpringDefaultCard from "../../shared/asset/cardImage/SpringDefaultCard.png"
import SummerDefaultCard from "../../shared/asset/cardImage/SummerDefaultCard.png"
import FallDefaultCard from "../../shared/asset/cardImage/FallDefaultCard.png"
import WinterDefaultCard from "../../shared/asset/cardImage/WinterDefaultCard.png"
import config from "../../shared/utils/config";
import { FaThumbsUp } from 'react-icons/fa';
import "./NovelCard.scss";

const NovelCard = ({ id, image, title, header, likes, rating, onClick }) => {
    const { currentSeason } = useThemeStore();

    const seasonImages = {
        spring: SpringDefaultCard,
        summer: SummerDefaultCard,
        fall: FallDefaultCard,
        winter: WinterDefaultCard,
    };

    const formatTitle = (title) => title.split(' ').join('_');
    const formattedTitle = formatTitle(title);
    const defaultImage = seasonImages[currentSeason];
    const imageUrl = image ? `${config.NovelMainImageStorage}` + `/${formattedTitle}.png` : defaultImage;
    console.log(`NovelCard image for id ${id}:`, imageUrl);


    return (
        <div className="card" style={{ backgroundImage: `url(${imageUrl})` }} onClick={() => onClick(id)}>
            <div className="card-header"><h1>{header}</h1></div>
            <div className="card-content">
                <p> <FaThumbsUp /> {likes}</p>
                <p>
                    {'⭐'.repeat(Math.min(Math.floor(rating), 5))}
                    {rating % 1 !== 0 ? (rating % 1 >= 0.5 ? '⭐' : '☆') : ''}
                    {'☆'.repeat(Math.max(5 - Math.ceil(rating), 0))} {rating} / 5
                </p>
            </div>
        </div>
    );
};
export default NovelCard;