import pika
import os

credentials = pika.PlainCredentials(os.environ['RABBITMQ_USER'], os.environ['RABBITMQ_PASSWORD'])
connection = pika.BlockingConnection(pika.ConnectionParameters(
    host='rabbitmq',
    port=5672,
    virtual_host='/',
    credentials=credentials))
channel = connection.channel()

channel.basic_publish(
    exchange='akira-exchange',
    routing_key='akira',
    body='Hello World')

print(" [x] Sent 'Hello World'")
connection.close()
