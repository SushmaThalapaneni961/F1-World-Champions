import { useAtom } from "jotai";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { errorAtom, fetchSeasonRaceWinnersAtom, loadingAtom, seasonRaceWinnersAtom } from "../../store/atoms/raceWinners.atom";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import './RaceWinners.scss';

const RaceWinners = () => {
  const { season } = useParams<{ season: string }>();
  const navigate = useNavigate();

  const [, fetchSeasonRaceWinners] = useAtom(fetchSeasonRaceWinnersAtom);
  const [seasonRaceWinners] = useAtom(seasonRaceWinnersAtom);
  const [loading] = useAtom(loadingAtom);
  const [error] = useAtom(errorAtom);

  useEffect(() => {
    // if(!seasonRaceWinners?.length){
    // }
    fetchSeasonRaceWinners(season ?? "");
  }, [season]);

  const handleBackClick = () => {
    navigate('/seasons');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="status-msg error">Error: {error}</p>;
  if (!seasonRaceWinners.length) return <p className="status-msg">No Race Winners found for this season.</p>;

  return (
    <div className="race-winners-wrapper">
      <div className="page-header">
        <h1 className="page-title">
          Season <span>{season}</span> Races
        </h1>
        <button className="back-button" onClick={handleBackClick}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Seasons
        </button>
      </div>

      <table className="desktop-table">
        <thead>
          <tr>
            <th>Grand Prix</th>
            <th>Winner</th>
            <th>Nationality</th>
            <th>Laps</th>
            <th>Time</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {seasonRaceWinners?.map((raceWinner: any) => (
            <tr 
              key={`${raceWinner?.season}-${raceWinner?.raceName}`}
              className={raceWinner?.winner?.isChampion ? 'winner-row' : ''}
            >
              <td>{raceWinner?.raceName}</td>
              <td className="winner-name">{raceWinner?.winner?.fullName}</td>
              <td>{raceWinner?.winner?.nationality}</td>
              <td>{raceWinner?.winner?.laps}</td>
              <td className="race-time">{raceWinner?.winner?.time}</td>
              <td>{raceWinner?.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mobile-cards">
        {seasonRaceWinners?.map((raceWinner: any) => (
          <div 
            key={`${raceWinner?.season}-${raceWinner?.raceName}`}
            className={`card ${raceWinner?.winner?.isChampion ? 'winner-card' : ''}`}
          >
            <h3 className="race-name">{raceWinner?.raceName}</h3>
            <div className="race-info">
              <div className="info-row">
                <div className="label">Winner</div>
                <div className="value winner-name">{raceWinner?.winner?.fullName}</div>
              </div>
              <div className="info-row">
                <div className="label">Nationality</div>
                <div className="value">{raceWinner?.winner?.nationality}</div>
              </div>
              <div className="info-row">
                <div className="label">Laps</div>
                <div className="value">{raceWinner?.winner?.laps}</div>
              </div>
              <div className="info-row">
                <div className="label">Time</div>
                <div className="value race-time">{raceWinner?.winner?.time}</div>
              </div>
              <div className="info-row">
                <div className="label">Date</div>
                <div className="value">{raceWinner?.date}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RaceWinners;
