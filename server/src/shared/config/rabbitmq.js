import config from "./index.js";
import logger from "./logger.js";
import amqp from "amqplib";

class RabbitMqConnection {
  constructor() {
    this.channel = null;
    this.connection = null;
    this.isConnecting = false;
  }

  // connect
  async connect() {
    if (this.channel) {
      return this.channel;
    }

    if (this.isConnecting) {
      await new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!this.isConnecting) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });
      return this.channel;
    }
    try {
      this.isConnecting = true;
      logger.info("Connecting to RabbitMQ", config.rabbitmq.url);
      this.connection = await amqp.connect(config.rabbitmq.url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue("HEALTH_CHECK", { durable: true });
      this.isConnecting = false;
      logger.info("RabbitMQ connected");
    } catch (error) {
      logger.error("Error in RabbitMQ connection: ", error);
      this.isConnecting = false;
      throw error;
    }
  }
}

export default new RabbitMqConnection();
