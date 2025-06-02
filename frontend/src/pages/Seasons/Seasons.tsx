import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';

import {
  fetchSeasonsAtom,
  seasonsAtom,
  loadingAtom,
  errorAtom,
} from '../../store/atoms/seasons.atom';
import { useSort } from '../../hooks/useSort';
import type { ISeason } from '../../store/types/season.types';
import './Seasons.scss';
import { Error, Column, LoadingSpinner, Table, Card } from '../../components/common';
import { useEffect } from 'react';

const Seasons = () => {
  const navigate = useNavigate();
  const [, fetchSeasons] = useAtom(fetchSeasonsAtom);
  const [seasons] = useAtom(seasonsAtom);
  const [loading] = useAtom(loadingAtom);
  const [error] = useAtom(errorAtom);

  const {
    items: sortedSeasons,
    sortConfig,
    requestSort,
  } = useSort<ISeason>(
    seasons,
    { key: 'season', direction: 'desc' }, // Default sort by season in descending order
  );

  useEffect(() => {
    console.log('seasons', seasons);
    if (!seasons?.length) {
      fetchSeasons();
    }
  }, [seasons, fetchSeasons]);

  const handleRetry = () => {
    fetchSeasons();
  };

  const handleSeasonClick = (season: ISeason) => {
    navigate(`/racewinners/${season.season}`);
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
  if (!seasons || !seasons.length)
    return (
      <Error
        message="No seasons found."
        action={{
          label: 'Retry',
          onClick: handleRetry,
        }}
      />
    );

  const columns: Column<ISeason>[] = [
    {
      header: 'Season',
      accessor: 'season',
      render: (row) => row.season,
    },
    {
      header: 'Champion',
      accessor: 'championName',
      render: (row) => row.championName || '-',
    },
    {
      header: 'Nationality',
      accessor: 'nationality',
      render: (row) => row.nationality || '-',
    },
  ];

  const renderMobileCards = () => (
    <div className="mobile-cards" data-testid="mobile-view">
      {sortedSeasons.map((season) => (
        <Card
          key={season.season}
          title={`F1 Season ${season.season}`}
          className={season.championName ? 'champion-card' : ''}
          onClick={() => handleSeasonClick(season)}
          infoRows={[
            {
              label: 'World Champion',
              value: season.championName || 'Not available',
            },
            {
              label: 'Nationality',
              value: season.nationality || 'Not available',
            },
          ]}
        />
      ))}
    </div>
  );

  return (
    <div className="seasons-container animate-fade-in">
      <h1>
        <span className="f1-color">
          <b>F1</b>
        </span>{' '}
        World Champions
      </h1>
      <div className="desktop-view">
        <Table<ISeason>
          columns={columns}
          data={sortedSeasons}
          onRowClick={handleSeasonClick}
          sortConfig={sortConfig}
          onSort={requestSort}
        />
      </div>
      {renderMobileCards()}
    </div>
  );
};

export default Seasons;
