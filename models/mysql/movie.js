import mysql from 'mysql2/promise'



const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '2501',
  database: 'moviesdb'
}

const connection = await mysql.createConnection(config)



export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      // get genre ids from database table using genre names
      const [genres] = await connection.query(
        'SELECT id, name FROM genre WHERE LOWER(name) = ?;',
        [lowerCaseGenre]
      )

      // no genre found
      if (genres.length === 0) return []

      // get the id from the first genre result
      const [{ id }] = genres

      // get all movies ids from database table
      // la query a movie_genres
      // join
      // y devolver resultados..
      return []
    }


    const [movies] = await connection.query(
      'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie;'
    )
    return movies
  }

  static async getById({ id }) {
    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id 
        FROM movie WHERE id = UUID_TO_BIN(?);`, [id]
    )

    if (movies.length === 0) return null

    return movies[0]
  }

  static async create({ input }) {
    const {
      genre: genreInput,
      title,
      year,
      director,
      duration,
      poster,
      rate
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate)
          VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
        [title, year, director, duration, poster, rate]
      )
    } catch (e) {
      // puede enviarle información sensible
      throw new Error('Error creating movie')
      // enviar la traza a un servicio interno
      // sendLog(e)
    }

    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
        FROM movie WHERE id = UUID_TO_BIN(?);`,
      [uuid]
    )

    return movies[0]

  }

  static async delete({ id }) {
    try {
  
      const [result] = await connection.query('DELETE FROM movie WHERE id = UUID_TO_BIN(?)', [id]);

      if (result.affectedRows === 0) {
        throw new Error('Película no encontrada');
      }

      return 'Película eliminada correctamente';
    } catch (error) {
      console.error('Error al eliminar la película:', error);
      throw error; 
    }
  }

  static async update({ id, input }) {
    try {
      // Actualizar película
      const [result] = await connection.query(
        `UPDATE movie SET ? WHERE id = UUID_TO_BIN(?)`,
        [input, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Película no encontrada');
      }

      return `pelicula actualizada corrrectamente` 
    } catch (error) {
      console.error('Error al actualizar:', error);
      throw error;
    }
  }
}