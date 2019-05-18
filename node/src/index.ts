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

// https://www.squaremobius.net/amqp.node/channel_api.html#vhost
// vhost has to replace `/akira` with `/%2Fakira`, I can obtain it using URL encode.
const open = Amqp.connect(`amqp://${user}:${password}@${host}:${port}/${encodeURIComponent(vhost)}`)
open
  .then((conn: Amqp.Connection) => {
    return conn.createChannel()
  })
  .then(async (ch: Amqp.Channel) => {
    return ch.assertQueue(queue).then(_ => {
      return ch.consume(queue, (msg: Amqp.ConsumeMessage | null) => {
        if (msg !== null) {
          receiveMessage(msg)
          ch.ack(msg)
        }
      })
    })
  })
  .catch(err => {
    console.error(err)
  })

const receiveMessage = (msg: Amqp.ConsumeMessage) => {
  const mes = msg.content.toString()
  const content: Message = JSON.parse(mes)
  console.log(`[x] Received message: ${content.message}`)
}
