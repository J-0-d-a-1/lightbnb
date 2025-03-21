const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");

/// Users

const pool = new Pool({
  user: "development",
  password: "development",
  host: "localhost",
  database: "lightbnb",
});

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
// const getUserWithEmail = function (email) {
//   let resolvedUser = null;
//   for (const userId in users) {
//     const user = users[userId];
//     if (user && user.email.toLowerCase() === email.toLowerCase()) {
//       resolvedUser = user;
//     }
//   }
//   return Promise.resolve(resolvedUser);
// };

// getting data from lightbnb database
const getUserWithEmail = (email) => {
  return pool
    .query(
      `
      SELECT * 
      FROM users
      WHERE users.email = $1;
    `,
      [email]
    )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
// const getUserWithId = function (id) {
//   return Promise.resolve(users[id]);
// };

// getting data from lightbnb database
const getUserWithId = (id) => {
  return pool
    .query(
      `
      SELECT * 
      FROM users
      WHERE users.id = $1;
    `,
      [id]
    )
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
// const addUser = function (user) {
//   const userId = Object.keys(users).length + 1;
//   user.id = userId;
//   users[userId] = user;
//   return Promise.resolve(user);
// };

// getting data from lightbnb database
const addUser = (user) => {
  return pool
    .query(
      `
     INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING *;
    `,
      [user.name, user.email, user.password]
    )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err);
      return Promise.reject(err);
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
// const getAllReservations = function (guest_id, limit = 10) {
//   return getAllProperties(null, 2);
// };

// getting data from lightbnb database
const getAllReservations = (guest_id, limit = 10) => {
  return pool
    .query(
      `
    SELECT reservations.*, properties.title, avg(property_reviews.rating) as average_rating
    FROM reservations
    JOIN properties ON properties.id = property_id
    JOIN property_reviews ON reservations.id = reservation_id
    WHERE reservations.guest_id = $1
    GROUP BY reservations.id, properties.title, properties.cost_per_night
    ORDER BY start_date DESC
    LIMIT $2;
    `,
      [guest_id, limit]
    )
    .then((result) => {
      return result.rows;
    })
    .catch((err) => console.log(err));
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// const getAllProperties = function (options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// };

// getting data from lightbnb database
const getAllProperties = (options, limit = 10) => {
  const queryParams = [];

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  WHERE 1=1
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += ` AND city LIKE $${queryParams.length}`;
  }

  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += ` AND properties.owner_id = $${queryParams.length}`;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night * 100}`);
    queryString += ` AND properties.cost_per_night >= $${queryParams.length}`;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night * 100}`);
    queryString += ` AND properties.cost_per_night <= $${queryParams.length}`;
  }

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += ` AND property_reviews.rating >= $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // console.log(queryString, queryParams);

  return pool.query(queryString, queryParams).then((res) => {
    return res.rows;
  });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
// const addProperty = function (property) {
//   const propertyId = Object.keys(properties).length + 1;
//   property.id = propertyId;
//   properties[propertyId] = property;
//   return Promise.resolve(property);
// };

// getting data from lightbnb database
const addProperty = (property) => {
  const queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
    property.country,
    property.street,
    property.city,
    property.province,
    property.post_code,
  ];
  let queryString = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, TRUE)
  RETURNING *;
  `;

  console.log(queryString, queryParams);

  return pool
    .query(queryString, queryParams)
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => console.log(err));
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
