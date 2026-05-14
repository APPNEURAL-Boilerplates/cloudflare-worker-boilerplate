export async function consumeQueue(
  batch: MessageBatch<unknown>,
  _env: Env,
  _ctx: ExecutionContext,
): Promise<void> {
  for (const message of batch.messages) {
    console.log(
      JSON.stringify({
        event: "queue_message",
        id: message.id,
        timestamp: message.timestamp.toISOString(),
      }),
    );
    message.ack();
  }
}
