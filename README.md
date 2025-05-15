# Solana Swap Streamer & Price Impact Model

This project demonstrates a real-time streaming pipeline for Solana swaps, designed as a multi-chain DEX aggregator architecture.

- **Typescript microservice**: Streams Solana swap transactions and publishes them to Kafka.
- **Kafka**: Handles real-time data streaming.
- **Rust consumer**: Reads swap events from Kafka and computes a price impact metric.

## Architecture

```
Solana (WebSocket/RPC)
   │
   ▼
[Typescript Streamer] ──▶ [Kafka Topic] ──▶ [Rust Price Impact Consumer]
```

## Quick Start

1. **Start Kafka & Zookeeper** (see `docker-compose.yml`):
   ```sh
   docker-compose up -d
   ```
2. **Run the Typescript streamer:**
   ```sh
   cd ts-swap-streamer
   npm install && npm start
   ```
3. **Run the Rust consumer:**
   ```sh
   cd rust-price-impact
   cargo run
   ```

## Why this fits Kinetic
- Real-time Solana swap ingestion (can be extended to other chains).
- Kafka-based pipeline for scalable, reliable event streaming.
- Rust consumer for high-performance analytics (e.g., price impact, predictive insights).

---

Contact: Siraj Raval

---

*Multi-chain DEX Aggregator & Trading Dashboard*
