import { NavLink, useSearchParams } from 'react-router-dom';

export const NavBar = () => {
  const [searchParams] = useSearchParams();

  return (
    <nav
      className="navbar is-fixed-top has-shadow"
      data-cy="nav"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <ul className="navbar-brand">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `navbar-item ${isActive ? 'has-background-grey-lighter' : ''}`
              }
              end
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to={{
                pathname: '/people',
                search: searchParams.toString(),
              }}
              className={({ isActive }) =>
                `navbar-item ${isActive ? 'has-background-grey-lighter' : ''}`
              }
            >
              People
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};
