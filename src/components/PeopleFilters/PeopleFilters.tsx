import classNames from 'classnames';
import { SearchLink } from '../SearchLink/SearchLink';
import { useSearchParams } from 'react-router-dom';
import { getSearchWith } from '../../utils/searchHelper';
import { useCallback } from 'react';
import { PeopleSearchParams } from '../../enums/PeopleSearchParams';

const CENTURIES_RANGE = [16, 17, 18, 19, 20];
const RESETTED_PARAMS = {
  sex: null,
  centuries: [],
  query: null,
  sort: null,
  order: null,
};

export const PeopleFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const sex = searchParams.get(PeopleSearchParams.Sex) || null;
  const centuries = searchParams.getAll(PeopleSearchParams.Centuries) || [];
  const query = searchParams.get(PeopleSearchParams.Query) || '';

  const sexFilterOptions = [
    { label: 'All', value: null },
    { label: 'Male', value: 'm' },
    { label: 'Female', value: 'f' },
  ];

  const getUpdatedCenturiesParam = (century: string) => {
    return centuries.includes(century)
      ? centuries.filter(c => c !== century)
      : [...centuries, century];
  };

  const handleQueryChange = useCallback(
    (newQuery: string) => {
      const filteredQuery = newQuery.trim();

      const newParams = getSearchWith(searchParams, {
        query: filteredQuery.trim() === '' ? null : filteredQuery.trim(),
      });

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  return (
    <nav className="panel">
      <p className="panel-heading">Filters</p>

      <p className="panel-tabs" data-cy="SexFilter">
        {sexFilterOptions.map(option => (
          <SearchLink
            key={option.label}
            params={{ sex: option.value }}
            className={classNames({ 'is-active': sex === option.value })}
          >
            {option.label}
          </SearchLink>
        ))}
      </p>

      <div className="panel-block">
        <p className="control has-icons-left">
          <input
            data-cy="NameFilter"
            type="search"
            className="input"
            placeholder="Search"
            value={query}
            onChange={event => handleQueryChange(event.target.value)}
          />

          <span className="icon is-left">
            <i className="fas fa-search" aria-hidden="true" />
          </span>
        </p>
      </div>

      <div className="panel-block">
        <div className="level is-flex-grow-1 is-mobile" data-cy="CenturyFilter">
          <div className="level-left">
            {CENTURIES_RANGE.map(century => {
              const updatedCenturies = getUpdatedCenturiesParam(
                String(century),
              );
              const isActive = centuries.includes(String(century));

              return (
                <SearchLink
                  params={{
                    centuries:
                      updatedCenturies.length > 0 ? updatedCenturies : null,
                  }}
                  key={`centuryLink-${century}`}
                  data-cy="century"
                  className={classNames('button mr-1', {
                    'is-info': isActive,
                  })}
                >
                  {century}
                </SearchLink>
              );
            })}
          </div>

          <div className="level-right ml-4">
            <SearchLink
              params={{ centuries: null }}
              data-cy="centuryALL"
              className={classNames('button is-success', {
                'is-outlined': centuries.length > 0,
              })}
            >
              All
            </SearchLink>
          </div>
        </div>
      </div>

      <div className="panel-block">
        <SearchLink
          params={RESETTED_PARAMS}
          className="button is-link is-outlined is-fullwidth"
        >
          Reset all filters
        </SearchLink>
      </div>
    </nav>
  );
};
