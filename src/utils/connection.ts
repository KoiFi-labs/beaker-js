import { connect, connection } from 'mongoose'

const conn = {
  isConnected: false
}

export async function dbConnect () {
  console.log('dbConnect')
  const db = await connect(process.env.MONGO_URI!)
  conn.isConnected = !!db.connections[0].readyState
}

connection.on('connected', () => console.log('Mongodb connected to db'))

connection.on('error', (err) => console.error('Mongodb Errro:', err.message))

connection.on('disconnected', () => console.error('Disconnected from mongo server.'))

connection.on('close', () => console.log('Close to mongo server.'))
