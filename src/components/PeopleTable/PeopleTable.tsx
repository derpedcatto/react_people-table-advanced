import React from 'react';
import { Person } from '../../types';
import { PersonLink } from '../PersonLink/PersonLink';
import classNames from 'classnames';
import { SearchLink } from '../SearchLink/SearchLink';
import { useSearchParams } from 'react-router-dom';
import { SearchParams } from '../../utils/searchHelper';
import { PeopleSearchParams } from '../../enums/PeopleSearchParams';
import { TableSortOptions } from '../../enums/TableSortOptions';
import { PeopleSortOptions } from '../../enums/PeopleSortOptions';

type SortableThProps = {
  title: string;
  sortBy: PeopleSortOptions;
};

const SortableTh: React.FC<SortableThProps> = ({ title, sortBy }) => {
  const [searchParams] = useSearchParams();

  const currentSort = searchParams.get(PeopleSearchParams.Sort);
  const currentOrder = searchParams.get(PeopleSearchParams.Order);

  let params: SearchParams = { sort: sortBy, order: null };
  let iconClassName = 'fa-sort';

  if (currentSort === sortBy) {
    if (currentOrder === TableSortOptions.Descending) {
      params = { sort: null, order: null };
      iconClassName = 'fa-sort-down';
    } else {
      params = { order: TableSortOptions.Descending };
      iconClassName = 'fa-sort-up';
    }
  }

  return (
    <th>
      <span className="is-flex is-flex-wrap-nowrap">
        {title}
        <SearchLink params={params}>
          <span className="icon">
            <i className={classNames('fas', iconClassName)} />
          </span>
        </SearchLink>
      </span>
    </th>
  );
};

type PeopleTableProps = {
  people: Person[];
  selectedPersonSlug?: string;
};

export const PeopleTable: React.FC<PeopleTableProps> = ({
  people,
  selectedPersonSlug,
}) => {
  return (
    <table
      data-cy="peopleTable"
      className="table is-striped is-hoverable is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          <SortableTh title="Name" sortBy={PeopleSortOptions.Name} />
          <SortableTh title="Sex" sortBy={PeopleSortOptions.Sex} />
          <SortableTh title="Born" sortBy={PeopleSortOptions.Born} />
          <SortableTh title="Died" sortBy={PeopleSortOptions.Died} />
          <th>Mother</th>
          <th>Father</th>
        </tr>
      </thead>

      <tbody>
        {people.map(person => {
          const mother = person.motherName
            ? people.find(p => p.name === person.motherName)
            : undefined;

          const father = person.fatherName
            ? people.find(p => p.name === person.fatherName)
            : undefined;

          return (
            <tr
              key={person.slug}
              data-cy="person"
              className={classNames({
                'has-background-warning': person.slug === selectedPersonSlug,
              })}
            >
              <td>
                <PersonLink person={person} />
              </td>
              <td>{person.sex}</td>
              <td>{person.born}</td>
              <td>{person.died}</td>
              <td>
                {mother ? (
                  <PersonLink person={mother} />
                ) : (
                  person.motherName || '-'
                )}
              </td>
              <td>
                {father ? (
                  <PersonLink person={father} />
                ) : (
                  person.fatherName || '-'
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
