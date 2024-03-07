import { doubleMetaphone } from "double-metaphone";

export function levenshteinDistance(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // Substitution
          matrix[i][j - 1] + 1, // Insertion
          matrix[i - 1][j] + 1 // Deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function startingLetterPriority(userName, productName, baseScore) {
  if (
    userName &&
    productName &&
    userName[0].toLowerCase() === productName[0].toLowerCase()
  ) {
    return baseScore - 0.5;
  }
  return baseScore;
}

export function findBestPhoneticMatches(userName, products) {
  userName = userName?.toLowerCase() || "";

  const [userMetaPrimary, userMetaSecondary] = doubleMetaphone(userName);
  const matches = products.map((product) => {
    const productName = product.name?.toLowerCase() || "";

    const [productMetaPrimary, productMetaSecondary] =
      doubleMetaphone(productName);

    // Calculate phonetic similarity
    let distance = Math.min(
      levenshteinDistance(userMetaPrimary, productMetaPrimary),
      levenshteinDistance(userMetaSecondary, productMetaSecondary)
    );

    distance = startingLetterPriority(userName, productName, distance);

    return { ...product, distance };
  });

  return matches.sort((a, b) => a.distance - b.distance + 0.5).slice(0, 5);
}
