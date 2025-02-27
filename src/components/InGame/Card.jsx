import './InGame.css';

export default function Card({ card, isHidden, onClick }) {
  if (isHidden || !card) {
    return <div className="card card-back" />;
  }

  return (
    <div 
      className={`card ${card.color}`}
      onClick={onClick}
      data-value={card.value}
    >
      <div className="card-content">
        {card.value || ''}
        {card.special && <div className="special">{card.special}</div>}
      </div>
    </div>
  );
}