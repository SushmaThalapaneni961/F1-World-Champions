import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { errorAtom, fetchSeasonsAtom, loadingAtom, seasonsAtom } from '../../store/atoms/seasons.atom';
import './Seasons.scss';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';

const Seasons = () => {
  const navigate = useNavigate();

  const [, fetchSeasons] = useAtom(fetchSeasonsAtom);
  const [seasons] = useAtom(seasonsAtom);
  const [loading] = useAtom(loadingAtom);
  const [error] = useAtom(errorAtom);

  useEffect(() => {
    if(!seasons?.length){
      fetchSeasons();
    }
  }, [seasons]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="status-msg error">Error: {error}</p>;
  if (!seasons.length) return <p className="status-msg">No seasons found.</p>;

  const handleSeasonClick = (season: string) => {
    navigate(`/racewinners/${season}`);
  };

  return (
    <div className="seasons-wrapper">
      <h1 className="page-title">F1 <span>World Champions</span></h1>
      
      <table className="desktop-table">
        <thead>
          <tr>
            <th>Season</th>
            <th>Champion</th>
            <th>Nationality</th>
          </tr>
        </thead>
        <tbody>
          {seasons?.map((season: any) => (
            <tr 
              key={season?.season} 
              onClick={() => handleSeasonClick(season?.season)}
              className={season?.isChampion ? 'champion-row' : ''}
            >
              <td>{season?.season}</td>
              <td className="champion-name">{season?.championName}</td>
              <td>{season?.nationality}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mobile-cards">
        {seasons?.map((season: any) => (
          <div 
            key={season?.season} 
            className={`card ${season?.isChampion ? 'champion-card' : ''}`}
            onClick={() => handleSeasonClick(season?.season)}
          >
            <h3>{season?.season}</h3>
            <div className="champion-info">
              <div className="label">Champion</div>
              <div className="value">{season?.championName}</div>
              <div className="label">Nationality</div>
              <div className="value">{season?.nationality}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Seasons;
