import mysql from 'mysql2'

const config = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '',
    database: 'moviesdb'
}

const connection = mysql.createConnection(config)

export class MovieModel {
  static async getAll ({ genre }) {
   

    
  }

  static async getById ({ id }) {
    
  }

  static async create ({ input }) {
    
    
  }

  static async delete ({ id }) {
   
  }

  static async update ({ id, input }) {
   
  }
}