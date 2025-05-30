import { useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import './SeasonsList.scss';

interface Season {
  year: number;
  champion?: {
    driverId: string;
    givenName: string;
    familyName: string;
    nationality: string;
  };
}

interface SeasonsListProps {
  seasons: Season[];
  isLoading: boolean;
  error: string | null;
}

const SeasonsList = ({ seasons, isLoading, error }: SeasonsListProps) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="seasons-list fade-in">
      <h1 className="seasons-list__title">F1 World Champions</h1>
      <div className="seasons-list__grid">
        {seasons.map((season) => (
          <Link
            key={season.year}
            to={`/season/${season.year}`}
            className={`season-card ${selectedYear === season.year ? 'season-card--selected' : ''}`}
            onClick={() => setSelectedYear(season.year)}
          >
            <div className="season-card__year">{season.year}</div>
            {season.champion && (
              <div className="season-card__champion">
                <span className="season-card__champion-label">Champion:</span>
                <span className="season-card__champion-name">
                  {season.champion.givenName} {season.champion.familyName}
                </span>
                <span className="season-card__champion-nationality">
                  {season.champion.nationality}
                </span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SeasonsList; 