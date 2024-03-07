import React, { useState, useEffect } from "react";
import { findBestPhoneticMatches } from "../stringMatching";
import "./NameMatcher.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

function NameMatcher() {
  const [ikeaProductNames, setIkeaProductNames] = useState([]);
  const [userName, setUserName] = useState("");
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch("/ikea_products.txt")
      .then((response) => response.text())
      .then((text) => {
        const products = text
          .split("\n")
          .map((line) => {
            const parts = line.split(",");
            const name = parts[0] && parts[0].trim();
            const url = parts[1] && parts[1].trim();
            return name && url ? { name, url } : null;
          })
          .filter((product) => product !== null);
        setIkeaProductNames(products);
      });
  }, []);

  const handleChange = (event) => {
    const currentUserName = event.target.value;
    setUserName(currentUserName);

    if (currentUserName.trim()) {
      const closestMatches = findBestPhoneticMatches(
        currentUserName,
        ikeaProductNames
      );
      setMatches(closestMatches);
    } else {
      setMatches([]);
    }
  };

  return (
    <div className="container">
      <div className="title">IKEA Name Finder</div>
      <input type="text" value={userName} onChange={handleChange} />
      {matches.length > 0 && (
        <div>
          <p>Top 5 closest IKEA product names to "{userName}":</p>
          <ol>
            {matches.map((match) => (
              <li key={match.name}>
                <a href={match.url} target="_blank" rel="noopener noreferrer">
                  {match.name} (Distance: {match.distance.toFixed(2)})
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
      {matches.length == 0 && <h2>Start typing!</h2>}
      <i>
        This website takes in words and returns the closest IKEA product name to
        it.
        <br />
        Note that it takes pronunciation into account so it may look like it
        correlates less than it actually does.
      </i>
      {/* hellpo */}
      <div className="socials">
        <a
          href="https://instagram.com/suchir.gup/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faInstagram} size="2x" />
        </a>
        <a href="mailto:18sgupta@heckgrammar.co.uk">
          <FontAwesomeIcon icon={faEnvelope} size="2x" />
        </a>
      </div>
    </div>
  );
}

export default NameMatcher;
