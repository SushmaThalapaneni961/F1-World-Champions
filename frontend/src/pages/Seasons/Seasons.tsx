import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { errorAtom, fetchSeasonsAtom, loadingAtom, seasonsAtom } from '../../store/atoms/seasons.atom';
import './Seasons.scss';
import { useNavigate } from 'react-router-dom';

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

  if (loading) return <p className="status-msg">Loading...</p>;
  if (error) return <p className="status-msg error">Error: {error}</p>;
  if (!seasons.length) return <p className="status-msg">No seasons found.</p>;

  console.log(seasons, "seasons");

  const handleSeasonClick = (season: any) => {
    console.log(season, "season")
    navigate(`/racewinners/${season}`)
  }

  return (
    <div className="seasons-wrapper">
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
            <tr key={season?.season} onClick={() => handleSeasonClick(season?.season)}>
              <td>{season?.season}</td>
              <td>{season?.championName}</td>
              <td>{season?.nationality}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mobile-cards">
        {seasons?.map((season: any) => (
          <div key={season?.season} className="card">
            <h3>{season?.season}</h3>
            <p>{season?.championName}</p>
            <p>{season?.nationality}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Seasons;
