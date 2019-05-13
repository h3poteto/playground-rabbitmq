import pika
import os

credentials = pika.PlainCredentials(os.environ['RABBITMQ_USER'], os.environ['RABBITMQ_PASSWORD'])
connection = pika.BlockingConnection(pika.ConnectionParameters(
    host='rabbitmq',
    port=5672,
    virtual_host='/',
    credentials=credentials))
channel = connection.channel()

priority=pika.spec.BasicProperties(priority=2)

channel.basic_publish(
    exchange='akira-exchange',
    routing_key='akira',
    body='hello 2',
    properties=priority
)

print(" [x] Sent 'Hello World'")
connection.close()
