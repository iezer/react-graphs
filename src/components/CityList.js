import React  from "react";

function CityList(props) {
  let { width, city } = props;
  let container = document.querySelector('.europe');
  if (!container) { return null; }
  let right = container.clientWidth - width;

  return (
    <aside className="place-data" style={{right: `${right}px`}}>
      <h2>{city.location.city}</h2>
      <ol >
        {city.events.map(event => {
          return (
            <li key={event.uri}>
              <a href={event.uri} target="_blank" rel="noopener noreferrer">
                {event.displayName}
              </a>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

export default CityList;
