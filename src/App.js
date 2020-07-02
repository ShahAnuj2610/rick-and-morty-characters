import React, { useRef } from 'react';
import {
  InstantSearch,
  RefinementList,
  Pagination,
  ClearRefinements,
  Highlight,
  Hits,
  HitsPerPage,
  Panel,
  Configure,
  SearchBox,
  Snippet,
} from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import {
  ClearFiltersMobile,
  NoResults,
  ResultsNumberMobile,
  SaveFiltersMobile,
} from './widgets';
import './Theme.css';
import './App.css';
import './App.mobile.css';
import './widgets/Pagination.css';

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_API_KEY
);

const Hit = ({ hit }) => (
  <article className="hit">
    <header className="hit-image-container">
      <img src={hit.image} alt={hit.name} className="hit-image" />
    </header>

    <div className="hit-info-container">
      <p className="hit-category">{hit.species}</p>
      <h1>
        <Highlight attribute="name" tagName="mark" hit={hit} />
      </h1>
      <p className="hit-description">
        <div>
          <Snippet attribute="type" tagName="mark" hit={hit} />
        </div>
        <Snippet attribute="location.name" tagName="mark" hit={hit} />
      </p>
    </div>
  </article>
);

const App = props => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);

  function openFilters() {
    document.body.classList.add('filtering');
    window.scrollTo(0, 0);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('click', onClick);
  }

  function closeFilters() {
    document.body.classList.remove('filtering');
    containerRef.current.scrollIntoView();
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('click', onClick);
  }

  function onKeyUp(event) {
    if (event.key !== 'Escape') {
      return;
    }

    closeFilters();
  }

  function onClick(event) {
    if (event.target !== headerRef.current) {
      return;
    }

    closeFilters();
  }

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="rickandmorty"
      searchState={props.searchState}
      createURL={props.createURL}
      onSearchStateChange={props.onSearchStateChange}
    >
      <header className="header" ref={headerRef}>
        <p className="header-title">Wubba Lubba Dub Dub.</p>

        <SearchBox
          translations={{
            placeholder: 'Name, description, location …',
          }}
          submit={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 18 18"
            >
              <g
                fill="none"
                fillRule="evenodd"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.67"
                transform="translate(1 1)"
              >
                <circle cx="7.11" cy="7.11" r="7.11" />
                <path d="M16 16l-3.87-3.87" />
              </g>
            </svg>
          }
        />
      </header>

      <Configure
        attributesToSnippet={['type', 'location.name']}
        snippetEllipsisText="…"
        removeWordsIfNoResults="allOptional"
      />

      <main className="container" ref={containerRef}>
        <div className="container-wrapper">
          <section className="container-filters" onKeyUp={onKeyUp}>
            <div className="container-header">
              <h2>Filters</h2>

              <div className="clear-filters" data-layout="desktop">
                <ClearRefinements
                  translations={{
                    reset: (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="11"
                          height="11"
                          viewBox="0 0 11 11"
                        >
                          <g fill="none" fillRule="evenodd" opacity=".4">
                            <path d="M0 0h11v11H0z" />
                            <path
                              fill="#000"
                              fillRule="nonzero"
                              d="M8.26 2.75a3.896 3.896 0 1 0 1.102 3.262l.007-.056a.49.49 0 0 1 .485-.456c.253 0 .451.206.437.457 0 0 .012-.109-.006.061a4.813 4.813 0 1 1-1.348-3.887v-.987a.458.458 0 1 1 .917.002v2.062a.459.459 0 0 1-.459.459H7.334a.458.458 0 1 1-.002-.917h.928z"
                            />
                          </g>
                        </svg>
                        Clear filters
                      </>
                    ),
                  }}
                />
              </div>

              <div className="clear-filters" data-layout="mobile">
                <ResultsNumberMobile />
              </div>
            </div>

            <div className="container-body">
              <Panel header="Gender">
                <RefinementList attribute="gender" />
              </Panel>

              <Panel header="Species">
                <RefinementList attribute="species" />
              </Panel>

              <Panel header="Location">
                <RefinementList
                  searchable
                  attribute="location.name"
                  translations={{
                    placeholder: 'Search for locations…',
                  }}
                />
              </Panel>
            </div>
          </section>

          <footer className="container-filters-footer" data-layout="mobile">
            <div className="container-filters-footer-button-wrapper">
              <ClearFiltersMobile containerRef={containerRef} />
            </div>

            <div className="container-filters-footer-button-wrapper">
              <SaveFiltersMobile onClick={closeFilters} />
            </div>
          </footer>
        </div>

        <section className="container-results">
          <header className="container-header container-options">
            <HitsPerPage
              className="container-option"
              items={[
                {
                  label: '16 hits per page',
                  value: 16,
                },
                {
                  label: '32 hits per page',
                  value: 32,
                },
                {
                  label: '64 hits per page',
                  value: 64,
                },
              ]}
              defaultRefinement={16}
            />
          </header>

          <Hits hitComponent={Hit} />
          <NoResults />

          <footer className="container-footer">
            <Pagination
              padding={2}
              showFirst={false}
              showLast={false}
              translations={{
                previous: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                  >
                    <g
                      fill="none"
                      fillRule="evenodd"
                      stroke="#000"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.143"
                    >
                      <path d="M9 5H1M5 9L1 5l4-4" />
                    </g>
                  </svg>
                ),
                next: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                  >
                    <g
                      fill="none"
                      fillRule="evenodd"
                      stroke="#000"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.143"
                    >
                      <path d="M1 5h8M5 9l4-4-4-4" />
                    </g>
                  </svg>
                ),
              }}
            />
          </footer>
        </section>
      </main>

      <aside data-layout="mobile">
        <button
          className="filters-button"
          data-action="open-overlay"
          onClick={openFilters}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 16 14">
            <path
              d="M15 1H1l5.6 6.3v4.37L9.4 13V7.3z"
              stroke="#fff"
              strokeWidth="1.29"
              fill="none"
              fillRule="evenodd"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Filters
        </button>
      </aside>
    </InstantSearch>
  );
};

export default App;
