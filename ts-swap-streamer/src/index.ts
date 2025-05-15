import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Kafka } from 'kafkajs';
import * as dotenv from 'dotenv';
dotenv.config();

const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:9092';
const KAFKA_TOPIC = process.env.KAFKA_TOPIC || 'solana-swaps';
const SOLANA_RPC = process.env.SOLANA_RPC || clusterApiUrl('mainnet-beta');

const connection = new Connection(SOLANA_RPC, 'confirmed');
const kafka = new Kafka({ brokers: [KAFKA_BROKER] });
const producer = kafka.producer();

async function main() {
  await producer.connect();
  console.log('Connected to Kafka broker:', KAFKA_BROKER);

  // Example: Listen to Raydium swap program logs (replace with actual program ID for production)
  const RAYDIUM_PROGRAM_ID = new PublicKey('RVKd61ztZW9GdKzvKQC7P5cV9fyc6uC6tq9p8pKQ5kJ');

  connection.onLogs(RAYDIUM_PROGRAM_ID, async (logInfo, ctx) => {
    // Parse swap event from logInfo.logs (simplified example)
    const swapEvent = {
      signature: logInfo.signature,
      slot: logInfo.slot,
      logs: logInfo.logs,
      timestamp: Date.now()
    };
    await producer.send({
      topic: KAFKA_TOPIC,
      messages: [{ value: JSON.stringify(swapEvent) }]
    });
    console.log('Published swap:', swapEvent.signature);
  }, 'confirmed');

  console.log('Listening for Solana swaps...');
}

main().catch(console.error);
