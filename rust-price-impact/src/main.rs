use rdkafka::consumer::{Consumer, StreamConsumer};
use rdkafka::config::ClientConfig;
use rdkafka::Message;
use serde::Deserialize;

#[derive(Deserialize, Debug)]
struct SwapEvent {
    signature: String,
    slot: u64,
    logs: Vec<String>,
    timestamp: u64,
}

#[tokio::main]
async fn main() {
    let brokers = "localhost:9092";
    let topic = "solana-swaps";
    let consumer: StreamConsumer = ClientConfig::new()
        .set("group.id", "price-impact-group")
        .set("bootstrap.servers", brokers)
        .create()
        .expect("Consumer creation failed");

    consumer.subscribe(&[topic]).expect("Can't subscribe to topic");
    println!("Listening for swap events from Kafka...");

    let mut prev_price: Option<f64> = None;
    let mut rng = rand::random::<f64>(); // Placeholder for price simulation

    loop {
        match consumer.recv().await {
            Err(e) => println!("Kafka error: {}", e),
            Ok(m) => {
                if let Some(payload) = m.payload() {
                    if let Ok(event) = serde_json::from_slice::<SwapEvent>(payload) {
                        // Price impact stub: simulate price change
                        let price = 100.0 + rand::random::<f64>();
                        let impact = prev_price.map(|p| (price - p) / p * 100.0);
                        println!("Swap: {} | Slot: {} | Impact: {:.4?}%", event.signature, event.slot, impact);
                        prev_price = Some(price);
                    }
                }
            }
        }
    }
}
