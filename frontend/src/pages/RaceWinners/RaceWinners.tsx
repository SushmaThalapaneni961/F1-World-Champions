import { useAtom } from "jotai";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { errorAtom, fetchSeasonRaceWinnersAtom, loadingAtom, seasonRaceWinnersAtom } from "../../store/atoms/raceWinners.atom";

const RaceWinners = () => {
  const { season } = useParams<{ season: string }>();
  const navigate = useNavigate();

  const [, fetchSeasonRaceWinners] = useAtom(fetchSeasonRaceWinnersAtom);
  const [seasonRaceWinners] = useAtom(seasonRaceWinnersAtom);
  const [loading] = useAtom(loadingAtom);
  const [error] = useAtom(errorAtom);

  useEffect(() => {
    if(!seasonRaceWinners?.length){
      fetchSeasonRaceWinners(season ?? "");
    }
  }, [season, seasonRaceWinners]);

  if (loading) return <p className="status-msg">Loading...</p>;
  if (error) return <p className="status-msg error">Error: {error}</p>;
  if (!seasonRaceWinners.length) return <p className="status-msg">No Season Race Winners found.</p>;

  console.log(seasonRaceWinners, "seasonRaceWinners");

  return (
    <div className="seasons-wrapper">
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
            <tr key={raceWinner?.season ?? ""}>
              <td>{raceWinner?.raceName ?? ""}</td>
              <td>{raceWinner?.winner?.fullName ?? ""}</td>
              <td>{raceWinner?.winner?.nationality ?? ""}</td>
              <td>{raceWinner?.winner?.laps ?? ""}</td>
              <td>{raceWinner?.winner?.time ?? ""}</td>
              <td>{raceWinner?.date ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mobile-cards">
        {seasonRaceWinners?.map((raceWinner: any) => (
          <div key={raceWinner?.season} className="card">
            <h3>{raceWinner?.raceName}</h3>
            <p>{raceWinner?.winner?.fullName ?? ""}</p>
            <p>{raceWinner?.winner?.nationality ?? ""}</p>
            <p>{raceWinner?.winner?.laps ?? ""}</p>
            <p>{raceWinner?.winner?.time ?? ""}</p>
            <p>{raceWinner?.date ?? ""}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RaceWinners;
