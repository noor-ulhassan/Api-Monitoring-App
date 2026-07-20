import config from "./index.js";
import logger from "./logger.js";

import amqplib from "amqplib";

class RabbitMqConnection {
  constructor() {
    this.channel = null;
    this.connection = null;
  }

  // connect
  async connect() {
    try {
      if (this.connection) {
        logger.info("RabbitMQ Already Connected");
        return this.connection;
      }

      this.connection = await amqplib.connect(config.rabbitmq.url);
    } catch (error) {
      logger.error("Error in RabbitMQ Connection: ", error);
      throw error;
    }
  }
}
