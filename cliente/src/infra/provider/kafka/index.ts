import { Kafka, logLevel } from 'kafkajs';

const kafka = new Kafka({
  brokers: ['closing-anteater-13608-us1-kafka.upstash.io:9092'],
  ssl: true,
  sasl: {
    mechanism: 'scram-sha-256',
    username: 'Y2xvc2luZy1hbnRlYXRlci0xMzYwOCRmRAtEz5v9lHt5oilW_K-CEajVfLV63EI',
    password: 'NjMwMGMzNzEtNGVjOS00NTIxLTk4OGYtYWM5Y2RkZmM4ZTQz'
  },
  logLevel: logLevel.ERROR,
});


export { kafka };