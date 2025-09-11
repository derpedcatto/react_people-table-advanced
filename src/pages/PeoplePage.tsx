import { useParams, useSearchParams } from 'react-router-dom';
import { getPeople } from '../api';
import { useEffect, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import { Loader } from '../components/Loader';
import { PeopleTable } from '../components/PeopleTable/PeopleTable';
import { PeopleFilters } from '../components/PeopleFilters/PeopleFilters';
import { PeopleSearchParams } from '../enums/PeopleSearchParams';
import { TableSortOptions } from '../enums/TableSortOptions';
import { PeopleSortOptions } from '../enums/PeopleSortOptions';

function preparePeople(
  people: Person[],
  searchParams: URLSearchParams,
): Person[] {
  const sex = searchParams.get(PeopleSearchParams.Sex) || null;
  const sort = searchParams.get(PeopleSearchParams.Sort) || null;
  const order = searchParams.get(PeopleSearchParams.Order) || null;
  const query = (
    searchParams.get(PeopleSearchParams.Query) || ''
  ).toLowerCase();
  const centuries =
    searchParams.getAll(PeopleSearchParams.Centuries).map(Number) || [];

  const filteredPeople = people
    .filter(person => {
      return (
        person.name.toLowerCase().includes(query) ||
        (person.motherName ?? '').toLowerCase().includes(query) ||
        (person.fatherName ?? '').toLowerCase().includes(query)
      );
    })
    .filter(person => {
      if (centuries.length === 0) {
        return true;
      }

      const bornCentury = Math.ceil(person.born / 100);
      const diedCentury = Math.ceil(person.died / 100);

      return centuries.includes(bornCentury) || centuries.includes(diedCentury);
    })
    .filter(person => {
      if (!sex) {
        return true;
      }

      return person.sex === sex;
    });

  const isSortOptionValueValid = Object.values(PeopleSortOptions).includes(
    sort as PeopleSortOptions,
  );

  if (sort && isSortOptionValueValid) {
    return filteredPeople.sort((a, b) => {
      const fieldA = a[sort as keyof Person];
      const fieldB = b[sort as keyof Person];

      if (fieldA === undefined || fieldA === null) {
        return 1;
      }

      if (fieldB === undefined || fieldB === null) {
        return -1;
      }

      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return order === TableSortOptions.Descending
          ? fieldB.localeCompare(fieldA)
          : fieldA.localeCompare(fieldB);
      }

      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return order === TableSortOptions.Descending
          ? fieldB - fieldA
          : fieldA - fieldB;
      }

      return 0;
    });
  }

  return filteredPeople;
}

export const PeoplePage = () => {
  const [searchParams] = useSearchParams();
  const { personSlug } = useParams();

  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const preparedPeople = useMemo(() => {
    return preparePeople(people, searchParams);
  }, [people, searchParams]);

  const handleLoadPeople = async () => {
    try {
      const apiPeople = await getPeople();

      setPeople(apiPeople);
    } catch (error) {
      setIsError(true);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    handleLoadPeople();
  }, []);

  const renderPeopleContent = () => {
    if (people.length === 0) {
      return <p data-cy="noPeopleMessage">There are no people on the server</p>;
    }

    if (preparedPeople.length === 0) {
      return <p>There are no people matching the current search criteria</p>;
    }

    return (
      <div className="box table-container">
        <PeopleTable people={preparedPeople} selectedPersonSlug={personSlug} />
      </div>
    );
  };

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <p data-cy="peopleLoadingError" className="has-text-danger">
            Something went wrong
          </p>
        ) : (
          <div className="columns is-desktop is-flex-direction-row-reverse">
            <div className="column is-7-tablet is-narrow-desktop">
              <PeopleFilters />
            </div>

            <div className="column">{renderPeopleContent()}</div>
          </div>
        )}
      </div>
    </>
  );
};
