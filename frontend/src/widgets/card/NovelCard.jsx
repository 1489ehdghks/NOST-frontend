import useBookStore from "../../shared/store/BookStore";

const NovelCard = ({ id, image, header, likes, rating, onClick }) => {
    const title = useBookStore((state) => state.title);
    const formatTitle = (title) => title.split(' ').join('_');
    const defaultImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT6uhVlGoDqJhKLfS9W_HQOoWJCf-_lsBZzw&s'; // 기본 이미지 URL을 설정합니다.
    const imageUrl = title ? `https://mynostbucket.s3.ap-northeast-2.amazonaws.com/books/${formatTitle(title)}.png` : defaultImage;

    return (
        <div className="card" style={{ backgroundImage: `url(${imageUrl})` }} onClick={() => onClick(id)}>
            <div className="card-header"><h1>{header}</h1></div>
            <div className="card-content">
                <p> ❤️ {likes}</p>
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