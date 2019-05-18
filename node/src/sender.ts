import * as Amqp from 'amqplib'
import Message from './message'

declare var process: {
  env: {
    RABBITMQ_USER: string
    RABBITMQ_PASSWORD: string
    RABBITMQ_HOST: string
    RABBITMQ_PORT: string
    RABBITMQ_VHOST: string
  }
}

const user = process.env.RABBITMQ_USER
const password = process.env.RABBITMQ_PASSWORD
const host = process.env.RABBITMQ_HOST
const port = process.env.RABBITMQ_PORT
const vhost = process.env.RABBITMQ_VHOST

const queue = 'akira-playground'

const message: Message = {
  message: 'h3poteto'
}

const open = Amqp.connect(`amqp://${user}:${password}@${host}:${port}/${encodeURIComponent(vhost)}`)
open
  .then(async conn => {
    const channel = await conn.createChannel()
    return { channel: channel, connection: conn }
  })
  .then(async ({ channel, connection }) => {
    return channel
      .assertQueue(queue)
      .then(_ => {
        return channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
      })
      .then(res => {
        if (res) {
          console.log('[x] Send message')
          // Close after send.
          channel.close()
          connection.close()
        }
      })
  })
  .catch(err => {
    console.error(err)
  })
