import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';

import {
  fetchSeasonRaceWinnersAtom,
  seasonRaceWinnersAtom,
  loadingAtom,
  errorAtom,
} from '../../store/atoms/raceWinners.atom';
import { useSort } from '../../hooks/useSort';
import type { IRaceWinner } from '../../store/types/raceWinners.types';
import './RaceWinners.scss';
import { Button, Error, LoadingSpinner, Table, Card, Column } from '../../components/common';
import { ArrowLeft } from '../../components/common/Icons/Icons';

const RaceWinners = () => {
  const { season } = useParams<{ season: string }>();
  const navigate = useNavigate();
  const [, fetchRaceWinners] = useAtom(fetchSeasonRaceWinnersAtom);
  const [raceWinners] = useAtom(seasonRaceWinnersAtom);
  const [loading] = useAtom(loadingAtom);
  const [error] = useAtom(errorAtom);

  const {
    items: sortedRaces,
    sortConfig,
    requestSort,
  } = useSort<IRaceWinner>(
    raceWinners,
    { key: 'date', direction: 'asc' }, // Default sort by date in ascending order
  );

  React.useEffect(() => {
    if (season) {
      fetchRaceWinners(season);
    }
  }, [season, fetchRaceWinners]);

  const handleRetry = () => {
    if (season) {
      fetchRaceWinners(season);
    }
  };

  const handleBack = () => {
    navigate('/seasons');
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <Error
        message={error}
        action={{
          label: 'Retry',
          onClick: handleRetry,
        }}
      />
    );
  if (!raceWinners || !raceWinners.length)
    return (
      <Error
        message={`No race winners found for season ${season}.`}
        action={{
          label: 'Retry',
          onClick: handleRetry,
        }}
      />
    );

  const columns: Column<IRaceWinner>[] = [
    {
      header: 'Round',
      accessor: 'round',
      render: (row: { round: any }) => String(row.round),
    },
    {
      header: 'Race Name',
      accessor: 'raceName',
      render: (row: { raceName: any }) => row.raceName,
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (row: { date: string | number | Date }) => new Date(row.date).toLocaleDateString(),
    },
    {
      header: 'Circuit',
      accessor: 'circuit',
      render: (row: { circuit: { name: any } }) => String(row.circuit?.name || '-'),
    },
    {
      header: 'Winner',
      accessor: 'winnerName',
      render: (row: { winner: { fullName: any } }) => String(row.winner?.fullName || '-'),
    },
    {
      header: 'Time',
      accessor: 'winnerTime',
      render: (row: { winner: { time: any } }) => String(row.winner?.time || '-'),
    },
  ];

  const renderMobileCards = () => (
    <div className="mobile-cards">
      {sortedRaces.map((race, index) => (
        <Card
          key={index}
          title={race.raceName}
          className={race.isChampionWinner ? 'winner-card' : ''}
          infoRows={[
            {
              label: 'Round',
              value: String(race.round),
            },
            {
              label: 'Date',
              value: new Date(race.date).toLocaleDateString(),
            },
            {
              label: 'Circuit',
              value: race.circuit?.name ? String(race.circuit.name) : '-',
            },
            {
              label: 'Winner',
              value: race.winner?.fullName ? String(race.winner.fullName) : '-',
            },
            {
              label: 'Time',
              value: race.winner?.time ? String(race.winner.time) : '-',
            },
          ]}
        />
      ))}
    </div>
  );

  return (
    <div className="race-winners-container">
      <div className="page-header">
        <h1>
          Race Winners - Season{' '}
          <span className="season-number">
            <b>{season}</b>
          </span>
        </h1>
        <Button
          variant="secondary"
          onClick={handleBack}
          icon={<ArrowLeft size={20} />}
          iconPosition="left"
        >
          Back to Seasons
        </Button>
      </div>
      <div className="desktop-view">
        <Table<IRaceWinner>
          columns={columns}
          data={sortedRaces}
          sortConfig={sortConfig}
          onSort={requestSort}
          rowClassName={(row) => (row.isChampionWinner ? 'champion-winner' : '')}
        />
      </div>
      {renderMobileCards()}
    </div>
  );
};

export default RaceWinners;
